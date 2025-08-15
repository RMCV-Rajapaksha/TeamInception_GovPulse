#!/bin/bash

# GovPulse Docker Build Script

echo "🏛️ Building GovPulse Agent System..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.docker .env
    echo "📝 Please edit .env file with your API keys before running the system"
    exit 1
fi

# Build all Docker images
echo "🔨 Building Docker images..."

echo "📦 Building Host Agent..."
docker build -f Dockerfile.host -t govpulse-host:latest .

echo "📦 Building CEB Agent..."
docker build -f Dockerfile.ceb -t govpulse-ceb:latest .

echo "📦 Building Health Agent..."
docker build -f Dockerfile.health -t govpulse-health:latest .

echo "✅ All images built successfully!"

# List built images
echo "📋 Built images:"
docker images | grep govpulse

echo ""
echo "🚀 To start the system, run: ./run.sh"
echo "🛑 To stop the system, run: ./stop.sh"
