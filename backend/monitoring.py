"""
RPC Endpoint Monitoring and Health Checks for SoReL
Monitors Helius RPC endpoint availability and performance
"""

import asyncio
import time
import os
from datetime import datetime, timezone
from typing import Dict, Optional
import httpx
from solana.rpc.async_api import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import logging

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class RPCMonitor:
    """Monitor Solana RPC endpoint health and performance"""
    
    def __init__(self, rpc_url: str, mongo_url: str, db_name: str):
        self.rpc_url = rpc_url
        self.solana_client = AsyncClient(rpc_url)
        self.mongo_client = AsyncIOMotorClient(mongo_url)
        self.db = self.mongo_client[db_name]
        self.metrics_collection = self.db['rpc_metrics']
        
    async def check_rpc_health(self) -> Dict:
        """Check RPC endpoint health and response time"""
        start_time = time.time()
        
        try:
            # Test 1: Get version (lightweight call)
            version_response = await self.solana_client.get_version()
            version_time = time.time() - start_time
            
            # Test 2: Get slot (blockchain height)
            slot_start = time.time()
            slot_response = await self.solana_client.get_slot()
            slot_time = time.time() - slot_start
            
            # Test 3: Get epoch info
            epoch_start = time.time()
            epoch_response = await self.solana_client.get_epoch_info()
            epoch_time = time.time() - epoch_start
            
            total_time = time.time() - start_time
            
            result = {
                'status': 'healthy',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'rpc_url': self.rpc_url,
                'response_times': {
                    'get_version': round(version_time * 1000, 2),  # ms
                    'get_slot': round(slot_time * 1000, 2),
                    'get_epoch_info': round(epoch_time * 1000, 2),
                    'total': round(total_time * 1000, 2)
                },
                'blockchain_info': {
                    'version': str(version_response.value) if version_response.value else None,
                    'slot': slot_response.value if slot_response.value else None,
                    'epoch': epoch_response.value.epoch if epoch_response.value else None
                },
                'errors': None
            }
            
            # Determine health status based on response time
            avg_response_time = total_time / 3
            if avg_response_time > 2.0:
                result['status'] = 'degraded'
                result['warning'] = 'High response time detected'
            elif avg_response_time > 5.0:
                result['status'] = 'unhealthy'
                result['warning'] = 'Very high response time'
            
            return result
            
        except Exception as e:
            return {
                'status': 'unhealthy',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'rpc_url': self.rpc_url,
                'response_times': {
                    'total': round((time.time() - start_time) * 1000, 2)
                },
                'errors': str(e)
            }
    
    async def check_rate_limits(self) -> Dict:
        """Check if RPC endpoint is rate limiting"""
        try:
            # Make multiple rapid requests to test rate limiting
            results = []
            for i in range(5):
                start = time.time()
                try:
                    await self.solana_client.get_slot()
                    results.append({
                        'request': i + 1,
                        'success': True,
                        'time': round((time.time() - start) * 1000, 2)
                    })
                except Exception as e:
                    results.append({
                        'request': i + 1,
                        'success': False,
                        'error': str(e)
                    })
                
                await asyncio.sleep(0.1)  # Small delay
            
            success_count = sum(1 for r in results if r['success'])
            
            return {
                'total_requests': len(results),
                'successful_requests': success_count,
                'failed_requests': len(results) - success_count,
                'rate_limited': success_count < len(results),
                'results': results
            }
            
        except Exception as e:
            return {
                'error': str(e)
            }
    
    async def store_metrics(self, metrics: Dict):
        """Store monitoring metrics in database"""
        try:
            await self.metrics_collection.insert_one(metrics)
        except Exception as e:
            logger.error(f"Failed to store metrics: {e}")
    
    async def get_recent_metrics(self, hours: int = 24) -> list:
        """Get recent monitoring metrics"""
        try:
            from datetime import timedelta
            cutoff = (datetime.now(timezone.utc) - timedelta(hours=hours)).isoformat()
            
            metrics = await self.metrics_collection.find(
                {'timestamp': {'$gte': cutoff}},
                {'_id': 0}
            ).sort('timestamp', -1).to_list(1000)
            
            return metrics
        except Exception as e:
            logger.error(f"Failed to retrieve metrics: {e}")
            return []
    
    async def get_uptime_stats(self, hours: int = 24) -> Dict:
        """Calculate uptime statistics"""
        try:
            metrics = await self.get_recent_metrics(hours)
            
            if not metrics:
                return {'error': 'No metrics available'}
            
            total = len(metrics)
            healthy = sum(1 for m in metrics if m.get('status') == 'healthy')
            degraded = sum(1 for m in metrics if m.get('status') == 'degraded')
            unhealthy = sum(1 for m in metrics if m.get('status') == 'unhealthy')
            
            avg_response_time = sum(
                m.get('response_times', {}).get('total', 0) 
                for m in metrics
            ) / total if total > 0 else 0
            
            return {
                'period_hours': hours,
                'total_checks': total,
                'healthy_checks': healthy,
                'degraded_checks': degraded,
                'unhealthy_checks': unhealthy,
                'uptime_percentage': round((healthy / total) * 100, 2) if total > 0 else 0,
                'availability_percentage': round(((healthy + degraded) / total) * 100, 2) if total > 0 else 0,
                'average_response_time_ms': round(avg_response_time, 2)
            }
            
        except Exception as e:
            logger.error(f"Failed to calculate uptime: {e}")
            return {'error': str(e)}
    
    async def close(self):
        """Close connections"""
        await self.solana_client.close()
        self.mongo_client.close()

async def continuous_monitoring(interval_seconds: int = 60):
    """Run continuous monitoring loop"""
    
    rpc_url = os.environ.get('HELIUS_RPC_URL')
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'sorel_production')
    
    if not rpc_url:
        logger.error("HELIUS_RPC_URL not configured")
        return
    
    monitor = RPCMonitor(rpc_url, mongo_url, db_name)
    
    logger.info(f"🚀 Starting RPC monitoring (interval: {interval_seconds}s)")
    logger.info(f"📡 RPC URL: {rpc_url}")
    
    try:
        iteration = 0
        while True:
            iteration += 1
            logger.info(f"\n{'='*60}")
            logger.info(f"🔍 Health Check #{iteration} - {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
            logger.info(f"{'='*60}")
            
            # Run health check
            health_result = await monitor.check_rpc_health()
            
            # Log results
            status_emoji = {
                'healthy': '✅',
                'degraded': '⚠️',
                'unhealthy': '❌'
            }.get(health_result['status'], '❓')
            
            logger.info(f"{status_emoji} Status: {health_result['status'].upper()}")
            
            if health_result.get('response_times'):
                logger.info(f"⏱️  Response Times:")
                for test, time_ms in health_result['response_times'].items():
                    logger.info(f"   - {test}: {time_ms}ms")
            
            if health_result.get('blockchain_info'):
                info = health_result['blockchain_info']
                logger.info(f"⛓️  Blockchain Info:")
                logger.info(f"   - Slot: {info.get('slot', 'N/A')}")
                logger.info(f"   - Epoch: {info.get('epoch', 'N/A')}")
            
            if health_result.get('errors'):
                logger.error(f"❌ Errors: {health_result['errors']}")
            
            # Store metrics
            await monitor.store_metrics(health_result)
            
            # Show uptime stats every 10 checks
            if iteration % 10 == 0:
                logger.info(f"\n📊 Uptime Statistics (Last 24h):")
                stats = await monitor.get_uptime_stats(24)
                if 'error' not in stats:
                    logger.info(f"   - Uptime: {stats['uptime_percentage']}%")
                    logger.info(f"   - Availability: {stats['availability_percentage']}%")
                    logger.info(f"   - Avg Response: {stats['average_response_time_ms']}ms")
                    logger.info(f"   - Total Checks: {stats['total_checks']}")
            
            # Wait for next check
            await asyncio.sleep(interval_seconds)
            
    except KeyboardInterrupt:
        logger.info("\n\n⏹️  Monitoring stopped by user")
    except Exception as e:
        logger.error(f"❌ Monitoring error: {e}")
    finally:
        await monitor.close()
        logger.info("🔌 Connections closed")

async def single_check():
    """Run a single health check"""
    
    rpc_url = os.environ.get('HELIUS_RPC_URL')
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'sorel_production')
    
    if not rpc_url:
        print("❌ HELIUS_RPC_URL not configured")
        return
    
    monitor = RPCMonitor(rpc_url, mongo_url, db_name)
    
    try:
        print("🔍 Running RPC Health Check...")
        print(f"📡 RPC URL: {rpc_url}\n")
        
        # Health check
        health = await monitor.check_rpc_health()
        
        print(f"Status: {health['status'].upper()}")
        print(f"\nResponse Times:")
        for test, time_ms in health.get('response_times', {}).items():
            print(f"  - {test}: {time_ms}ms")
        
        if health.get('blockchain_info'):
            print(f"\nBlockchain Info:")
            for key, value in health['blockchain_info'].items():
                print(f"  - {key}: {value}")
        
        if health.get('errors'):
            print(f"\n❌ Errors: {health['errors']}")
        
        # Rate limit check
        print(f"\n🔄 Testing Rate Limits...")
        rate_check = await monitor.check_rate_limits()
        print(f"  - Successful: {rate_check.get('successful_requests', 0)}/{rate_check.get('total_requests', 0)}")
        print(f"  - Rate Limited: {'Yes' if rate_check.get('rate_limited') else 'No'}")
        
        # Store result
        await monitor.store_metrics(health)
        print(f"\n💾 Metrics stored in database")
        
        # Show recent stats
        print(f"\n📊 Recent Statistics (24h):")
        stats = await monitor.get_uptime_stats(24)
        if 'error' not in stats:
            print(f"  - Uptime: {stats['uptime_percentage']}%")
            print(f"  - Avg Response: {stats['average_response_time_ms']}ms")
            print(f"  - Total Checks: {stats['total_checks']}")
        
    finally:
        await monitor.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "monitor":
        # Continuous monitoring
        interval = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        asyncio.run(continuous_monitoring(interval))
    else:
        # Single check
        asyncio.run(single_check())
