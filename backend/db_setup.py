"""
Database Setup and Index Creation for SoReL
Run this script after deployment to create necessary indexes
"""

import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def setup_database():
    """Create indexes for optimal query performance"""
    
    # Connect to MongoDB
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'sorel_production')
    
    print(f"🔗 Connecting to MongoDB: {mongo_url}")
    print(f"📦 Database: {db_name}")
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        # ============================================
        # WALLETS COLLECTION INDEXES
        # ============================================
        print("\n📊 Creating indexes for 'wallets' collection...")
        
        # 1. Unique index on wallet_address (primary lookup field)
        await db.wallets.create_index(
            [("wallet_address", 1)],
            unique=True,
            name="wallet_address_unique_idx"
        )
        print("   ✅ Created unique index on wallet_address")
        
        # 2. Index on reputation_score (for leaderboard sorting)
        await db.wallets.create_index(
            [("reputation_score", -1)],  # Descending for top scores
            name="reputation_score_idx"
        )
        print("   ✅ Created index on reputation_score (descending)")
        
        # 3. Index on last_analyzed (for analytics queries)
        await db.wallets.create_index(
            [("last_analyzed", -1)],  # Descending for recent first
            name="last_analyzed_idx"
        )
        print("   ✅ Created index on last_analyzed")
        
        # 4. Compound index for active wallets analytics
        await db.wallets.create_index(
            [("last_analyzed", -1), ("reputation_score", -1)],
            name="last_analyzed_reputation_idx"
        )
        print("   ✅ Created compound index on last_analyzed + reputation_score")
        
        # ============================================
        # REPUTATION_HISTORY COLLECTION INDEXES
        # ============================================
        print("\n📈 Creating indexes for 'reputation_history' collection...")
        
        # 1. Index on wallet_address (for wallet history lookups)
        await db.reputation_history.create_index(
            [("wallet_address", 1)],
            name="history_wallet_address_idx"
        )
        print("   ✅ Created index on wallet_address")
        
        # 2. Index on timestamp (for trend analysis)
        await db.reputation_history.create_index(
            [("timestamp", -1)],  # Descending for recent first
            name="history_timestamp_idx"
        )
        print("   ✅ Created index on timestamp")
        
        # 3. Compound index for wallet history queries
        await db.reputation_history.create_index(
            [("wallet_address", 1), ("timestamp", -1)],
            name="history_wallet_timestamp_idx"
        )
        print("   ✅ Created compound index on wallet_address + timestamp")
        
        # 4. Index for trend aggregations
        await db.reputation_history.create_index(
            [("timestamp", 1), ("score", 1)],
            name="history_timestamp_score_idx"
        )
        print("   ✅ Created compound index on timestamp + score")
        
        # ============================================
        # VERIFY INDEXES
        # ============================================
        print("\n🔍 Verifying indexes...")
        
        wallets_indexes = await db.wallets.index_information()
        history_indexes = await db.reputation_history.index_information()
        
        print(f"\n📋 Wallets collection indexes ({len(wallets_indexes)}):")
        for idx_name, idx_info in wallets_indexes.items():
            print(f"   - {idx_name}: {idx_info['key']}")
        
        print(f"\n📋 Reputation history indexes ({len(history_indexes)}):")
        for idx_name, idx_info in history_indexes.items():
            print(f"   - {idx_name}: {idx_info['key']}")
        
        # ============================================
        # COLLECTION STATS
        # ============================================
        print("\n📊 Collection Statistics:")
        
        wallet_count = await db.wallets.count_documents({})
        history_count = await db.reputation_history.count_documents({})
        
        print(f"   - Wallets: {wallet_count:,} documents")
        print(f"   - History: {history_count:,} documents")
        
        print("\n✅ Database setup completed successfully!")
        print("\n💡 Performance Tips:")
        print("   - Indexes will improve query speed significantly")
        print("   - Monitor index usage with db.collection.explain()")
        print("   - Consider TTL index if you want to expire old history")
        print("   - Rebuild indexes periodically: db.collection.reIndex()")
        
    except Exception as e:
        print(f"\n❌ Error during database setup: {e}")
        raise
    finally:
        client.close()
        print("\n🔌 Database connection closed")

async def drop_indexes():
    """Drop all custom indexes (use for cleanup/reset)"""
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'sorel_production')
    
    print(f"🔗 Connecting to MongoDB: {mongo_url}")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        print("\n🗑️  Dropping custom indexes...")
        
        # Drop all indexes except _id
        await db.wallets.drop_indexes()
        await db.reputation_history.drop_indexes()
        
        print("✅ All custom indexes dropped")
        
    except Exception as e:
        print(f"❌ Error dropping indexes: {e}")
    finally:
        client.close()

async def show_query_performance():
    """Show example queries with explain plans"""
    
    mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
    db_name = os.environ.get('DB_NAME', 'sorel_production')
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    try:
        print("\n🔬 Query Performance Analysis:")
        
        # Test leaderboard query
        print("\n1. Leaderboard Query:")
        cursor = db.wallets.find({}).sort("reputation_score", -1).limit(50)
        explain = await cursor.explain()
        
        execution_stats = explain.get('executionStats', {})
        print(f"   - Documents examined: {execution_stats.get('totalDocsExamined', 0)}")
        print(f"   - Documents returned: {execution_stats.get('nReturned', 0)}")
        print(f"   - Execution time: {execution_stats.get('executionTimeMillis', 0)}ms")
        print(f"   - Index used: {explain.get('queryPlanner', {}).get('winningPlan', {}).get('inputStage', {}).get('indexName', 'NONE')}")
        
    except Exception as e:
        print(f"❌ Error analyzing performance: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "drop":
        print("⚠️  WARNING: This will drop all indexes!")
        confirm = input("Type 'yes' to confirm: ")
        if confirm.lower() == 'yes':
            asyncio.run(drop_indexes())
        else:
            print("❌ Cancelled")
    elif len(sys.argv) > 1 and sys.argv[1] == "analyze":
        asyncio.run(show_query_performance())
    else:
        asyncio.run(setup_database())
