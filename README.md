
# 🏛 GovPulse - Intelligent Government Issue Management Platform

**GovPulse** is a comprehensive digital government service platform designed to revolutionize public service delivery in Sri Lanka. The platform combines intelligent issue management, AI-powered chatbot assistance, and multi-agent service coordination to provide citizens with transparent, efficient, and accessible government services.

![GovPulse Platform](https://img.shields.io/badge/Platform-Government_Service_Management-blue)
![License](https://img.shields.io/badge/License-Educa## 🤝 Contributing

This project is part of the **TECH-TRIATHLON** hackathon, demonstrating innovative solutions for digital government service delivery in Sri Lanka.

### Development Guidelines

#### **Code Standards**
1. **TypeScript First**: All new frontend code must use TypeScript
2. **ESLint Compliance**: Follow established linting rules across all projects  
3. **API Documentation**: Update OpenAPI specifications for backend changes
4. **Docker Ready**: Ensure all new services are containerizable
5. **Database Migrations**: Use Prisma migrations for database schema changes

#### **Project Structure**
```
GovPulse/
├── frontend/           # React citizen portal (Port 5173)
├── gov-time-sync/     # React official portal (Port 8080)  
├── backend/           # Node.js API server (Port 4000)
├── agent/             # Python AI agent system
│   ├── backend/host/       # Host agent (Port 11000)
│   ├── backend/agents/ceb/ # CEB agent (Port 10010)
│   └── backend/agents/health/ # Health agent (Port 10011)
└── docs/             # Documentation and diagrams
```

#### **Component Development**
**Frontend Components:**
```bash
# GovPulse Frontend
cd frontend
npm run create-component ComponentName

# GovTimeSync Frontend  
cd gov-time-sync
# Follow shadcn/ui patterns for new components
```

**API Development:**
```bash
# Backend API endpoints
cd backend
# Add routes to /routes/v2/
# Update OpenAPI spec in openapi-spec-v2.yaml
# Test with Swagger UI at /api-docs
```

**AI Agent Development:**
```bash  
# New agent creation
cd agent/backend/agents
mkdir new-agent
# Follow existing CEB/Health agent patterns
# Update docker-compose.yml for containerization
```

### Areas for Contribution

#### **High Priority**
1. **Mobile App Development**: React Native apps for citizens and officials
2. **Advanced Analytics**: Performance dashboards with data visualization
3. **Multi-Language Support**: Sinhala/Tamil language integration
4. **API Testing Suite**: Comprehensive automated testing framework

#### **Medium Priority**  
5. **Enhanced UI/UX**: Accessibility improvements and user experience optimization
6. **Additional Government Agents**: Transport, Agriculture, Social Welfare services
7. **Real-time Features**: WebSocket integration for live updates
8. **Security Enhancements**: Advanced authentication and authorization

#### **Future Features**
9. **Blockchain Integration**: Transparent and immutable record keeping
10. **IoT Integration**: Smart city data integration and monitoring
11. **Advanced AI**: Machine learning for predictive governance
12. **Public APIs**: Open APIs for third-party developer integration

### Contribution Process

1. **Fork the Repository** and create a feature branch
2. **Follow Naming Conventions**: `feature/component-name` or `fix/issue-description`
3. **Update Documentation**: README updates and API documentation
4. **Test Your Changes**: Ensure all services work with Docker setup
5. **Submit Pull Request** with detailed description of changes

### Testing & Quality Assurance

```bash
# Frontend Testing
cd frontend && npm run lint
cd gov-time-sync && npm run lint

# Backend Testing  
cd backend && npm run dev  # Check for compilation errors

# AI Agent Testing
cd agent && docker-compose up --build  # Verify all agents start

# Integration Testing
# Test full workflow: Issue creation → AI processing → Appointment booking
```ech Stack](https://img.shields.io/badge/Tech-React_Node_Python_AI-orange)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen)
![Build](https://img.shields.io/badge/Build-Docker_Ready-blue)

## 🎯 Project Vision

GovPulse addresses the critical challenges of inefficient government service delivery in Sri Lanka by creating a unified digital platform that connects citizens with government services through intelligent automation, transparent issue management, and AI-powered assistance. The platform eliminates bureaucratic delays and ensures fair, prioritized handling of citizen requests based on urgency and societal impact.

## 🌟 Key Features

### 🏛️ **Multi-Application Ecosystem**

**1. GovPulse Frontend** - Citizen Portal
- Comprehensive issue reporting and tracking system
- Smart appointment booking with government officials
- Document management and verification system
- PDF receipt generation with QR codes
- Real-time notifications and status updates

**2. GovTimeSync** - Official Management Portal
- Authority-specific dashboard for government officials
- Issue management and status tracking
- Appointment scheduling and management
- Feedback and performance analytics
- Authority issue oversight capabilities

**3. AI Agent System** - Intelligent Service Assistant
- Multi-agent architecture using Google A2A Protocol
- Specialized agents for different government sectors (CEB, Health, etc.)
- Real-time information retrieval with Perplexity AI integration
- Natural language processing with OpenAI GPT-4

### � **Advanced Issue Management**

- **AI-Powered Issue Classification**: Automatic categorization by government sector
- **Intelligent Urgency Scoring**: AI-generated priority based on multiple parameters
- **Duplicate Detection**: Advanced algorithms prevent issue fragmentation
- **Transparent Tracking**: Real-time status updates with email notifications
- **Community Validation**: Reddit-style upvoting system for issue prioritization

### 📅 **Smart Appointment System**

- **Automated Scheduling**: AI-assisted booking with available officials
- **Multi-Platform Access**: Citizens and officials can manage appointments
- **Document Preparation**: Authority-specific document checklists
- **24-Hour Reminders**: Automated email notifications with preparation tips
- **QR Code Verification**: Digital receipt system for appointment validation

### 🤖 **Intelligent AI Assistance**

- **Multi-Agent Architecture**: Specialized agents for different government sectors
- **Real-time Information**: Live updates from government sources via Perplexity API
- **Natural Language Processing**: Advanced query understanding and response generation
- **Agent-to-Agent Communication**: Seamless task delegation between specialized services
- **Voice and Text Input**: Accessible interaction methods for all users

### 📊 **Comprehensive Analytics Dashboard**

- **Performance Metrics**: Issue resolution statistics and trends
- **Authority Analytics**: Department-specific performance tracking
- **Feedback Analysis**: Citizen satisfaction monitoring
- **Predictive Insights**: AI-driven forecasting for resource allocation

### � **Automated Notification System**

- **Email Notifications**: Status updates, appointment reminders, and confirmations
- **Multi-Trigger System**: Appointment booking, status changes, and rescheduling
- **Authority-Specific Content**: Customized document requirements by department
- **Smart Scheduling**: Automated 24-hour reminder system

### � **Document Management & Verification**

- **PDF Receipt Generation**: Professional appointment receipts with QR codes
- **Document Upload System**: Cloudinary integration for file management
- **Face Recognition**: Advanced identity verification using face-api.js
- **Digital Signatures**: Secure document authentication

## 🏗 System Architecture

![GovPulse Architecture](docs/GovPulse-architecture.drawio.png)

*System architecture diagram showing the multi-layered structure of GovPulse with React frontend, Node.js backend, and Python AI service components working together through A2A protocol*


##   Database Schema & ER Diagram

The GovPulse platform uses a comprehensive database schema designed to handle complex government issue management workflows. The Entity-Relationship diagram below illustrates the relationships between different entities in the system:

![GovPulse ER Diagram](docs/GovPulse-ER.drawio.png)

*Entity-Relationship diagram showing the database structure and relationships between users, issues, appointments, officials, and other core entities in the GovPulse system*

### Key Database Entities:

- **Users**: Citizens, government officials, and administrators
- **Issues**: Reported problems with metadata, location, and categorization
- **Appointments**: Scheduled meetings between citizens and officials
- **Officials**: Government personnel with department assignments
- **Upvotes**: Community-driven issue prioritization system
- **TimeSlots**: Available appointment scheduling windows
- **Government Sectors**: Organizational structure for issue categorization

## 🔄 System Flow & Sequence Diagrams

The following sequence diagrams illustrate the key workflows and interactions within the GovPulse platform, showing how different components communicate and process user requests:

![GovPulse Sequence Diagrams](docs/sequence-diagrams.svg)

*Sequence diagrams showing the flow of operations including issue reporting, AI processing, appointment booking, and inter-service communication patterns in the GovPulse ecosystem*

##  🛠 Technology Stack

### **Frontend Applications**

**GovPulse Frontend (Citizen Portal)**
- **React 19.1.0** with TypeScript
- **Vite 7.0.4** for fast development and building
- **TailwindCSS 4.1.11** for modern UI styling
- **Clerk Authentication** for secure user management
- **Radix UI** components for accessibility
- **Redux Toolkit** for state management
- **React Router 7.8.0** for navigation
- **Cloudinary** for image and file upload
- **jsPDF & html2canvas** for PDF generation
- **QR Code Generation** for appointment receipts

**GovTimeSync Frontend (Official Portal)**
- **React 18.3.1** with TypeScript
- **Vite 5.4.19** with SWC for ultra-fast compilation
- **shadcn/ui** + **Radix UI** for component library
- **TailwindCSS 3.4.17** with custom design system
- **React Hook Form** with **Zod** validation
- **Recharts** for advanced data visualization
- **React Router 6.30.1** for navigation
- **Sonner** for elegant toast notifications

### **Backend Services**

**Node.js API Server**
- **Node.js** with **Express.js 5.1.0**
- **Prisma 6.13.0** ORM with PostgreSQL
- **JWT Authentication** with bcrypt encryption
- **Clerk Express Integration** for user authentication
- **Nodemailer** for email notifications with **node-cron** scheduling
- **Swagger** documentation with OpenAPI specifications (v1 & v2)
- **Cloudinary SDK** for file management
- **Face-API.js** for identity verification
- **CORS & Security** middleware

### **AI Agent System**

**Multi-Agent Architecture (Python)**
- **Google Agent Development Kit (ADK)** with Gemini 2.0 Flash
- **Agent-to-Agent Protocol (A2A)** for inter-service communication
- **LangGraph** for agent workflow orchestration
- **LangChain** for AI model integration
- **OpenAI GPT-4** for natural language processing
- **Perplexity API** for real-time information retrieval
- **FastAPI & Starlette** for API services
- **Docker** containerization for deployment

**Specialized Agents:**
- **Host Agent** (Port 11000): Central orchestrator using Google ADK
- **CEB Agent** (Port 10010): Electricity board services with real-time updates
- **Health Agent** (Port 10011): Healthcare information and services

### **Database & Infrastructure**

**Database System**
- **PostgreSQL** as primary database
- **Prisma Schema** with comprehensive entity relationships
- **Database Migrations** with version control
- **Foreign Key Constraints** with cascade operations

**Key Database Entities:**
- **Users**: Citizens with Clerk integration
- **Officials**: Government personnel with authority assignments
- **Issues**: Comprehensive issue tracking with AI scoring
- **Appointments**: Meeting scheduling with time slot management
- **Authorities**: Government departments and ministries
- **Feedback**: Performance evaluation system
- **Attachments**: File management for documents

### **External Integrations & APIs**

**Third-Party Services**
- **Clerk** for authentication and user management
- **Cloudinary** for image and document storage
- **OpenAI API** for natural language processing
- **Google Gemini API** for advanced AI capabilities
- **Perplexity API** for real-time information retrieval
- **Nodemailer + Gmail SMTP** for email notifications

### **Development & Deployment Tools**

**Development Environment**
- **Docker & Docker Compose** for containerization
- **ESLint** for code quality across all projects
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Git** for version control

**Build & Deployment**
- **Multi-stage Docker builds** for production optimization
- **Health checks** and container monitoring
- **Environment variable management** with .env files
- **Automated build scripts** (build.sh, run.sh, stop.sh)
- **CI/CD ready** with Docker-based deployments

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.11+
- **Docker & Docker Compose** (Recommended)
- **PostgreSQL** 12+ (for database)
- **Git** for version control

### 🐳 Docker Deployment (Recommended)

The fastest way to get GovPulse running is using Docker Compose:

#### 1. Clone Repository
```bash
git clone https://github.com/RMCV-Rajapaksha/GovPulse.git
cd GovPulse
```

#### 2. Frontend Setup (Citizen Portal)
```bash
cd frontend
docker-compose up --build -d
# Available at http://localhost:5173
```

#### 3. GovTimeSync Setup (Official Portal)
```bash
cd gov-time-sync
npm install
npm run dev
# Available at http://localhost:8080
```

#### 4. Backend API Setup
```bash
cd backend
# Configure environment variables (see Environment Configuration)
npm install
npx prisma generate
npm run dev
# Available at http://localhost:4000
```

#### 5. AI Agent System Setup
```bash
cd agent
# Copy environment template
cp .env.docker .env
# Edit .env with your API keys

# Build and start all agents
./build.sh    # Linux/Mac
.\build.bat   # Windows

./run.sh      # Linux/Mac
.\run.bat     # Windows

# Agents will be available at:
# Host Agent: http://localhost:11000
# CEB Agent: http://localhost:10010
# Health Agent: http://localhost:10011
```

### 💻 Manual Installation

#### Frontend Setup (GovPulse)
```bash
cd frontend
npm install
npm run dev
```

#### Official Portal Setup (GovTimeSync)
```bash
cd gov-time-sync
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

#### AI Agents Setup
```bash
cd agent
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start individual agents
cd backend/agents/ceb && python server.py      # Port 10010
cd backend/agents/health && python server.py  # Port 10011
cd backend/host && python server.py           # Port 11000
```


### 5. Environment Configuration

Create environment files for each service:

**Frontend (.env)**
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**GovTimeSync (.env)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_TITLE=GovTimeSync
```

**Backend (.env)**
```env
# Server Configuration
NODE_ENV=development
BACKEND_PORT=4000
DATABASE_URL=postgresql://user1:admin@localhost:5432/govpulse
JWT_SECRET=your_jwt_secret_key

# Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AI Services
AI_SERVICE_URL=http://localhost:11000
GOOGLE_API_KEY=your_google_api_key

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
NOTIFICATION_TIMEZONE=Asia/Colombo
REMINDER_HOURS_BEFORE=24
MAX_NOTIFICATION_RETRIES=3
```

**AI Agent System (.env)**
```env
# Required API Keys
OPEN_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key

# Optional: Enhanced Features
PERPLEXITY_API_KEY=your_perplexity_api_key
LANGSMITH_API_KEY=your_langsmith_key
LANGCHAIN_TRACING_V2=false
LANGSMITH_PROJECT=GovPulse

# Agent Configuration
HOST_AGENT_PORT=11000
CEB_AGENT_PORT=10010
HEALTH_AGENT_PORT=10011

# Agent URLs (for Docker)
CEB_AGENT_URL=http://ceb-agent:10010
HEALTH_AGENT_URL=http://health-agent:10011
```

### 6. Database Setup

**PostgreSQL Setup:**
```bash
# Install PostgreSQL and create database
createdb govpulse

# Navigate to backend directory
cd backend

# Run database setup scripts
psql -d govpulse -f db_scripts/govpulse_db_create.sql
psql -d govpulse -f db_scripts/sample_data_insert.sql

# Generate Prisma client
npx prisma generate
```

### 7. Email Configuration

**Quick Setup:**
```bash
cd backend
node setup-email-config.js
```

**Manual Gmail Setup:**
1. Enable 2-Factor Authentication on Google Account
2. Generate App Password in Google Security Settings
3. Use Gmail address for `EMAIL_USER`
4. Use App Password for `EMAIL_PASS`

### 8. Verification

**Check Service Status:**
```bash
# Frontend Applications
curl http://localhost:5173  # GovPulse Citizen Portal
curl http://localhost:8080  # GovTimeSync Official Portal

# Backend API
curl http://localhost:4000  # Main API Server

# AI Agents
curl http://localhost:11000/.well-known/agent.json  # Host Agent
curl http://localhost:10010/.well-known/agent.json  # CEB Agent  
curl http://localhost:10011/.well-known/agent.json  # Health Agent
```


## 💡 Usage Examples

### **For Citizens (GovPulse Portal)**

**1. Issue Reporting & Management**
```
1. Register/Login using Clerk authentication
2. Navigate to "Report Issue" section
3. Fill form with AI-assisted categorization
4. Upload supporting documents via Cloudinary
5. Receive confirmation with issue tracking ID
6. Monitor progress via dashboard with real-time updates
```

**2. Appointment Booking**
```
1. Browse available government services
2. Select relevant authority and service type
3. Choose available time slots from calendar
4. Confirm booking and receive PDF receipt with QR code
5. Get 24-hour email reminder with document checklist
6. Attend appointment with QR code verification
```

**3. AI Assistant Interaction**
```
User: "I need information about electricity bill payment options"
AI Agent: Connects to CEB Agent → Provides real-time payment methods, 
         office locations, online portal access, and current policies
```

### **For Government Officials (GovTimeSync Portal)**

**1. Authority Dashboard**
```
1. Login with official credentials
2. View authority-specific issue dashboard
3. Filter issues by status, urgency, or category  
4. Update issue status with email notifications to citizens
5. Generate performance reports and analytics
```

**2. Appointment Management**
```
1. Access appointment calendar interface
2. Add/remove available time slots
3. View upcoming appointments with citizen details
4. Add official comments and feedback
5. Reschedule or cancel appointments with automated notifications
```

**3. Feedback & Analytics**
```
1. Review citizen feedback and satisfaction ratings
2. Analyze department performance metrics
3. Generate reports for higher authorities
4. Monitor resolution times and efficiency trends
```

### **AI Agent System Queries**

**CEB (Electricity) Services:**
```
"What are the current power outages in Colombo?"
"How can I apply for a new electricity connection?"
"What are the latest electricity tariff rates?"
"When is the scheduled maintenance in my area?"
```

**Health Services:**
```
"Which government hospitals are available in Kandy?"
"What vaccination programs are currently running?"
"How do I register for the national health insurance?"
"What are the emergency contact numbers for health services?"
```

**Multi-Agent Coordination:**
```
User: "I have an issue with hospital electricity supply"
Host Agent: Routes query to both Health and CEB agents
Response: Coordinated information about hospital power backup 
         systems, emergency protocols, and reporting procedures
```

## 🔮 Future Enhancements

### **Platform Expansion**
- **Mobile Applications**: Native iOS and Android apps with offline capabilities
- **Multi-Language Support**: Complete Sinhala and Tamil language support
- **Voice Interface**: Advanced voice commands and speech-to-text integration
- **Blockchain Integration**: Immutable record keeping for transparency and audit trails

### **Advanced AI Features**
- **Predictive Analytics**: Machine learning for issue pattern recognition and prevention
- **Sentiment Analysis**: Automatic detection of urgent cases based on language sentiment  
- **Document AI**: Automated document processing and validation using OCR
- **Chatbot Enhancement**: Advanced conversational AI with context awareness

### **Integration & Connectivity**
- **Government API Integration**: Direct connections with existing government systems
- **Banking Integration**: Online payment processing for government services
- **Third-Party Services**: Integration with postal, transport, and utility services
- **IoT Integration**: Real-time data from smart city infrastructure

### **Advanced Features**
- **Video Conferencing**: Built-in video calls for remote consultations
- **Digital Identity**: Blockchain-based digital ID verification system
- **Geospatial Analytics**: Location-based service optimization and planning
- **Advanced Reporting**: AI-powered insights and government performance dashboards

### **Scalability & Performance**
- **Microservices Architecture**: Breaking down into smaller, scalable services
- **Cloud Native Deployment**: Kubernetes orchestration for production scaling
- **CDN Integration**: Global content delivery for faster access
- **Real-time Collaboration**: Multi-user editing and collaboration tools

## 🤝 Contributing

This project is part of the **TECH-TRIATHLON** hackathon, demonstrating innovative solutions for government efficiency and transparency.

### Development Guidelines

1. Follow established coding standards for each technology stack
2. Ensure comprehensive testing for all new features
3. Maintain documentation for API endpoints and AI agent behaviors
4. Consider accessibility and multilingual support in all implementations

### Areas for Contribution

- Enhanced UI/UX design for better citizen experience
- Additional AI agents for other government departments
- Advanced analytics and reporting features
- Mobile app development
- Integration with existing government systems

## 📄 License

This project is developed for educational and demonstration purposes as part of the **TECH-TRIATHLON** hackathon. The solution demonstrates the potential for AI-driven government service improvement in Sri Lanka.

**License**: MIT License - See LICENSE file for details

**Attribution**: Please provide appropriate credit when using or referencing this project.

## 📞 Contact & Support

### **Project Team**
- **GitHub**: [RMCV-Rajapaksha](https://github.com/RMCV-Rajapaksha)
- **Project Repository**: [GovPulse](https://github.com/RMCV-Rajapaksha/GovPulse)

### **Technical Support**

**Documentation:**
- [Frontend Documentation](./frontend/README.md)
- [GovTimeSync Documentation](./gov-time-sync/README.md) 
- [Backend API Documentation](./backend/README.md)
- [AI Agent System Documentation](./agent/README.md)
- [Docker Deployment Guide](./agent/DOCKER_GUIDE.md)

**Feature Documentation:**
- [Email Notification System](./EMAIL_NOTIFICATION_SYSTEM.md)
- [PDF Receipt System](./docs/PDF_RECEIPT_SYSTEM.md)
- [Appointment Management](./APPOINTMENTS_FEATURE.md)
- [Authority Issues Management](./gov-time-sync/AUTHORITY_ISSUES_FEATURE.md)

**API Documentation:**
- Swagger UI: `http://localhost:4000/api-docs` (when backend is running)
- OpenAPI v2 Spec: [./backend/openapi-spec-v2.yaml](./backend/openapi-spec-v2.yaml)

### **Community & Development**

**Issues & Bugs**: [GitHub Issues](https://github.com/RMCV-Rajapaksha/GovPulse/issues)

**Discussions**: [GitHub Discussions](https://github.com/RMCV-Rajapaksha/GovPulse/discussions)

**Contributing**: See [Contributing Guidelines](#-contributing) above

### **Deployment Support**

**Docker Help**: [Docker Guide](./agent/DOCKER_GUIDE.md)

**Environment Setup**: [Configuration Guide](#5-environment-configuration)

---

**GovPulse** - _Empowering Citizens, Enabling Government, Ensuring Transparency through Digital Innovation_ 🏛✨

_Building a more efficient, transparent, and accessible government through intelligent technology solutions._

**Version**: 1.0.0 | **Build**: Production Ready | **Status**: Active Development
