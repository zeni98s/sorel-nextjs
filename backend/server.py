from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
import json
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Solana RPC
HELIUS_RPC = os.environ.get('HELIUS_RPC_URL')
solana_client = AsyncClient(HELIUS_RPC)

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

# Models
class WalletMetrics(BaseModel):
    transaction_count: int = 0
    total_volume: float = 0.0
    contract_interactions: int = 0
    wallet_age_days: int = 0
    activity_frequency: float = 0.0
    unique_programs: int = 0

class WalletData(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    wallet_address: str
    reputation_score: float
    metrics: WalletMetrics
    last_analyzed: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    rank: Optional[int] = None

class WalletAnalysisRequest(BaseModel):
    wallet_address: str

class AnalyticsStats(BaseModel):
    total_wallets_analyzed: int
    average_reputation: float
    total_transactions: int
    active_wallets_24h: int

class ReputationTrend(BaseModel):
    date: str
    average_score: float
    wallet_count: int

# Reputation Scoring Algorithm
class ReputationEngine:
    WEIGHTS = {
        'transaction_volume': 0.30,
        'transaction_frequency': 0.25,
        'wallet_age': 0.15,
        'contract_interactions': 0.20,
        'network_participation': 0.10
    }
    
    MAX_SCORE = 1000
    
    @staticmethod
    def calculate_score(metrics: WalletMetrics) -> float:
        """Calculate reputation score based on wallet metrics"""
        
        # Transaction volume score (0-300 points)
        volume_score = min(metrics.total_volume / 100, 300)
        
        # Transaction frequency score (0-250 points)
        frequency_score = min(metrics.activity_frequency * 50, 250)
        
        # Wallet age score (0-150 points)
        age_score = min(metrics.wallet_age_days / 2, 150)
        
        # Contract interactions score (0-200 points)
        contract_score = min(metrics.contract_interactions * 2, 200)
        
        # Network participation (unique programs) score (0-100 points)
        participation_score = min(metrics.unique_programs * 10, 100)
        
        total_score = (
            volume_score +
            frequency_score +
            age_score +
            contract_score +
            participation_score
        )
        
        return min(total_score, ReputationEngine.MAX_SCORE)

# Solana Data Fetcher
class SolanaDataFetcher:
    def __init__(self, rpc_url: str):
        self.rpc_url = rpc_url
        self.client = AsyncClient(rpc_url)
    
    async def get_wallet_transactions(self, wallet_address: str, limit: int = 100):
        """Fetch recent transactions for a wallet"""
        try:
            pubkey = Pubkey.from_string(wallet_address)
            response = await self.client.get_signatures_for_address(pubkey, limit=limit)
            
            if response.value:
                return response.value
            return []
        except Exception as e:
            logger.error(f"Error fetching transactions: {e}")
            return []
    
    async def analyze_wallet(self, wallet_address: str) -> WalletMetrics:
        """Analyze wallet and return metrics"""
        try:
            transactions = await self.get_wallet_transactions(wallet_address)
            
            if not transactions:
                return WalletMetrics()
            
            # Calculate metrics
            transaction_count = len(transactions)
            
            # Get account info for balance
            pubkey = Pubkey.from_string(wallet_address)
            balance_response = await self.client.get_balance(pubkey)
            balance = balance_response.value / 1e9 if balance_response.value else 0
            
            # Estimate total volume (simplified)
            total_volume = balance + (transaction_count * 0.1)
            
            # Calculate wallet age from oldest transaction
            oldest_tx = transactions[-1] if transactions else None
            wallet_age_days = 0
            if oldest_tx and oldest_tx.block_time:
                age_seconds = datetime.now(timezone.utc).timestamp() - oldest_tx.block_time
                wallet_age_days = int(age_seconds / 86400)
            
            # Activity frequency (transactions per day)
            activity_frequency = transaction_count / max(wallet_age_days, 1)
            
            # Contract interactions (estimate from transaction types)
            contract_interactions = int(transaction_count * 0.6)  # Simplified estimation
            
            # Unique programs (simplified)
            unique_programs = min(int(transaction_count * 0.3), 20)
            
            return WalletMetrics(
                transaction_count=transaction_count,
                total_volume=round(total_volume, 2),
                contract_interactions=contract_interactions,
                wallet_age_days=wallet_age_days,
                activity_frequency=round(activity_frequency, 2),
                unique_programs=unique_programs
            )
        except Exception as e:
            logger.error(f"Error analyzing wallet: {e}")
            return WalletMetrics()
    
    async def close(self):
        await self.client.close()

fetcher = SolanaDataFetcher(HELIUS_RPC)

# API Routes
@api_router.get("/")
async def root():
    return {"message": "SoReL - Solana Reputation Layer API"}

@api_router.post("/wallets/analyze", response_model=WalletData)
async def analyze_wallet(request: WalletAnalysisRequest):
    """Analyze a wallet and calculate reputation score"""
    try:
        wallet_address = request.wallet_address
        
        # Validate wallet address format
        if not wallet_address or len(wallet_address) < 32 or len(wallet_address) > 44:
            raise HTTPException(status_code=400, detail="Invalid Solana wallet address format")
        
        # Try to parse the address to validate it
        try:
            Pubkey.from_string(wallet_address)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid Solana wallet address")
        
        # Check if wallet exists in DB
        existing_wallet = await db.wallets.find_one({"wallet_address": wallet_address}, {"_id": 0})
        
        # Fetch and analyze wallet data from Solana
        metrics = await fetcher.analyze_wallet(wallet_address)
        
        # Calculate reputation score
        reputation_score = ReputationEngine.calculate_score(metrics)
        
        # Create wallet data
        wallet_data = WalletData(
            wallet_address=wallet_address,
            reputation_score=round(reputation_score, 2),
            metrics=metrics,
            last_analyzed=datetime.now(timezone.utc)
        )
        
        # Save to database
        doc = wallet_data.model_dump()
        doc['last_analyzed'] = doc['last_analyzed'].isoformat()
        
        await db.wallets.update_one(
            {"wallet_address": wallet_address},
            {"$set": doc},
            upsert=True
        )
        
        # Save to history
        history_doc = {
            "wallet_address": wallet_address,
            "score": reputation_score,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await db.reputation_history.insert_one(history_doc)
        
        return wallet_data
    except Exception as e:
        logger.error(f"Error in analyze_wallet: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/wallets/{wallet_address}", response_model=WalletData)
async def get_wallet(wallet_address: str):
    """Get wallet reputation details"""
    wallet = await db.wallets.find_one({"wallet_address": wallet_address}, {"_id": 0})
    
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")
    
    if isinstance(wallet['last_analyzed'], str):
        wallet['last_analyzed'] = datetime.fromisoformat(wallet['last_analyzed'])
    
    return wallet

@api_router.get("/wallets/leaderboard/top", response_model=List[WalletData])
async def get_leaderboard(limit: int = 100):
    """Get top wallets by reputation score"""
    wallets = await db.wallets.find({}, {"_id": 0}).sort("reputation_score", -1).limit(limit).to_list(limit)
    
    for i, wallet in enumerate(wallets):
        if isinstance(wallet['last_analyzed'], str):
            wallet['last_analyzed'] = datetime.fromisoformat(wallet['last_analyzed'])
        wallet['rank'] = i + 1
    
    return wallets

@api_router.get("/analytics/stats", response_model=AnalyticsStats)
async def get_analytics_stats():
    """Get overall platform statistics"""
    total_wallets = await db.wallets.count_documents({})
    
    # Calculate average reputation
    pipeline = [
        {"$group": {
            "_id": None,
            "avg_reputation": {"$avg": "$reputation_score"},
            "total_transactions": {"$sum": "$metrics.transaction_count"}
        }}
    ]
    result = await db.wallets.aggregate(pipeline).to_list(1)
    
    avg_reputation = result[0]['avg_reputation'] if result else 0
    total_transactions = result[0]['total_transactions'] if result else 0
    
    # Active wallets in last 24h
    yesterday = datetime.now(timezone.utc) - timedelta(days=1)
    active_wallets = await db.wallets.count_documents({
        "last_analyzed": {"$gte": yesterday.isoformat()}
    })
    
    return AnalyticsStats(
        total_wallets_analyzed=total_wallets,
        average_reputation=round(avg_reputation, 2),
        total_transactions=total_transactions,
        active_wallets_24h=active_wallets
    )

@api_router.get("/analytics/trends", response_model=List[ReputationTrend])
async def get_reputation_trends(days: int = 7):
    """Get historical reputation trends"""
    try:
        # Get data from last N days
        start_date = datetime.now(timezone.utc) - timedelta(days=days)
        
        pipeline = [
            {
                "$match": {
                    "timestamp": {"$gte": start_date.isoformat()}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": {"$toDate": "$timestamp"}
                        }
                    },
                    "average_score": {"$avg": "$score"},
                    "wallet_count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        results = await db.reputation_history.aggregate(pipeline).to_list(days)
        
        trends = [
            ReputationTrend(
                date=r['_id'],
                average_score=round(r['average_score'], 2),
                wallet_count=r['wallet_count']
            )
            for r in results
        ]
        
        return trends
    except Exception as e:
        logger.error(f"Error getting trends: {e}")
        return []

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    await fetcher.close()
