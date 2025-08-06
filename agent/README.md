# 🏛️ GovPulse - Government Service Digital Agent Platform

**GovPulse** is an intelligent multi-agent system designed to streamline access to Sri Lankan government services through AI-powered digital assistants. Built using Google's Agent-to-Agent Protocol (A2A), this platform enables seamless communication between specialized government service agents.

![Architecture Diagram](images/agent-arch.png)

## 🎯 Project Overview

GovPulse serves as a centralized platform that connects citizens with various government services through intelligent agents. Each agent specializes in specific government domains (CEB, Health, etc.) and can handle complex queries, provide real-time updates, and assist with service requests.

## 🏗️ System Architecture

```
GovPulse/
├── backend/
│   ├── host/                    # Central Host Agent (GovPulse Core)
│   │   ├── host_agent.py        # Main orchestration logic
│   │   ├── remote_agent_connection.py  # Agent communication
│   │   └── server.py           # FastAPI server (Port 11000)
│   │
│   ├── agents/                  # Specialized Government Service Agents
│   │   ├── ceb/                # Ceylon Electricity Board Agent
│   │   │   ├── agent.py        # CEB-specific logic & tools
│   │   │   ├── server.py       # CEB agent server (Port 10010)
│   │   │   └── task_manager.py # Task handling & streaming
│   │   └── health/             # Health Ministry Agent
│   │       ├── agent.py        # Health service logic
│   │       ├── server.py       # Health agent server (Port 10011)
│   │       └── task_manager.py # Health task management
│   │
│   ├── api/                    # External API integrations
│   │   └── ceb_api.py         # Perplexity API for CEB updates
│   │
│   ├── common/                 # Shared infrastructure
│   │   ├── types.py           # A2A protocol types & models
│   │   ├── client/            # A2A client implementation
│   │   ├── server/            # A2A server framework
│   │   └── utils/             # Authentication & caching
│   │
└── images/
    └── agent-arch.png         # System architecture diagram
```

## � Agent Ecosystem

### � Host Agent (GovPulse Core)
- **Role**: Central orchestrator and user interface
- **Technology**: Google Gemini 2.0 Flash + ADK
- **Features**:
  - Task delegation to specialized agents
  - Agent discovery via A2A protocol
  - Multi-agent coordination
  - Session management

### ⚡ CEB Agent (Ceylon Electricity Board)
- **Role**: Handles electricity-related queries and services
- **Technology**: LangGraph + OpenAI GPT-4 + Perplexity API
- **Capabilities**:
  - Power outage information
  - Maintenance schedules
  - Billing inquiries
  - New project updates
  - Real-time CEB updates via Perplexity API

### 🏥 Health Agent (Ministry of Health)
- **Role**: Provides healthcare service information
- **Technology**: LangGraph + OpenAI GPT-4
- **Capabilities**:
  - Hospital information by city
  - Government health services
  - Emergency contact details
  - Healthcare program information

## 🚀 Key Features

### 🔄 Multi-Agent Communication
- **Google A2A Protocol**: Standards-based agent communication
- **Agent Discovery**: Automatic detection of available services
- **Task Routing**: Intelligent delegation to appropriate agents
- **Streaming Support**: Real-time response streaming

### �️ Enterprise-Grade Infrastructure
- **Push Notifications**: Real-time task updates
- **JWT Authentication**: Secure agent communication
- **Error Handling**: Comprehensive error management
- **Session Management**: Stateful conversations

### 🌐 External Integrations
- **Perplexity AI**: Real-time news and updates
- **OpenAI GPT-4**: Advanced language understanding
- **LangChain/LangGraph**: Agent workflow orchestration

## 🛠️ Technology Stack

- **Backend Framework**: FastAPI + Starlette
- **AI/ML**: Google ADK, OpenAI, LangChain, LangGraph
- **Communication**: JSON-RPC 2.0, Server-Sent Events (SSE)
- **Security**: JWT, JWK authentication
- **External APIs**: Perplexity AI for real-time data

## 📦 Installation & Setup

### Prerequisites
- Python 3.10+
- API Keys (OpenAI, Google, Perplexity)

### 1. Clone Repository
```bash
git clone <repository-url>
cd GovPulse/agent
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the project root:
```env
# AI/ML API Keys
OPEN_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key
PERPLEXITY_API_KEY=your_perplexity_api_key

# Optional: Advanced Features
DEEPSEEK_API_KEY=your_deepseek_key
LANGSMITH_API_KEY=your_langsmith_key
LANGCHAIN_TRACING_V2=false
LANGSMITH_PROJECT=GovPulse
```

## 🚀 Running the Platform

### Start Individual Agents

**1. CEB Agent (Port 10010)**
```bash
cd backend/agents/ceb
python server.py
```

**2. Health Agent (Port 10011)**
```bash
cd backend/agents/health
python server.py
```

**3. Host Agent (Port 11000)**
```bash
cd backend/host
python server.py
```

### Verify Setup
- CEB Agent: http://localhost:10010/.well-known/agent.json
- Health Agent: http://localhost:10011/.well-known/agent.json
- Host Agent: http://localhost:11000

## 💡 Usage Examples

### Query CEB Services
```
"What's the latest power outage information for Colombo?"
"When is the next scheduled maintenance in my area?"
"How can I pay my electricity bill online?"
```

### Query Health Services
```
"What hospitals are available in Kandy?"
"What health services does the government provide?"
"Emergency health hotline numbers"
```

## 🔧 Development

### Adding New Agents
1. Create agent directory in `backend/agents/`
2. Implement agent class with required tools
3. Create task manager for request handling
4. Set up server with A2A protocol support
5. Register agent with Host Agent

### API Documentation
- **A2A Protocol**: JSON-RPC 2.0 based communication
- **Agent Cards**: Service discovery via `.well-known/agent.json`
- **Task Management**: Async task handling with streaming support

## 🤝 Contributing

This project is part of the TECH-TRIATHLON hackathon, demonstrating innovative government service delivery through AI agents.

**Features to Contribute:**
- Additional government service agents
- Enhanced UI/UX interfaces
- Mobile app integration
- Advanced analytics dashboard

## 📄 License

This project is developed for educational and demonstration purposes as part of the TECH-TRIATHLON hackathon.

---

**GovPulse** - *Bridging Citizens and Government Services Through Intelligent AI Agents* 🏛️✨

