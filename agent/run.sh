#!/bin/bash

# GovPulse Docker Run Script

echo "🚀 Starting GovPulse Agent System..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./build.sh first"
    exit 1
fi

# Start the system using Docker Compose
echo "🔄 Starting all agents with Docker Compose..."
docker-compose up -d

# Wait a moment for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Service URLs:"
echo "   Host Agent:   http://localhost:11000"
echo "   CEB Agent:    http://localhost:10010"
echo "   Health Agent: http://localhost:10011"

echo ""
echo "📝 To check logs, use:"
echo "   docker-compose logs -f [service-name]"
echo "   Example: docker-compose logs -f host-agent"

echo ""
echo "🛑 To stop the system, run: ./stop.sh"
