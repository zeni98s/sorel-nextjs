# 🎭 SoReL BETA Version - Frontend Only Deployment

Deploy SoReL without backend infrastructure using simulated data. Perfect for:
- **Demos & Presentations**
- **Stakeholder Testing**
- **UI/UX Validation**
- **Pre-launch Beta Testing**

---

## ✨ Features in BETA Mode

### ✅ Fully Functional UI
- Complete wallet analysis interface
- Interactive dashboard with charts
- Leaderboard rankings
- Web3 wallet connection UI
- All animations and transitions

### 🎭 Simulated Data
- Realistic wallet reputation scores
- Mock blockchain metrics
- Trend analytics
- Performance statistics
- No real blockchain queries

### ⚡ Benefits
- **Zero Cost** - No backend or database needed
- **Instant Deploy** - 2-minute setup
- **Fast Performance** - All data in memory
- **Safe Testing** - No real transactions
- **Easy Sharing** - Send link to anyone

---

## 🚀 Quick Deploy to Vercel (2 Minutes)

### Step 1: Configure for BETA Mode

```bash
cd /app/frontend

# Create production .env for BETA
cat > .env.production << EOF
# BETA Mode - No backend required
REACT_APP_BACKEND_URL=

# Solana Network (for wallet connection UI only)
REACT_APP_SOLANA_NETWORK=mainnet-beta

# App Info
REACT_APP_NAME="SoReL BETA"
REACT_APP_VERSION="1.0.0-beta"

# Disable features
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
EOF
```

### Step 2: Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod

# Your BETA app is live! 🎉
# URL: https://sorel-beta.vercel.app
```

That's it! Your BETA version is live with simulated data.

---

## 📦 Alternative Deployment Options

### Option A: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /app/frontend
netlify deploy --prod
```

### Option B: GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/sorel",
"scripts": {
  "predeploy": "yarn build",
  "deploy": "gh-pages -d build"
}

# Install gh-pages
yarn add --dev gh-pages

# Deploy
yarn deploy
```

### Option C: Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repo
3. Set build settings:
   - **Build command**: `yarn build`
   - **Build output**: `build`
4. Deploy

---

## 🎮 Using the BETA Version

### Enable Demo Mode

The app automatically uses demo mode when:
- No `REACT_APP_BACKEND_URL` is configured
- Backend is unreachable
- User manually enables demo mode

### Manual Toggle

Add this to your browser console:
```javascript
// Enable demo mode
localStorage.setItem('sorel_demo_mode', 'true');
window.location.reload();

// Disable demo mode
localStorage.setItem('sorel_demo_mode', 'false');
window.location.reload();
```

### Demo Mode Features

1. **Banner Notification**
   - Shows "BETA Version - Demo Mode Active"
   - Can be dismissed
   - Floating indicator badge

2. **Simulated Analysis**
   - Enter any Solana address
   - Get instant mock results
   - Realistic reputation scores
   - No blockchain queries

3. **Mock Data**
   - Pre-populated leaderboard
   - Sample analytics
   - Trend charts
   - Performance metrics

---

## 🛠️ Local Development (BETA Mode)

### Run Frontend Only

```bash
cd /app/frontend

# Install dependencies
yarn install

# Set demo mode
echo "REACT_APP_BACKEND_URL=" > .env

# Start development server
yarn start

# Opens at http://localhost:3000
```

### Test Different Scenarios

```javascript
// In browser console:

// Test wallet analysis
const testWallet = "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
// Enter in the UI and click Analyze

// View demo stats
console.log('Demo mode:', localStorage.getItem('sorel_demo_mode'));

// Clear demo data
localStorage.clear();
```

---

## 📊 What Works in BETA

### ✅ Fully Functional
- Wallet address input
- Analysis results display
- Dashboard stats cards
- Trend charts (Recharts)
- Leaderboard with rankings
- Tab navigation
- Responsive design
- Toast notifications
- Loading states

### ⚠️ Limited Functionality
- Web3 wallet connection (UI only, no real wallet integration)
- No real blockchain data
- No data persistence
- No API calls

### ❌ Not Available
- Real-time blockchain queries
- Actual wallet signatures
- Database storage
- Historical tracking
- Cross-device sync

---

## 🎨 Customizing BETA Version

### Add Custom Mock Wallets

Edit `/app/frontend/src/services/mockData.js`:

```javascript
const mockWallets = [
  {
    wallet_address: "YOUR_CUSTOM_ADDRESS",
    reputation_score: 950,
    metrics: {
      transaction_count: 2000,
      total_volume: 100000,
      // ... more metrics
    }
  },
  // Add more...
];
```

### Adjust Simulation Delay

```javascript
// In mockData.js
const delay = (ms = 800) => // Change delay time
```

### Custom Demo Messages

Edit `/app/frontend/src/components/DemoBanner.js`:

```javascript
<span className="font-semibold">
  YOUR CUSTOM MESSAGE
</span>
```

---

## 🔄 Upgrading from BETA to Production

When ready to go live with real backend:

### Step 1: Deploy Backend

Follow main [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

```bash
# Deploy backend to Railway
cd /app/backend
railway up
```

### Step 2: Update Frontend .env

```bash
cd /app/frontend

# Update .env.production
REACT_APP_BACKEND_URL=https://sorel-backend.up.railway.app
```

### Step 3: Redeploy Frontend

```bash
vercel --prod
```

### Step 4: Disable Demo Mode

The app will automatically detect the backend and switch to production mode.

---

## 📱 Mobile Testing

BETA mode works perfectly on mobile:

```bash
# Get Vercel URL
vercel

# Share URL via:
- QR Code (Vercel dashboard)
- Direct link
- Social media
```

Test on:
- iOS Safari
- Android Chrome
- Mobile wallets (Phantom, Solflare) - UI only

---

## 🎯 Use Cases for BETA

### 1. Investor Demos
- Show complete UI/UX
- Demonstrate features
- No technical setup required
- No costs

### 2. User Testing
- Get feedback on design
- Test user flows
- Validate concept
- A/B testing

### 3. Stakeholder Presentations
- Live demo without infrastructure
- No dependency on backend
- Always available
- Fast performance

### 4. Development Preview
- Test frontend changes
- Preview new features
- Quick iterations
- No backend restart needed

---

## 🐛 Troubleshooting BETA Mode

### Issue: Real backend showing instead of demo

**Solution:**
```bash
# Force demo mode
localStorage.setItem('sorel_demo_mode', 'true');
window.location.reload();
```

### Issue: Wallet connection not working

**Solution:**
This is expected in BETA mode. The wallet connection UI shows but doesn't actually connect. Add note in banner if needed.

### Issue: Charts not rendering

**Solution:**
```bash
# Rebuild and deploy
cd /app/frontend
rm -rf node_modules build
yarn install
yarn build
vercel --prod
```

### Issue: Demo banner dismissed but want it back

**Solution:**
```bash
# Clear banner dismissal
localStorage.removeItem('sorel_banner_dismissed');
window.location.reload();
```

---

## 📈 Analytics for BETA

Add analytics to track BETA usage:

### Google Analytics

```bash
# Add to .env
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
```

```javascript
// In App.js
import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);

// Track demo mode usage
ReactGA.event({
  category: 'Demo Mode',
  action: 'Page View',
  label: 'Beta Version'
});
```

---

## 🎉 BETA Checklist

Before sharing BETA:

- [ ] Demo banner is visible
- [ ] All tabs (Analyze, Dashboard, Leaderboard) work
- [ ] Charts render correctly
- [ ] Mobile responsive
- [ ] Toast notifications show
- [ ] Loading states work
- [ ] Can analyze any wallet address
- [ ] Leaderboard populated
- [ ] Dashboard stats show
- [ ] No console errors
- [ ] Deployed to public URL
- [ ] SSL certificate valid
- [ ] Meta tags configured

---

## 🔗 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **React Deploy**: https://create-react-app.dev/docs/deployment
- **Demo Mode Code**: `/app/frontend/src/services/mockData.js`

---

## 💡 Pro Tips

1. **Custom Domain**: Point your domain to Vercel for professional URL
2. **Password Protect**: Use Vercel's password protection for private beta
3. **Analytics**: Track user behavior in BETA before production
4. **Feedback**: Add feedback form for beta testers
5. **Version Badge**: Keep "BETA" visible to manage expectations

---

## ✅ Success!

Your BETA version is now live! Share the URL with:
- Investors
- Potential users
- Team members
- Advisors

Remember: This is a demo version. When ready for production, follow the full deployment guide.

**BETA URL**: https://sorel-beta.vercel.app
**Status**: ✅ Live with simulated data
**Cost**: $0/month
**Maintenance**: None required
