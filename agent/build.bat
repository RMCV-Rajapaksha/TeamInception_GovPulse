@echo off
REM GovPulse Docker Build Script for Windows

echo 🏛️ Building GovPulse Agent System...

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from template...
    copy .env.docker .env
    echo 📝 Please edit .env file with your API keys before running the system
    exit /b 1
)

REM Build all Docker images
echo 🔨 Building Docker images...

echo 📦 Building Host Agent...
docker build -f Dockerfile.host -t govpulse-host:latest .

echo 📦 Building CEB Agent...
docker build -f Dockerfile.ceb -t govpulse-ceb:latest .

echo 📦 Building Health Agent...
docker build -f Dockerfile.health -t govpulse-health:latest .

echo ✅ All images built successfully!

REM List built images
echo 📋 Built images:
docker images | findstr govpulse

echo.
echo 🚀 To start the system, run: run.bat
echo 🛑 To stop the system, run: stop.bat
