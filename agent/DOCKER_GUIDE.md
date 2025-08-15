# 🐳 GovPulse Docker Deployment Guide

This guide provides comprehensive instructions for dockerizing and deploying the GovPulse Agent System using Docker and Docker Compose.

## 📋 Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **API Keys**: OpenAI, Google API

### Installing Docker

**Windows:**
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

**macOS:**
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Drag Docker to Applications folder
3. Launch Docker Desktop

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd GovPulse/agent
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.docker .env

# Edit .env file with your API keys
# Windows: notepad .env
# Linux/Mac: nano .env
```

**Required Environment Variables:**
```env
OPEN_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here  # Optional
```

### 3. Build and Run

**Windows:**
```cmd
# Build all images
build.bat

# Start the system
run.bat

# Stop the system
stop.bat
```

**Linux/Mac:**
```bash
# Make scripts executable
chmod +x *.sh

# Build all images
./build.sh

# Start the system
./run.sh

# Stop the system
./stop.sh
```

## 🏗️ Architecture Overview

The dockerized system consists of three main services:

### 🎯 Host Agent (Port 11000)
- **Container**: `govpulse-host`
- **Role**: Central orchestrator and API gateway
- **Technology**: Google Gemini 2.0 Flash + ADK

### ⚡ CEB Agent (Port 10010)
- **Container**: `govpulse-ceb`
- **Role**: Ceylon Electricity Board services
- **Technology**: LangGraph + OpenAI GPT-4

### 🏥 Health Agent (Port 10011)
- **Container**: `govpulse-health`
- **Role**: Ministry of Health services
- **Technology**: LangGraph + OpenAI GPT-4

## 🔧 Manual Docker Commands

### Building Images Individually
```bash
# Host Agent
docker build -f Dockerfile.host -t govpulse-host:latest .

# CEB Agent
docker build -f Dockerfile.ceb -t govpulse-ceb:latest .

# Health Agent
docker build -f Dockerfile.health -t govpulse-health:latest .
```

### Running with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps

# Stop all services
docker-compose down
```

### Running Individual Containers
```bash
# Host Agent
docker run -d --name govpulse-host \
  -p 11000:11000 \
  --env-file .env \
  govpulse-host:latest

# CEB Agent
docker run -d --name govpulse-ceb \
  -p 10010:10010 \
  --env-file .env \
  govpulse-ceb:latest

# Health Agent
docker run -d --name govpulse-health \
  -p 10011:10011 \
  --env-file .env \
  govpulse-health:latest
```

## 📊 Monitoring and Debugging

### Checking Service Health
```bash
# Check all services
docker-compose ps

# Check specific service logs
docker-compose logs -f host-agent
docker-compose logs -f ceb-agent
docker-compose logs -f health-agent

# Check health endpoints
curl http://localhost:11000/health
curl http://localhost:10010/health
curl http://localhost:10011/health
```

### Accessing Agent Discovery Endpoints
```bash
# Agent discovery endpoints
curl http://localhost:11000/.well-known/agent.json
curl http://localhost:10010/.well-known/agent.json
curl http://localhost:10011/.well-known/agent.json
```

### Container Debugging
```bash
# Execute shell in running container
docker exec -it govpulse-host /bin/bash
docker exec -it govpulse-ceb /bin/bash
docker exec -it govpulse-health /bin/bash

# View container resources
docker stats govpulse-host govpulse-ceb govpulse-health
```

## 🔒 Security Considerations

### Environment Variables
- Store sensitive API keys in `.env` file
- Never commit `.env` file to version control
- Use Docker secrets in production

### Network Security
```bash
# Create isolated network
docker network create --driver bridge govpulse-secure

# Run containers in isolated network
docker-compose --file docker-compose.secure.yml up -d
```

### Production Security
- Use non-root users in containers ✅ (already implemented)
- Scan images for vulnerabilities
- Use minimal base images
- Implement proper logging and monitoring

## 🚀 Production Deployment

### Docker Swarm
```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml govpulse

# Scale services
docker service scale govpulse_host-agent=2
```

### Kubernetes Deployment
```yaml
# kubernetes/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: govpulse-host
spec:
  replicas: 2
  selector:
    matchLabels:
      app: govpulse-host
  template:
    metadata:
      labels:
        app: govpulse-host
    spec:
      containers:
      - name: host-agent
        image: govpulse-host:latest
        ports:
        - containerPort: 11000
        env:
        - name: OPEN_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-keys
              key: openai-key
```

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find process using port
netstat -ano | findstr :11000  # Windows
lsof -i :11000                 # Linux/Mac

# Kill process
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                  # Linux/Mac
```

**Container Fails to Start:**
```bash
# Check logs
docker logs govpulse-host

# Check environment variables
docker exec govpulse-host env | grep API_KEY
```

**Agent Communication Issues:**
```bash
# Test agent discovery
curl http://localhost:11000/.well-known/agent.json

# Check network connectivity
docker exec govpulse-host ping govpulse-ceb
```

### Performance Optimization

**Resource Limits:**
```yaml
# In docker-compose.yml
services:
  host-agent:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

**Health Check Tuning:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:11000/health"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 30s
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale using Docker Compose
docker-compose up -d --scale ceb-agent=3 --scale health-agent=2

# Load balancer configuration needed for multiple instances
```

### Vertical Scaling
```yaml
# Increase container resources
services:
  host-agent:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
```

## 🔄 Updates and Maintenance

### Rolling Updates
```bash
# Build new version
docker build -f Dockerfile.host -t govpulse-host:v2 .

# Update service
docker-compose up -d host-agent

# Rollback if needed
docker-compose up -d --scale host-agent=0
docker tag govpulse-host:v1 govpulse-host:latest
docker-compose up -d host-agent
```

### Backup and Restore
```bash
# Backup configurations
tar -czf govpulse-backup.tar.gz .env docker-compose.yml

# Export images
docker save govpulse-host:latest | gzip > govpulse-host.tar.gz

# Restore images
docker load < govpulse-host.tar.gz
```

## 📞 Support

For issues and questions:
1. Check container logs: `docker-compose logs -f`
2. Verify environment configuration
3. Test API endpoints individually
4. Check network connectivity between containers

---

**GovPulse Docker Deployment** - *Containerized Government Service Platform* 🏛️🐳
