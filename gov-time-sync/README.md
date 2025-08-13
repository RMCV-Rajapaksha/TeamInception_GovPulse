# GovTimeSync Frontend

A modern React-based frontend application for the Sri Lankan Government Time Synchronization system. This application provides an intuitive interface for government officials to manage their time slots and appointments.

## 🌟 Features

### For Government Officials
- **Time Slot Management**: Create and manage available appointment slots
- **Dashboard Overview**: View all appointments and manage schedules efficiently
- **Appointment Tracking**: Monitor and update appointment statuses
- **User-friendly Interface**: Modern, responsive design optimized for all devices
- **Secure Authentication**: Secure login and registration system

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner + Radix Toast

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (version 18 or higher)
- npm or yarn package manager
- Access to the GovPulse backend API

## 🚀 Getting Started

### Installation

1. Clone the repository and navigate to the gov-time-sync directory:
```bash
cd gov-time-sync
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application in development mode
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality checks

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── AuthModal.tsx   # Authentication modal component
│   ├── Navigation.tsx  # Main navigation component
│   └── TimeSlotDashboard.tsx  # Dashboard for managing time slots
├── pages/              # Application pages
│   ├── Index.tsx       # Landing page and main app interface
│   └── NotFound.tsx    # 404 error page
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🎨 UI Components

This project uses a combination of:
- **Radix UI**: Accessible, unstyled UI primitives
- **shadcn/ui**: Beautiful, customizable components built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for styling

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory and configure the following variables:
```env
VITE_API_BASE_URL=your_backend_api_url
VITE_APP_TITLE=GovTimeSync
```

### Vite Configuration
The application is configured to run on port 8080 by default. You can modify this in `vite.config.ts`.

## 🌐 Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be generated in the `dist/` directory, ready for deployment to any static hosting service.

### Development Build
```bash
npm run build:dev
```

## 🔒 Security Features

- Secure authentication system with JWT tokens
- Protected routes for authenticated users
- Input validation using Zod schemas
- CSRF protection and secure headers

## 🎯 Key Components

### AuthModal
Handles government official authentication with separate login/signup flows.

### TimeSlotDashboard
Main interface for managing appointment time slots, optimized for government officials.

### Navigation
Responsive navigation component with authentication state management for officials.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices
- Government office workstations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## 📄 License

This project is part of the GovPulse system for the Sri Lankan government and is subject to government licensing terms.

## 🆘 Support

For technical support or questions about the GovTimeSync frontend:
- Create an issue in the repository
- Contact the development team
- Refer to the main GovPulse documentation

## 🔄 Integration

This frontend application integrates with:
- **GovPulse Backend API**: For data management and business logic
- **Official Authentication Service**: For government official user management
- **Notification Service**: For real-time updates

---

Built with ❤️ for the Sri Lankan Government by the TECH-TRILITHON team.