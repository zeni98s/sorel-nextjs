#!/bin/bash

# AI Features Test Script
# Tests all AI endpoints with a sample wallet

echo "🤖 SoReL AI Features Test Script"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BASE_URL="http://localhost:3000"
WALLET="9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"

# Check if server is running
echo "🔍 Checking if server is running..."
if ! curl -s "$BASE_URL/api/" > /dev/null; then
    echo -e "${RED}❌ Server not running!${NC}"
    echo "Please start the server first:"
    echo "  cd /app/nextjs-app && yarn dev"
    exit 1
fi
echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Test 1: Wallet Insights
echo "1️⃣  Testing AI Wallet Insights..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/wallet-insights" \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}")

if echo "$RESPONSE" | grep -q "insights"; then
    echo -e "${GREEN}✅ Wallet Insights: PASS${NC}"
    echo "   Summary: $(echo $RESPONSE | jq -r '.insights.summary' 2>/dev/null | head -c 60)..."
else
    echo -e "${RED}❌ Wallet Insights: FAIL${NC}"
    echo "   Error: $RESPONSE"
fi
echo ""

# Test 2: Risk Assessment
echo "2️⃣  Testing Risk Assessment..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/risk-assessment" \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}")

if echo "$RESPONSE" | grep -q "risk_level"; then
    echo -e "${GREEN}✅ Risk Assessment: PASS${NC}"
    RISK_LEVEL=$(echo $RESPONSE | jq -r '.risk_assessment.risk_level' 2>/dev/null)
    echo "   Risk Level: $RISK_LEVEL"
else
    echo -e "${RED}❌ Risk Assessment: FAIL${NC}"
    echo "   Error: $RESPONSE"
fi
echo ""

# Test 3: Fraud Detection
echo "3️⃣  Testing Fraud Detection..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/fraud-detection" \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}")

if echo "$RESPONSE" | grep -q "fraud_detection"; then
    echo -e "${GREEN}✅ Fraud Detection: PASS${NC}"
    IS_SUSPICIOUS=$(echo $RESPONSE | jq -r '.fraud_detection.is_suspicious' 2>/dev/null)
    echo "   Suspicious: $IS_SUSPICIOUS"
else
    echo -e "${RED}❌ Fraud Detection: FAIL${NC}"
fi
echo ""

# Test 4: Predictions
echo "4️⃣  Testing Predictions..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/predictions" \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}")

if echo "$RESPONSE" | grep -q "predictions"; then
    echo -e "${GREEN}✅ Predictions: PASS${NC}"
    TREND=$(echo $RESPONSE | jq -r '.predictions.trend' 2>/dev/null)
    echo "   Trend: $TREND"
else
    echo -e "${RED}❌ Predictions: FAIL${NC}"
fi
echo ""

# Test 5: Recommendations
echo "5️⃣  Testing Recommendations..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/recommendations" \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}")

if echo "$RESPONSE" | grep -q "recommendations"; then
    echo -e "${GREEN}✅ Recommendations: PASS${NC}"
    REC_COUNT=$(echo $RESPONSE | jq -r '.recommendations.recommendations | length' 2>/dev/null)
    echo "   Recommendations: $REC_COUNT items"
else
    echo -e "${RED}❌ Recommendations: FAIL${NC}"
fi
echo ""

# Test 6: Pattern Analysis
echo "6️⃣  Testing Pattern Analysis..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/pattern-analysis" \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}")

if echo "$RESPONSE" | grep -q "pattern_analysis"; then
    echo -e "${GREEN}✅ Pattern Analysis: PASS${NC}"
    WALLET_TYPE=$(echo $RESPONSE | jq -r '.pattern_analysis.wallet_type' 2>/dev/null)
    echo "   Wallet Type: $WALLET_TYPE"
else
    echo -e "${RED}❌ Pattern Analysis: FAIL${NC}"
fi
echo ""

# Test 7: AI Chat
echo "7️⃣  Testing AI Chat..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is wallet reputation?"}')

if echo "$RESPONSE" | grep -q "response"; then
    echo -e "${GREEN}✅ AI Chat: PASS${NC}"
    CHAT_RESPONSE=$(echo $RESPONSE | jq -r '.response' 2>/dev/null | head -c 60)
    echo "   Response: $CHAT_RESPONSE..."
else
    echo -e "${RED}❌ AI Chat: FAIL${NC}"
fi
echo ""

# Test 8: Report Generation
echo "8️⃣  Testing Report Generation..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/ai/report" \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}")

if echo "$RESPONSE" | grep -q "report"; then
    echo -e "${GREEN}✅ Report Generation: PASS${NC}"
    RATING=$(echo $RESPONSE | jq -r '.report.overall_rating' 2>/dev/null)
    echo "   Overall Rating: $RATING"
else
    echo -e "${RED}❌ Report Generation: FAIL${NC}"
fi
echo ""

echo "=================================="
echo "🎉 AI Features Test Complete!"
echo ""
echo "Next steps:"
echo "1. Check /app/nextjs-app/AI_TESTING_GUIDE.md for detailed testing"
echo "2. Test in browser: http://localhost:3000"
echo "3. Try the AI chat widget (bottom right)"
