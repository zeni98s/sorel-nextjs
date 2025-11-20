# 🎭 SoReL BETA - Run Without Backend

## Quick Start (No Backend Required!)

### Option 1: One-Command Deploy (Recommended)

```bash
cd /app
chmod +x scripts/deploy-beta.sh
./scripts/deploy-beta.sh
```

This will:
1. Configure BETA mode
2. Install dependencies  
3. Build the app
4. Deploy to Vercel/Netlify

**Time**: 2-3 minutes
**Cost**: $0

---

### Option 2: Local Development

```bash
cd /app/frontend

# Configure for demo mode
echo "REACT_APP_BACKEND_URL=" > .env.local

# Install and run
yarn install
yarn start

# Opens at http://localhost:3000
```

---

## ✨ What You Get

### Full Featured UI
- ✅ Wallet analysis interface
- ✅ Interactive dashboard with charts
- ✅ Leaderboard with rankings
- ✅ All animations and styling
- ✅ Mobile responsive

### Demo Data
- 🎭 Simulated wallet scores
- 🎭 Mock blockchain metrics
- 🎭 Realistic analytics
- 🎭 Sample trends

### Perfect For
- 👔 Investor demos
- 🧪 User testing
- 🎨 UI/UX validation
- 📊 Stakeholder presentations
- 🚀 Beta launch

---

## 🎮 How It Works

The app automatically detects when backend is unavailable and switches to demo mode:

```javascript
// Automatic fallback to mock data
if (!REACT_APP_BACKEND_URL || backendUnreachable) {
  useMockData();
}
```

### Demo Mode Features

1. **Visual Banner**
   - Shows "BETA Version - Demo Mode"
   - Orange/amber color scheme
   - Dismissible notification

2. **Simulated Analysis**
   - Enter any Solana address
   - Get instant mock results
   - No blockchain queries
   - Realistic scores

3. **Mock Data**
   - Pre-populated leaderboard
   - Sample analytics
   - Trend charts
   - Performance metrics

---

## 📦 Deployment Options

### 🌟 Vercel (Easiest)

```bash
cd /app/frontend

# Configure BETA
echo "REACT_APP_BACKEND_URL=" > .env.production

# Deploy
vercel --prod

# Done! Live in ~2 minutes
```

**Features:**
- Free tier available
- Automatic HTTPS
- Global CDN
- GitHub integration
- Environment variables

**URL Example**: `https://sorel-beta.vercel.app`

---

### 🔷 Netlify

```bash
cd /app/frontend

# Install CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod

# Live!
```

**Features:**
- Free tier available
- Easy setup
- Form handling
- Analytics included

---

### 📄 GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/sorel",
"scripts": {
  "deploy": "gh-pages -d build"
}

# Install
yarn add --dev gh-pages

# Deploy
yarn build
yarn deploy
```

**Features:**
- Completely free
- GitHub integration
- Custom domains

---

### ☁️ Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub repo
3. Build command: `yarn build`
4. Output: `build`
5. Deploy!

**Features:**
- Free unlimited requests
- Super fast CDN
- DDoS protection

---

## 🧪 Testing the BETA

### Test Wallet Analysis

```bash
# In the app, enter this address:
9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM

# Click "Analyze"
# You'll see: Reputation Score: 892 (Excellent)
```

### Test Different Addresses

Any valid-looking Solana address will work:
- Short: `abc123...xyz789`
- Full: 44 characters
- Random characters

The app generates realistic scores based on the address.

---

## 🎨 Customization

### Add Your Own Mock Wallets

Edit `/app/frontend/src/services/mockData.js`:

```javascript
const mockWallets = [
  {
    wallet_address: "YOUR_ADDRESS_HERE",
    reputation_score: 950,
    metrics: {
      transaction_count: 2500,
      total_volume: 125000.50,
      contract_interactions: 1800,
      wallet_age_days: 365,
      activity_frequency: 6.85,
      unique_programs: 20
    }
  }
];
```

### Change Demo Banner Message

Edit `/app/frontend/src/components/DemoBanner.js`:

```javascript
<span className="font-semibold">
  YOUR CUSTOM MESSAGE
</span>
```

### Adjust Simulation Delay

```javascript
// In mockData.js - line ~200
const delay = (ms = 800) => // Faster: 400, Slower: 1500
```

---

## 🔄 Switching Modes

### Enable Demo Mode (Force)

```javascript
// Browser console
localStorage.setItem('sorel_demo_mode', 'true');
location.reload();
```

### Disable Demo Mode

```javascript
// Browser console
localStorage.setItem('sorel_demo_mode', 'false');
location.reload();
```

### Check Current Mode

```javascript
// Browser console
console.log('Demo mode:', 
  localStorage.getItem('sorel_demo_mode'));
```

---

## 📊 Analytics in BETA

Track BETA usage:

```bash
# Add to .env
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
```

```javascript
// In App.js
import ReactGA from 'react-ga4';

useEffect(() => {
  if (apiService.isUsingMockData()) {
    ReactGA.event({
      category: 'Demo Mode',
      action: 'Page View'
    });
  }
}, []);
```

---

## 🚀 Upgrade to Production

When ready for real backend:

### Step 1: Deploy Backend

```bash
cd /app/backend
railway up
```

### Step 2: Update Frontend

```bash
cd /app/frontend

# Update .env.production
REACT_APP_BACKEND_URL=https://your-backend.up.railway.app

# Redeploy
vercel --prod
```

The app automatically detects the backend and exits demo mode!

---

## 🐛 Troubleshooting

### Issue: Demo banner not showing

```bash
# Clear local storage
localStorage.clear();
location.reload();
```

### Issue: Charts not rendering

```bash
# Rebuild
cd /app/frontend
rm -rf node_modules build
yarn install
yarn build
```

### Issue: Want to force real backend

```bash
# In .env
REACT_APP_BACKEND_URL=https://your-backend-url
```

---

## 📱 Mobile Testing

BETA mode works on all devices:

1. Deploy to Vercel
2. Get QR code from dashboard
3. Scan with phone
4. Test on mobile browsers

Works with:
- iOS Safari
- Android Chrome
- Mobile Phantom wallet (UI only)
- Mobile Solflare (UI only)

---

## 💡 Pro Tips

### 1. Password Protection

Vercel offers free password protection:

```bash
vercel --prod
# In dashboard: Settings > Password Protection
```

### 2. Custom Domain

Point your domain:
```bash
# In Vercel dashboard
Domains > Add Domain > your-domain.com
```

### 3. Environment Previews

Every PR gets preview URL:
```bash
# Vercel automatically creates
https://sorel-beta-pr-123.vercel.app
```

### 4. A/B Testing

Run two BETA versions:
```bash
# Version A: Current design
# Version B: New features
# Use Vercel's deployment branches
```

---

## ✅ Pre-Launch Checklist

Before sharing BETA:

- [ ] Demo mode banner visible
- [ ] All tabs work (Analyze, Dashboard, Leaderboard)
- [ ] Charts render
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Toast notifications work
- [ ] Loading states show
- [ ] Can analyze wallets
- [ ] Leaderboard populated
- [ ] Public URL works
- [ ] HTTPS enabled
- [ ] Meta tags set

---

## 📈 Success Metrics

Track in BETA:

- Page views
- Wallet analyses (demo)
- Time on site
- Tab interactions
- Mobile vs desktop
- Bounce rate
- User feedback

---

## 🎯 Use Cases

### Investor Pitch
```
"Here's our live product [share BETA URL]
This shows the complete UI/UX
Real blockchain integration coming next"
```

### User Research
```
"Test this and give feedback
It's a demo version
Shows all features"
```

### Team Review
```
"Check out the design
All interactive
Demo data only"
```

---

## 📞 Support

Having issues? Check:

1. [BETA_DEPLOYMENT.md](./BETA_DEPLOYMENT.md) - Full guide
2. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
3. `/app/frontend/src/services/mockData.js` - Mock data source
4. Browser console - Look for errors

---

## 🎉 You're Ready!

Your BETA version:
- ✅ No backend needed
- ✅ $0 cost
- ✅ 2-minute deploy
- ✅ Full UI/UX
- ✅ Perfect for demos

**Deploy Now:**
```bash
cd /app && ./scripts/deploy-beta.sh
```

**Upgrade Later:**
Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) when ready for production!

---

## 📚 Additional Resources

- **Mock Data**: `/app/frontend/src/services/mockData.js`
- **API Service**: `/app/frontend/src/services/apiService.js`
- **Demo Banner**: `/app/frontend/src/components/DemoBanner.js`
- **Deployment Scripts**: `/app/scripts/`

**Questions?** The BETA version uses the exact same codebase as production - just with simulated data!
