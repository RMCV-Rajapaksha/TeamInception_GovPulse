import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AuthModal } from "@/components/AuthModal";
import { TimeSlotDashboard } from "@/components/TimeSlotDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, FileText, Clock, CheckCircle, Shield } from "lucide-react";

const Index = () => {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    type: 'citizen-login' | 'citizen-signup' | 'official-login' | 'official-signup' | null;
  }>({
    isOpen: false,
    type: null,
  });
  
  const [user, setUser] = useState<{ token: string; type: string } | null>(null);

  const handleAuthClick = (type: 'citizen-login' | 'citizen-signup' | 'official-login' | 'official-signup') => {
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
        <div className="bg-gradient-hero">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary-foreground mr-2" />
                <span className="text-xl font-bold text-primary-foreground">GovTimeSync</span>
              </div>
              <Button variant="secondary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
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
              Sri Lankan Government
              <span className="block text-accent">Time Synchronization</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Streamline government appointments and services. Connect citizens with officials efficiently through our modern booking system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="accent" 
                size="lg"
                onClick={() => handleAuthClick('citizen-signup')}
                className="text-lg px-8 py-3"
              >
                <Users className="h-5 w-5 mr-2" />
                Get Started as Citizen
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => handleAuthClick('official-signup')}
                className="text-lg px-8 py-3 bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
              >
                <Shield className="h-5 w-5 mr-2" />
                Official Registration
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
              Efficient Government Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Modern solutions for traditional government processes, making services accessible to all Sri Lankan citizens.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card-government hover:shadow-government transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Calendar className="h-6 w-6" />
                  Easy Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Book appointments with government officials seamlessly. View available time slots and select what works best for you.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card-government hover:shadow-government transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="h-6 w-6" />
                  Real-time Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get instant notifications about your appointments. Stay informed about any changes or updates to your scheduled meetings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-card-government hover:shadow-government transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-6 w-6" />
                  Secure & Reliable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Your data is protected with government-grade security. Reliable service ensuring your appointments are never missed.
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
            Join thousands of Sri Lankan citizens already using GovTimeSync for their government service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="accent" 
              size="lg"
              onClick={() => handleAuthClick('citizen-login')}
            >
              Citizen Login
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => handleAuthClick('official-login')}
              className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
            >
              Official Login
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
