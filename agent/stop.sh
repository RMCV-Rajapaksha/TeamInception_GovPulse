#!/bin/bash

# GovPulse Docker Stop Script

echo "🛑 Stopping GovPulse Agent System..."

# Stop all services
docker-compose down

echo "📊 Checking stopped containers..."
docker-compose ps

echo "✅ GovPulse Agent System stopped successfully!"

echo ""
echo "🗑️  To remove all containers and networks, run:"
echo "   docker-compose down --volumes --remove-orphans"

echo ""
echo "🗂️  To remove all images, run:"
echo "   docker rmi govpulse-host:latest govpulse-ceb:latest govpulse-health:latest"
