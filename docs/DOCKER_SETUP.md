# GovPulse - Complete Docker Setup

This is the root-level Docker Compose configuration that orchestrates all services in the GovPulse application.

## Services Overview

The application consists of the following services:

### Core Services
- **govpulse-db**: PostgreSQL database
- **govpulse-backend**: Node.js backend API (Port: 3000)
- **govpulse-frontend**: React frontend application (Port: 5174)

### Gov-Time-Sync Services
- **govtimesync-frontend**: Government time synchronization frontend (Port: 3001)

### Agent Services
- **ceb-agent**: Ceylon Electricity Board agent (Port: 10010)
- **health-agent**: Ministry of Health agent (Port: 10011)
- **host-agent**: Main orchestrator agent (Port: 11000)

## Prerequisites

1. **Docker & Docker Compose**: Make sure you have Docker and Docker Compose installed
2. **Environment Variables**: Copy `.env.example` to `.env` and fill in your API keys

## Quick Start

1. **Clone and navigate to the project root:**
   ```bash
   git clone <repository-url>
   cd GovPulse
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env file and add your API keys
   ```

3. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

4. **Or run in detached mode:**
   ```bash
   docker-compose up -d --build
   ```

## Accessing Services

Once all services are running, you can access:

- **GovPulse Frontend**: http://localhost:5174
- **GovPulse Backend API**: http://localhost:3000
- **Gov-Time-Sync Frontend**: http://localhost:3001
- **CEB Agent**: http://localhost:10010
- **Health Agent**: http://localhost:10011
- **Host Agent**: http://localhost:11000
- **PostgreSQL Database**: localhost:5432

## Management Commands

### Start all services
```bash
docker-compose up -d
```

### Stop all services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f govpulse-backend
```

### Rebuild specific service
```bash
docker-compose up --build govpulse-backend
```

### Check service status
```bash
docker-compose ps
```

## Environment Variables

Required environment variables (add to `.env` file):

- `OPEN_API_KEY`: Your OpenAI API key
- `GOOGLE_API_KEY`: Your Google API key
- `PERPLEXITY_API_KEY`: (Optional) Perplexity API key
- `LANGSMITH_API_KEY`: (Optional) LangSmith API key
- `LANGCHAIN_TRACING_V2`: (Optional) Enable LangChain tracing
- `LANGSMITH_PROJECT`: (Optional) LangSmith project name

## Network Architecture

All services run on the `govpulse-network` Docker network, enabling internal communication between services.

## Data Persistence

- **pgdata**: PostgreSQL data volume
- **agent-data**: Agent services data volume

## Troubleshooting

1. **Port conflicts**: If you encounter port conflicts, modify the port mappings in `docker-compose.yml`

2. **Build issues**: Try rebuilding with no cache:
   ```bash
   docker-compose build --no-cache
   ```

3. **Database connection issues**: Ensure the database service is healthy before other services start

4. **API key issues**: Verify all required environment variables are set in `.env`

## Development

For development purposes, you can run individual services:

```bash
# Run only database and backend
docker-compose up govpulse-db govpulse-backend

# Run specific agent
docker-compose up ceb-agent
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment variables
2. Use appropriate secrets management for API keys
3. Configure proper reverse proxy (nginx/traefik)
4. Set up SSL certificates
5. Configure backup strategy for database volumes
