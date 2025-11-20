#!/bin/bash
# SoReL Deployment Automation Script

set -e  # Exit on error

echo "🚀 SoReL Deployment Script"
echo "============================\n"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_info() { echo "ℹ️  $1"; }

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Install with: npm install -g @railway/cli"
fi

if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Install with: npm install -g vercel"
fi

if ! command -v python3 &> /dev/null; then
    print_error "Python3 not found. Please install Python 3.11+"
    exit 1
fi

if ! command -v yarn &> /dev/null; then
    print_error "Yarn not found. Please install Yarn"
    exit 1
fi

print_success "Prerequisites check complete\n"

# Deployment options
echo "Select deployment target:"
echo "1) Backend only (Railway)"
echo "2) Frontend only (Vercel)"
echo "3) Both (Full deployment)"
echo "4) Database setup only"
echo "5) Setup monitoring"
read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo "\n🔧 Deploying Backend to Railway..."
        cd backend
        
        # Check .env file
        if [ ! -f .env ]; then
            print_error "Backend .env file not found!"
            print_info "Copy .env.example to .env and configure:"
            print_info "  cp .env.example .env"
            exit 1
        fi
        
        print_info "Deploying to Railway..."
        railway up
        
        print_success "Backend deployed!"
        railway domain
        ;;
        
    2)
        echo "\n🎨 Deploying Frontend to Vercel..."
        cd frontend
        
        # Check .env file
        if [ ! -f .env ]; then
            print_error "Frontend .env file not found!"
            print_info "Copy .env.example to .env and configure:"
            print_info "  cp .env.example .env"
            exit 1
        fi
        
        print_info "Building frontend..."
        yarn install
        
        print_info "Deploying to Vercel..."
        vercel --prod
        
        print_success "Frontend deployed!"
        ;;
        
    3)
        echo "\n🚀 Full Deployment..."
        
        # Backend
        print_info "Step 1: Deploying Backend"
        cd backend
        if [ ! -f .env ]; then
            print_error "Backend .env not found. Please configure first."
            exit 1
        fi
        railway up
        BACKEND_URL=$(railway domain | grep -o 'https://[^"]*')
        print_success "Backend deployed: $BACKEND_URL"
        cd ..
        
        # Frontend
        print_info "Step 2: Deploying Frontend"
        cd frontend
        if [ ! -f .env ]; then
            print_error "Frontend .env not found. Please configure first."
            exit 1
        fi
        yarn install
        vercel --prod
        print_success "Frontend deployed!"
        cd ..
        
        print_success "\n✨ Full deployment complete!"
        print_info "Backend: $BACKEND_URL/api/"
        ;;
        
    4)
        echo "\n🗄️  Setting up Database..."
        cd backend
        
        if [ ! -f .env ]; then
            print_error "Backend .env not found!"
            exit 1
        fi
        
        print_info "Creating database indexes..."
        python3 db_setup.py
        
        print_success "Database setup complete!"
        ;;
        
    5)
        echo "\n📊 Setting up Monitoring..."
        cd backend
        
        if [ ! -f .env ]; then
            print_error "Backend .env not found!"
            exit 1
        fi
        
        print_info "Running initial health check..."
        python3 monitoring.py
        
        echo "\n"
        read -p "Start continuous monitoring? (y/n): " start_monitor
        
        if [ "$start_monitor" = "y" ]; then
            print_info "Starting monitoring (press Ctrl+C to stop)..."
            python3 monitoring.py monitor 300
        fi
        ;;
        
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo "\n"
print_success "🎉 Deployment tasks completed!"
