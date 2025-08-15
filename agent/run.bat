@echo off
REM GovPulse Docker Run Script for Windows

echo 🚀 Starting GovPulse Agent System...

REM Check if .env file exists
if not exist .env (
    echo ❌ .env file not found. Please run build.bat first
    exit /b 1
)

REM Start the system using Docker Compose
echo 🔄 Starting all agents with Docker Compose...
docker-compose up -d

REM Wait a moment for services to start
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check service status
echo 📊 Service Status:
docker-compose ps

echo.
echo 🌐 Service URLs:
echo    Host Agent:   http://localhost:11000
echo    CEB Agent:    http://localhost:10010
echo    Health Agent: http://localhost:10011

echo.
echo 📝 To check logs, use:
echo    docker-compose logs -f [service-name]
echo    Example: docker-compose logs -f host-agent

echo.
echo 🛑 To stop the system, run: stop.bat
