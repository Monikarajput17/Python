#!/bin/bash

# Hotel Management Application Setup Script

set -e

echo "🏨 Hotel Management SaaS - Setup Script"
echo "======================================="

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

echo ""
echo "Installing dependencies..."

# Backend
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Frontend
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Admin Panel
echo "📦 Installing admin panel dependencies..."
cd admin-panel
npm install
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your configuration"
echo "2. Start the application:"
echo "   - Development: npm run dev"
echo "   - Docker: docker-compose up"
echo ""
