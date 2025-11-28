# 🧪 AI Features Testing Guide

## Complete Test Workflow

### 1. 🔍 Test Wallet Analysis with AI Insights

**Steps:**
1. Open http://localhost:3000
2. Click on **"Analyze"** tab
3. Enter this test wallet address:
   ```
   9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
   ```
4. Click **"Analyze"** button
5. Wait for wallet analysis to complete
6. Scroll down to see **"AI Wallet Insights"** card
7. Click **"Generate AI Insights"** button
8. Wait 5-10 seconds for AI to analyze

**Expected Result:**
- ✅ AI summary appears
- ✅ Wallet type shown (e.g., "DeFi Trader")
- ✅ Strengths listed
- ✅ Improvements suggested
- ✅ Risk level displayed (Low/Medium/High)

**Screenshot Location:** AI Insights Card

---

### 2. 🛡️ Test Risk Assessment

**Steps:**
1. After analyzing a wallet (from step 1)
2. Scroll to **"AI Risk Assessment"** card
3. Click **"Run Risk Assessment"** button
4. Wait 5-10 seconds

**Expected Result:**
- ✅ Risk score (0-100)
- ✅ Risk level badge (color-coded)
- ✅ Confidence percentage
- ✅ Risk flags (if any)
- ✅ Recommendations

**What to Check:**
- Low risk = Green badge
- Medium risk = Yellow badge
- High risk = Orange/Red badge

---

### 3. 💬 Test AI Chatbot

**Steps:**
1. Look for floating **chat icon** (bottom right corner)
2. Click the purple chat button
3. Chat window opens
4. Try these test questions:

   **Question 1:**
   ```
   What is a good reputation score?
   ```
   
   **Question 2:**
   ```
   How can I improve my wallet reputation?
   ```
   
   **Question 3:** (with wallet context)
   ```
   Is this wallet safe to interact with?
   ```

5. Wait 3-5 seconds for each response

**Expected Result:**
- ✅ Chat window appears
- ✅ AI responds intelligently
- ✅ Context-aware answers
- ✅ Conversation history maintained

---

### 4. 📊 Test All API Endpoints

**Using curl (Terminal):**

```bash
# Set your wallet address
WALLET="9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"

# Test 1: Wallet Insights
curl -X POST http://localhost:3000/api/ai/wallet-insights \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}" | jq

# Test 2: Risk Assessment
curl -X POST http://localhost:3000/api/ai/risk-assessment \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}" | jq

# Test 3: Fraud Detection
curl -X POST http://localhost:3000/api/ai/fraud-detection \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}" | jq

# Test 4: Predictions
curl -X POST http://localhost:3000/api/ai/predictions \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}" | jq

# Test 5: Recommendations
curl -X POST http://localhost:3000/api/ai/recommendations \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}" | jq

# Test 6: Pattern Analysis
curl -X POST http://localhost:3000/api/ai/pattern-analysis \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}" | jq

# Test 7: AI Chat
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is wallet reputation?"}' | jq

# Test 8: Generate Report
curl -X POST http://localhost:3000/api/ai/report \
  -H "Content-Type: application/json" \
  -d "{\"wallet_address\":\"$WALLET\"}" | jq
```

---

## 🎯 Quick Test Checklist

### Basic Tests (5 minutes)
- [ ] App starts without errors
- [ ] Analyze button works
- [ ] AI Insights generates
- [ ] Risk Assessment runs
- [ ] Chat bot responds

### Advanced Tests (10 minutes)
- [ ] All 8 API endpoints return data
- [ ] Data is saved to MongoDB
- [ ] Multiple wallets can be analyzed
- [ ] AI responses are relevant
- [ ] Error handling works

### UI/UX Tests
- [ ] AI buttons are visible
- [ ] Loading states show
- [ ] Results display properly
- [ ] Chat window is functional
- [ ] Colors and badges correct

---

## 🐛 Troubleshooting

### Error: "AI service unavailable"

**Solution 1:** Check API key
```bash
cd /app/nextjs-app
cat .env.local | grep TOGETHER_API_KEY
```

**Solution 2:** Verify Together.ai key is valid
- Go to https://api.together.xyz/settings/api-keys
- Check if key is active
- Create new key if needed

**Solution 3:** Check logs
```bash
# Check Next.js logs for errors
tail -f /tmp/nextjs_dev.log
```

---

### Error: "Wallet not found"

**Solution:** Analyze wallet first
1. Go to Analyze tab
2. Enter wallet address
3. Click "Analyze" button
4. Wait for analysis to complete
5. Then try AI features

---

### Slow AI responses

**Normal:** AI can take 5-15 seconds
- Llama 3 70B: 10-15 seconds
- Llama 3 8B: 3-5 seconds
- Mixtral: 5-8 seconds

**If very slow (>30 sec):**
- Check internet connection
- Try smaller model (change in .env.local)
- Check Together.ai status

---

### Chat not opening

**Solutions:**
1. Check browser console for errors (F12)
2. Verify port 3000 is accessible
3. Clear browser cache
4. Try different browser

---

## 📈 Testing Results Template

Copy and fill this out:

```
AI Testing Results
==================

Date: ___________
Together.ai API Key: Configured ✅/❌

Feature Tests:
- [ ] Wallet Insights: ✅/❌
- [ ] Risk Assessment: ✅/❌
- [ ] Fraud Detection: ✅/❌
- [ ] Predictions: ✅/❌
- [ ] Recommendations: ✅/❌
- [ ] Pattern Analysis: ✅/❌
- [ ] AI Chatbot: ✅/❌
- [ ] Report Generation: ✅/❌

Performance:
- Wallet Insights: ___ seconds
- Risk Assessment: ___ seconds
- Chat Response: ___ seconds

Quality:
- Insights Accuracy: Good/Fair/Poor
- Risk Assessment: Relevant/Irrelevant
- Chat Responses: Helpful/Generic

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## 🎯 Success Criteria

Your AI features are working correctly if:

✅ All 8 features return valid JSON responses
✅ AI responses are relevant to wallet data
✅ Response time < 15 seconds
✅ No error messages in console
✅ UI updates after AI completion
✅ Chat maintains conversation context
✅ Risk levels are color-coded correctly
✅ MongoDB stores AI results

---

## 💡 Pro Tips

### 1. Test with Different Wallets

Try these wallet addresses:
- Active trader: `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM`
- New wallet: Create any valid 44-char address
- Your wallet: Connect Phantom and analyze

### 2. Monitor API Usage

Check Together.ai dashboard:
- https://api.together.xyz/settings/billing
- Monitor credit usage
- Track request count

### 3. Save Good Examples

When you get great AI responses:
- Screenshot them
- Save to documentation
- Use in demos

### 4. Test Edge Cases

- Very new wallets (0 transactions)
- Wallets with high activity
- Invalid addresses
- Empty inputs

---

## 📞 Need Help?

If AI features aren't working:

1. **Check API Key**: Verify it's correct in .env.local
2. **Check Logs**: Look for error messages
3. **Test API Directly**: Use curl commands
4. **Verify Models**: Ensure model names are correct
5. **Check Credits**: Verify Together.ai has credits

---

## 🎉 Next Steps After Testing

Once all features work:

1. **Optimize Prompts**: Improve AI responses
2. **Add Caching**: Speed up repeated requests
3. **Monitor Costs**: Track API usage
4. **Deploy**: Push to production
5. **Marketing**: Show off AI features!

---

**Happy Testing! 🚀**

Your AI-powered Solana reputation platform is ready!
