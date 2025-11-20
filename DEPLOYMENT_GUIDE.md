# 🚀 SoReL Deployment Guide

Complete guide for deploying SoReL - Solana Reputation Layer to production.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Platform Setup](#platform-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Deployment Steps](#deployment-steps)
6. [Monitoring Setup](#monitoring-setup)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Prerequisites

### Required Accounts
- [ ] **Helius Account** - Get API key at [helius.dev](https://helius.dev)
- [ ] **Railway Account** - Sign up at [railway.app](https://railway.app)
- [ ] **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
- [ ] **MongoDB Atlas** (Optional) - For managed database

### Required Tools
```bash
# Install Node.js & Yarn
node --version  # v18+ required
yarn --version

# Install Python
python3 --version  # 3.11+ required

# Install CLIs
npm install -g vercel @railway/cli
```

---

## 🏗️ Platform Setup

### Option A: Railway (Backend) + Vercel (Frontend) ⭐ RECOMMENDED

#### **Step 1: Deploy Backend to Railway**

```bash
# 1. Login to Railway
railway login

# 2. Create new project
cd /app/backend
railway init
# Name: sorel-backend

# 3. Add MongoDB service
railway add mongodb
# Note the MONGO_URL provided

# 4. Set environment variables
railway variables set HELIUS_RPC_URL="https://mainnet.helius-rpc.com/?api-key=YOUR_KEY"
railway variables set DB_NAME="sorel_production"
railway variables set CORS_ORIGINS="https://sorel-solana.vercel.app"
railway variables set PORT="8001"

# 5. Deploy
railway up

# 6. Get your backend URL
railway domain
# Example: https://sorel-backend.up.railway.app
```

#### **Step 2: Deploy Frontend to Vercel**

```bash
# 1. Login to Vercel
vercel login

# 2. Deploy from frontend directory
cd /app/frontend
vercel

# Follow prompts:
# - Project name: sorel-solana
# - Framework: Create React App
# - Build command: yarn build
# - Output directory: build

# 3. Set environment variables in Vercel dashboard
# Go to: Project Settings > Environment Variables
# Add:
REACT_APP_BACKEND_URL=https://sorel-backend.up.railway.app
REACT_APP_SOLANA_NETWORK=mainnet-beta

# 4. Redeploy with env vars
vercel --prod
```

#### **Step 3: Update CORS**

```bash
# Update Railway backend CORS to include Vercel URL
railway variables set CORS_ORIGINS="https://sorel-solana.vercel.app,https://www.sorel-solana.vercel.app"
```

---

### Option B: Render (All-in-One)

1. Go to [render.com](https://render.com)
2. **Create Web Service** (Backend)
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Add environment variables (see below)

3. **Create Static Site** (Frontend)
   - Root Directory: `frontend`
   - Build Command: `yarn install && yarn build`
   - Publish Directory: `build`
   - Add environment variables

4. **Add MongoDB**
   - Use MongoDB Atlas (external)
   - Or use Render's MongoDB add-on

---

## ⚙️ Environment Configuration

### Backend Environment Variables

Create `/app/backend/.env`:

```bash
# MongoDB
MONGO_URL="mongodb://localhost:27017"  # Local
# MONGO_URL="<RAILWAY_MONGO_URL>"      # Railway
# MONGO_URL="<ATLAS_CONNECTION_STRING>" # MongoDB Atlas

DB_NAME="sorel_production"

# Solana RPC
HELIUS_RPC_URL="https://mainnet.helius-rpc.com/?api-key=YOUR_PRODUCTION_KEY"

# CORS - Update with your frontend URL
CORS_ORIGINS="https://sorel-solana.vercel.app"

# Server
PORT=8001
ENVIRONMENT="production"
LOG_LEVEL="INFO"
```

### Frontend Environment Variables

Create `/app/frontend/.env`:

```bash
# Backend API - Update with your Railway backend URL
REACT_APP_BACKEND_URL=https://sorel-backend.up.railway.app

# Solana Network
REACT_APP_SOLANA_NETWORK=mainnet-beta

# App Config
REACT_APP_NAME="SoReL"
REACT_APP_VERSION="1.0.0"

# Production settings
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
```

---

## 🗄️ Database Setup

### Create Indexes (IMPORTANT for Performance)

After deploying backend, run:

```bash
# SSH into Railway container or run locally with production MONGO_URL
cd /app/backend
python db_setup.py

# You should see:
# ✅ Created unique index on wallet_address
# ✅ Created index on reputation_score (descending)
# ✅ Created index on last_analyzed
# ... and more
```

### Database Collections

The app uses two collections:
- `wallets` - Stores wallet reputation data
- `reputation_history` - Tracks reputation over time
- `rpc_metrics` - Monitoring data (optional)

---

## 🚢 Deployment Steps

### Step-by-Step Deployment

1. **Get Helius API Key**
   ```bash
   # Sign up at https://helius.dev
   # Create new project
   # Copy API key
   ```

2. **Deploy Backend**
   ```bash
   cd /app/backend
   
   # Update .env with production values
   cp .env.example .env
   nano .env  # Edit with your values
   
   # Deploy to Railway
   railway up
   
   # Get backend URL
   railway domain
   ```

3. **Create Database Indexes**
   ```bash
   # Connect to production database
   export MONGO_URL="<your_production_mongo_url>"
   python db_setup.py
   ```

4. **Deploy Frontend**
   ```bash
   cd /app/frontend
   
   # Update .env with backend URL
   cp .env.example .env
   nano .env  # Add your Railway backend URL
   
   # Deploy to Vercel
   vercel --prod
   ```

5. **Test Deployment**
   ```bash
   # Test backend health
   curl https://sorel-backend.up.railway.app/api/
   
   # Should return:
   # {"message":"SoReL - Solana Reputation Layer API"}
   
   # Test frontend
   # Visit: https://sorel-solana.vercel.app
   ```

---

## 📊 Monitoring Setup

### Set Up RPC Monitoring

```bash
# Add to Railway (or run as cron job)
cd /app/backend
python monitoring.py monitor 300  # Check every 5 minutes

# Or add as Railway service
railway run python monitoring.py monitor 300
```

### Monitoring Dashboard

View metrics:
```bash
# Check RPC health
python monitoring.py

# View uptime stats
python monitoring.py stats
```

### Set Up Alerts (Optional)

**Option 1: Railway Webhooks**
```bash
# In Railway dashboard:
# Settings > Webhooks > Add webhook
# URL: https://your-discord-webhook or Slack
```

**Option 2: UptimeRobot**
- Sign up at [uptimerobot.com](https://uptimerobot.com)
- Add monitors for:
  - Backend health: `https://sorel-backend.up.railway.app/api/`
  - Frontend: `https://sorel-solana.vercel.app`

**Option 3: Sentry Error Tracking**
```bash
# Add to backend
pip install sentry-sdk

# In server.py:
import sentry_sdk
sentry_sdk.init(dsn="YOUR_SENTRY_DSN")
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend API responding at `/api/`
- [ ] Frontend loads and displays correctly
- [ ] Wallet connection works (Phantom, Solflare)
- [ ] Can analyze wallet addresses
- [ ] Dashboard shows analytics
- [ ] Leaderboard displays wallets
- [ ] Database indexes created
- [ ] RPC monitoring running
- [ ] CORS configured correctly
- [ ] Error tracking set up (Sentry)
- [ ] Uptime monitoring active (UptimeRobot)
- [ ] SSL certificates valid
- [ ] Environment variables secure
- [ ] API keys rotated from dev/test

---

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
```
Error: Access to fetch at 'https://backend.com' from origin 'https://frontend.com' 
has been blocked by CORS policy
```

**Solution:**
```bash
# Update Railway backend CORS_ORIGINS
railway variables set CORS_ORIGINS="https://your-frontend.vercel.app"
railway restart
```

#### 2. RPC Connection Timeout
```
Error: Request timeout to Helius RPC
```

**Solution:**
- Check Helius API key is valid
- Verify RPC URL format
- Check if you've exceeded rate limits
- Consider upgrading Helius plan

#### 3. MongoDB Connection Failed
```
Error: MongoServerError: Authentication failed
```

**Solution:**
```bash
# Verify MONGO_URL is correct
railway variables get MONGO_URL

# Test connection
mongosh "YOUR_MONGO_URL"
```

#### 4. Frontend Can't Connect to Backend
```
Error: Network request failed
```

**Solution:**
- Verify REACT_APP_BACKEND_URL is correct
- Check backend is deployed and running
- Test backend directly: `curl https://backend-url/api/`
- Redeploy frontend with correct env vars

#### 5. Wallet Connection Not Working
```
Wallet adapter error
```

**Solution:**
- Ensure you're on mainnet
- Check REACT_APP_SOLANA_NETWORK=mainnet-beta
- Try different wallet (Phantom vs Solflare)
- Clear browser cache

---

## 📈 Performance Optimization

### Database Optimization
```bash
# Check index usage
python db_setup.py analyze

# Rebuild indexes if needed
mongosh "MONGO_URL"
use sorel_production
db.wallets.reIndex()
```

### RPC Optimization
- Use Helius Pro plan for better performance
- Implement caching for frequent queries
- Use batch requests where possible

### Frontend Optimization
```bash
# Enable production build optimizations
cd /app/frontend
GENERATE_SOURCEMAP=false yarn build

# Analyze bundle size
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

---

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/staging/prod
   - Rotate API keys regularly

2. **Database Security**
   - Use MongoDB Atlas with IP whitelist
   - Enable authentication
   - Regular backups

3. **API Security**
   - Implement rate limiting
   - Add API key authentication for sensitive endpoints
   - Monitor for suspicious activity

4. **Frontend Security**
   - Use HTTPS only
   - Implement CSP headers
   - Validate user inputs

---

## 📞 Support & Resources

- **Helius Docs**: https://docs.helius.dev
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Solana Docs**: https://docs.solana.com

---

## 🎉 Success!

Your SoReL application should now be live and running!

**Frontend**: https://sorel-solana.vercel.app
**Backend**: https://sorel-backend.up.railway.app/api/

Remember to:
- Monitor RPC health regularly
- Check database performance
- Review error logs
- Update dependencies
- Backup database regularly
