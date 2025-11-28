# 🚀 Quick Start: Testing AI Features in 5 Minutes

## Option 1: Interactive Test (Recommended)

### Step 1: Get API Key (1 minute)
Visit: **https://api.together.xyz/signup**
- Sign up (free)
- Go to Settings > API Keys
- Create new key
- Copy it

### Step 2: Configure (30 seconds)
```bash
cd /app/nextjs-app
nano .env.local

# Add this line (replace with your key):
TOGETHER_API_KEY=your_actual_key_here

# Save: Ctrl+X, Y, Enter
```

### Step 3: Start App (30 seconds)
```bash
cd /app/nextjs-app
yarn dev
```

Wait for: `✓ Ready on http://localhost:3000`

### Step 4: Test in Browser (3 minutes)

**Open**: http://localhost:3000

1. **Click "Analyze" tab**
2. **Enter wallet**: `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM`
3. **Click "Analyze"** button
4. **Wait** for analysis (10 seconds)
5. **Scroll down** to see "AI Wallet Insights"
6. **Click "Generate AI Insights"**
7. **Watch** AI analyze the wallet! ✨

**Test Chat:**
1. **Look bottom-right** for purple chat button
2. **Click it**
3. **Ask**: "What is a good reputation score?"
4. **See** AI respond!

---

## Option 2: Command Line Test

### Quick API Test (No browser needed)

```bash
# 1. Start app (in one terminal)
cd /app/nextjs-app
yarn dev

# 2. In another terminal, run test script
cd /app/nextjs-app
./test-ai.sh
```

This will test all 8 AI features automatically!

---

## Option 3: DEMO Mode (No API Key Needed!)

Want to see the UI without AI?

```bash
cd /app/nextjs-app
yarn dev
# Just browse the UI - AI buttons will be there
# They won't work without API key, but you can see the design
```

---

## 🎯 What to Expect

### AI Wallet Insights
```
🤖 AI Analysis

Summary:
"This wallet demonstrates strong DeFi engagement 
with consistent activity..."

Wallet Type: DeFi Trader

Strengths:
✓ High transaction volume
✓ Diverse protocol interactions
✓ Consistent activity pattern

Risk Level: 🟢 Low
```

### Risk Assessment
```
🛡️ Risk Assessment

Risk Score: 15/100
Risk Level: Low ✅
Confidence: 87%

Analysis:
"Wallet shows normal trading patterns with 
no suspicious indicators..."
```

### AI Chat
```
💬 You: What is wallet reputation?

🤖 AI: Wallet reputation is a score that 
measures the trustworthiness and activity 
of a Solana wallet based on transaction 
history, volume, and behavior patterns...
```

---

## 📱 Visual Guide

```
┌─────────────────────────────────────────┐
│  SoReL - Analyze Tab                    │
├─────────────────────────────────────────┤
│                                         │
│  [Enter wallet address...]  [Analyze]  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ Reputation Score: 892           │  │
│  │ ⭐⭐⭐⭐⭐ Excellent             │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ 🤖 AI Wallet Insights           │  │
│  │ [Generate AI Insights]          │  │← Click here!
│  └─────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ 🛡️ AI Risk Assessment           │  │
│  │ [Run Risk Assessment]           │  │← And here!
│  └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
                                    [💬]  ← Chat button
```

---

## ⚡ Troubleshooting

### "Server not running"
```bash
cd /app/nextjs-app
yarn dev
# Wait for "Ready on http://localhost:3000"
```

### "AI service unavailable"
- Check API key in .env.local
- Verify it's correct (no spaces)
- Try creating a new key

### "Wallet not found"
- Click "Analyze" button first
- Wait for analysis to complete
- Then try AI features

### Slow responses (>30 sec)
- Normal for first request (model loading)
- Subsequent requests should be faster
- Check internet connection

---

## 🎓 Testing Checklist

- [ ] Got Together.ai API key
- [ ] Added key to .env.local
- [ ] Started app with `yarn dev`
- [ ] Analyzed a wallet
- [ ] Generated AI insights
- [ ] Ran risk assessment
- [ ] Tested chat bot
- [ ] Saw all features working

---

## 📚 Full Documentation

- **Detailed Guide**: `/app/nextjs-app/AI_TESTING_GUIDE.md`
- **Test Script**: `/app/nextjs-app/test-ai.sh`
- **AI Service**: `/app/nextjs-app/lib/ai.js`

---

## 🎉 Success!

If you see AI responses, congratulations! 

Your app now has:
- ✅ AI-powered insights
- ✅ Risk assessment
- ✅ Fraud detection
- ✅ Predictive scoring
- ✅ Smart recommendations
- ✅ AI chatbot
- ✅ Pattern analysis
- ✅ Report generation

**All powered by open source models!** 🚀

---

## 💡 Pro Tips

1. **Save Good Responses**: Screenshot impressive AI outputs
2. **Test Different Wallets**: Try various addresses
3. **Monitor Usage**: Check Together.ai dashboard
4. **Optimize Prompts**: Edit `/lib/ai.js` to improve responses
5. **Cache Results**: Add caching to save API calls

---

**Need help?** Check the full testing guide:
```bash
cat /app/nextjs-app/AI_TESTING_GUIDE.md
```

**Happy Testing! 🚀**
