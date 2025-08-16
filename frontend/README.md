# GovPulse Frontend

A modern React + TypeScript + Vite application for the GovPulse platform, providing citizens with a streamlined interface to interact with government services.

## 🚀 Features

- **Modern Stack**: Built with React 19, TypeScript, and Vite
- **Authentication**: Integrated with Clerk for secure user authentication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Component Library**: Custom components with Radix UI primitives
- **PDF Generation**: Built-in PDF generation with jsPDF
- **QR Code Support**: QR code generation and scanning capabilities
- **Image Processing**: HTML2Canvas for screenshot capabilities
- **Hot Module Replacement**: Fast development with Vite HMR

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Docker** (optional): For containerized deployment

## 🛠️ Installation & Setup

### Option 1: Local Development (Without Docker)

#### 1. Clone the Repository
```bash
git clone https://github.com/RMCV-Rajapaksha/GovPulse.git
cd GovPulse/frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create a `.env` file in the frontend directory by copying from the example:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Alternative (Command Prompt)
copy .env.example .env
```

Edit the `.env` file with your configuration:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 4. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### 5. Build for Production
```bash
# Standard build
npm run build

# Production build with optimized TypeScript configuration
npm run build:prod
```

#### 6. Preview Production Build
```bash
npm run preview
```

### Option 2: Docker Deployment

#### 1. Using Docker Compose (Recommended)
```bash
# Navigate to frontend directory
cd frontend

# Build and start the container
docker-compose up --build

# Run in detached mode
docker-compose up -d --build
```

#### 2. Using Docker Commands
```bash
# Build the Docker image
docker build -t govpulse-frontend .

# Run the container
docker run -p 5173:5173 govpulse-frontend

# Run in detached mode
docker run -d -p 5173:5173 --name govpulse-frontend govpulse-frontend
```

#### 3. Stop Docker Services
```bash
# Stop docker-compose services
docker-compose down

# Stop individual container
docker stop govpulse-frontend
docker rm govpulse-frontend
```

The Docker deployment will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── logo.png           # Application logo
│   ├── appointment/       # Appointment-related assets
│   ├── post/             # Post-related assets
│   └── trending/         # Trending content assets
├── src/
│   ├── app/              # App configuration and store
│   ├── assets/           # Dynamic assets
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── scripts/              # Build and utility scripts
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile           # Docker configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🧰 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Building
npm run build            # Build for production
npm run build:prod       # Build with production TypeScript config

# Testing & Quality
npm run lint             # Run ESLint
npm run preview          # Preview production build

# Utilities
npm run create-component # Generate new component boilerplate
```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication public key | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image uploads | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 🔧 Development Guidelines

### Code Style
- **ESLint**: Configured with TypeScript and React rules
- **TypeScript**: Strict mode enabled for better type safety
- **Prettier**: Code formatting (if configured)

### Component Creation
Use the built-in component generator:
```bash
npm run create-component
```

### File Organization
- Place reusable components in `src/components/`
- Page components go in `src/pages/`
- Utility functions in `src/utils/`
- Type definitions alongside their usage

### Git Workflow
- Create feature branches from `main`
- Use conventional commit messages
- Ensure all tests pass before pushing

## 🐳 Docker Configuration

### Development with Docker
The Dockerfile uses Node.js 18 and includes:
- Multi-stage build optimization
- Production-ready build process
- Port 5173 exposure
- Proper working directory setup

### Docker Environment
- **Base Image**: Node.js 18 (Ubuntu-based)
- **Port**: 5173
- **Build Command**: `npm run build:prod`
- **Start Command**: `npm run preview`

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

#### Docker Issues
```bash
# Remove all containers and images
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### TypeScript Errors
```bash
# Type check without building
npx tsc --noEmit

# Clear TypeScript cache
npx tsc --build --clean
```

## 📦 Dependencies

### Production Dependencies
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **Clerk**: Authentication service
- **Axios**: HTTP client
- **React Router**: Client-side routing

### Key Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library
- **jsPDF**: PDF generation
- **QRCode**: QR code generation
- **html2canvas**: Screenshot capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` directory for additional guides
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions

## 🔗 Related Projects

- [GovPulse Backend](../backend/README.md)
- [GovPulse Agent](../agent/README.md)
- [Gov Time Sync](../gov-time-sync/README.md)
