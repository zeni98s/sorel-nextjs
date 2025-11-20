#!/bin/bash
# Quick BETA Deployment Script for SoReL

set -e

echo "🎭 SoReL BETA Deployment"
echo "========================"
echo ""
echo "This will deploy a frontend-only version with demo data"
echo "No backend or blockchain infrastructure required!"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    print_warning "Please run this script from /app directory"
    exit 1
fi

cd frontend

# Check prerequisites
print_info "Checking prerequisites..."

if ! command -v yarn &> /dev/null; then
    print_warning "Yarn not found. Install with: npm install -g yarn"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_success "Prerequisites OK"

# Configure for BETA mode
print_info "Configuring BETA mode..."

cat > .env.production << 'EOF'
# SoReL BETA Configuration
# Frontend-only with simulated data

# No backend required (empty value triggers demo mode)
REACT_APP_BACKEND_URL=

# Solana Network
REACT_APP_SOLANA_NETWORK=mainnet-beta

# App Info
REACT_APP_NAME="SoReL BETA"
REACT_APP_VERSION="1.0.0-beta"

# WebSocket
WDS_SOCKET_PORT=443

# Features
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
EOF

print_success "BETA configuration created"

# Install dependencies
print_info "Installing dependencies..."
yarn install --silent

print_success "Dependencies installed"

# Build the app
print_info "Building app for production..."
yarn build

print_success "Build complete"

# Deploy
echo ""
print_info "Ready to deploy! Choose deployment platform:"
echo ""
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Build only (deploy manually)"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        print_info "Deploying to Vercel..."
        
        # Check if logged in
        if ! vercel whoami &> /dev/null; then
            print_info "Please login to Vercel:"
            vercel login
        fi
        
        # Deploy
        print_info "Deploying to production..."
        vercel --prod
        
        print_success "BETA deployed to Vercel!"
        echo ""
        print_info "Your app is now live!"
        ;;
        
    2)
        print_info "Deploying to Netlify..."
        
        if ! command -v netlify &> /dev/null; then
            print_info "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        # Check if logged in
        if ! netlify status &> /dev/null; then
            print_info "Please login to Netlify:"
            netlify login
        fi
        
        # Deploy
        netlify deploy --prod --dir=build
        
        print_success "BETA deployed to Netlify!"
        ;;
        
    3)
        print_success "Build complete! Files ready in /build directory"
        print_info "You can deploy manually to:"
        echo "  - GitHub Pages"
        echo "  - Cloudflare Pages"
        echo "  - AWS S3"
        echo "  - Any static hosting"
        ;;
        
    *)
        print_warning "Invalid choice"
        exit 1
        ;;
esac

# Show summary
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║                                            ║"
echo "║         🎉 BETA DEPLOYMENT COMPLETE!       ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
print_success "Your SoReL BETA is now live!"
echo ""
print_info "What's included:"
echo "  ✓ Full UI/UX with animations"
echo "  ✓ Simulated wallet analysis"
echo "  ✓ Interactive dashboard"
echo "  ✓ Mock leaderboard"
echo "  ✓ Demo mode banner"
echo ""
print_info "What's NOT included:"
echo "  ✗ Real blockchain data"
echo "  ✗ Actual wallet connections"
echo "  ✗ Data persistence"
echo ""
print_warning "This is a DEMO version with simulated data"
print_info "Ready for production? Follow /app/DEPLOYMENT_GUIDE.md"
echo ""
