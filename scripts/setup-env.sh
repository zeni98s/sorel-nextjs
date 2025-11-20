#!/bin/bash
# Environment setup wizard for SoReL

echo "🔧 SoReL Environment Setup Wizard"
echo "================================\n"

# Backend setup
echo "📦 Backend Configuration"
echo "------------------------\n"

cd backend

if [ -f .env ]; then
    echo "⚠️  .env already exists!"
    read -p "Overwrite? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Skipping backend setup..."
        cd ..
        exit 0
    fi
fi

cp .env.example .env

# Get inputs
read -p "MongoDB URL [mongodb://localhost:27017]: " mongo_url
mongo_url=${mongo_url:-mongodb://localhost:27017}

read -p "Database Name [sorel_production]: " db_name
db_name=${db_name:-sorel_production}

read -p "Helius API Key: " helius_key
if [ -z "$helius_key" ]; then
    echo "⚠️  No API key provided. Using development key (rate limited)."
    helius_url="https://mainnet.helius-rpc.com/?api-key=216c0d9b-b0b0-4d4c-983f-72214b363ccb"
else
    helius_url="https://mainnet.helius-rpc.com/?api-key=$helius_key"
fi

read -p "Frontend URL [http://localhost:3000]: " frontend_url
frontend_url=${frontend_url:-http://localhost:3000}

# Write .env
cat > .env << EOF
MONGO_URL="$mongo_url"
DB_NAME="$db_name"
CORS_ORIGINS="$frontend_url"
HELIUS_RPC_URL="$helius_url"
PORT=8001
ENVIRONMENT="development"
LOG_LEVEL="INFO"
EOF

echo "✅ Backend .env created!"
cd ..

# Frontend setup
echo "\n🎨 Frontend Configuration"
echo "-------------------------\n"

cd frontend

if [ -f .env ]; then
    echo "⚠️  .env already exists!"
    read -p "Overwrite? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Skipping frontend setup..."
        cd ..
        exit 0
    fi
fi

cp .env.example .env

read -p "Backend URL [http://localhost:8001]: " backend_url
backend_url=${backend_url:-http://localhost:8001}

# Write .env
cat > .env << EOF
REACT_APP_BACKEND_URL=$backend_url
WDS_SOCKET_PORT=443
REACT_APP_ENABLE_VISUAL_EDITS=false
ENABLE_HEALTH_CHECK=false
REACT_APP_SOLANA_NETWORK=mainnet-beta
REACT_APP_NAME="SoReL"
REACT_APP_VERSION="1.0.0"
EOF

echo "✅ Frontend .env created!"
cd ..

echo "\n🎉 Environment setup complete!"
echo "\nNext steps:"
echo "1. Install dependencies: cd backend && pip install -r requirements.txt"
echo "2. Install frontend deps: cd frontend && yarn install"
echo "3. Setup database: cd backend && python db_setup.py"
echo "4. Start backend: cd backend && uvicorn server:app --reload"
echo "5. Start frontend: cd frontend && yarn start"
