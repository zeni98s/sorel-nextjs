#!/bin/bash
# Quick health check script for SoReL

echo "🏥 SoReL Health Check"
echo "===================\n"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_endpoint() {
    local name=$1
    local url=$2
    
    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ OK${NC} (HTTP $response)"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $response)"
        return 1
    fi
}

# Load backend URL from .env if exists
if [ -f "backend/.env" ]; then
    source <(grep HELIUS_RPC_URL backend/.env | sed 's/^/export /')
fi

if [ -f "frontend/.env" ]; then
    source <(grep REACT_APP_BACKEND_URL frontend/.env | sed 's/^/export /')
fi

# Check backend
if [ -n "$REACT_APP_BACKEND_URL" ]; then
    echo "📡 Backend Health:"
    check_endpoint "API Root" "$REACT_APP_BACKEND_URL/api/"
    check_endpoint "Analytics Stats" "$REACT_APP_BACKEND_URL/api/analytics/stats"
    check_endpoint "Leaderboard" "$REACT_APP_BACKEND_URL/api/wallets/leaderboard/top?limit=1"
    echo ""
else
    echo -e "${YELLOW}⚠️  Backend URL not configured${NC}\n"
fi

# Check RPC
if [ -n "$HELIUS_RPC_URL" ]; then
    echo "⛓️  Solana RPC Health:"
    cd backend 2>/dev/null
    if [ -f "monitoring.py" ]; then
        python3 monitoring.py 2>/dev/null | grep -E "(Status|Response Times|Blockchain Info)" | head -10
    else
        echo -e "${YELLOW}⚠️  Monitoring script not found${NC}"
    fi
    cd - >/dev/null 2>&1
    echo ""
else
    echo -e "${YELLOW}⚠️  RPC URL not configured${NC}\n"
fi

# Check database
echo "🗄️  Database Health:"
if command -v mongosh &> /dev/null; then
    if [ -f "backend/.env" ]; then
        source <(grep MONGO_URL backend/.env | sed 's/^/export /')
        if [ -n "$MONGO_URL" ]; then
            if mongosh "$MONGO_URL" --eval "db.adminCommand('ping')" --quiet >/dev/null 2>&1; then
                echo -e "${GREEN}✅ MongoDB Connected${NC}"
                
                # Get collection stats
                wallet_count=$(mongosh "$MONGO_URL" --eval "db.wallets.countDocuments()" --quiet 2>/dev/null)
                history_count=$(mongosh "$MONGO_URL" --eval "db.reputation_history.countDocuments()" --quiet 2>/dev/null)
                
                echo "   - Wallets: $wallet_count"
                echo "   - History: $history_count"
            else
                echo -e "${RED}❌ MongoDB Connection Failed${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  MONGO_URL not configured${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Backend .env not found${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  mongosh not installed (skipping database check)${NC}"
fi

echo "\n✨ Health check complete!"
