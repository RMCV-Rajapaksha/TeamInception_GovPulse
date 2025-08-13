import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AuthenticatedNavigation } from "@/components/AuthenticatedNavigation";
import { AuthModal } from "@/components/AuthModal";
import { TimeSlotDashboard } from "@/components/TimeSlotDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, Shield } from "lucide-react";

const Index = () => {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'official-login' | 'official-signup' | null;
  }>({
    isOpen: false,
    type: null,
  });
  
  const [user, setUser] = useState<{ token: string; type: string } | null>(null);

  const handleAuthClick = (type: 'official-login' | 'official-signup') => {
    setAuthModal({ isOpen: true, type });
  };

  const handleAuthSuccess = (token: string, userType: string) => {
    setUser({ token, type: userType });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedNavigation onLogout={handleLogout} />
        <TimeSlotDashboard userType={user.type} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card">
      <Navigation onAuthClick={handleAuthClick} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
              Sri Lankan Government{' '}
              <span className="block text-accent">Official Portal</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Manage government appointments and services efficiently. Official time slot management system for government authorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="accent" 
                size="lg"
                onClick={() => handleAuthClick('official-signup')}
                className="text-lg px-8 py-3"
              >
                <Shield className="h-5 w-5 mr-2" />
                Register as Official
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => handleAuthClick('official-login')}
                className="text-lg px-8 py-3 bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
              >
                <Shield className="h-5 w-5 mr-2" />
                Official Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Efficient Government Operations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional time slot management for government officials to organize and schedule appointments effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card-government hover:shadow-government transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calendar className="h-6 w-6" />
                  Time Slot Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Create and manage appointment time slots efficiently. Organize your schedule to provide optimal service availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card-government hover:shadow-government transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="h-6 w-6" />
                  Appointment Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitor scheduled appointments and manage your daily workflow. Track appointment history and optimize scheduling.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card-government hover:shadow-government transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-6 w-6" />
                  Secure & Professional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Government-grade security for all official operations. Professional interface designed for efficient workflow management.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join government officials using GovTimeSync for efficient appointment management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="accent" 
              size="lg"
              onClick={() => handleAuthClick('official-login')}
            >
              Official Login
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => handleAuthClick('official-signup')}
              className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
            >
              Register as Official
            </Button>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, type: null })}
        type={authModal.type}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
