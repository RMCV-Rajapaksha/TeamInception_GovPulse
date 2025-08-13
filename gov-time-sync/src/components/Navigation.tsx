import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Calendar, Users, FileText } from "lucide-react";

interface NavigationProps {
  onAuthClick: (type: 'official-login' | 'official-signup') => void;
}

export const Navigation = ({ onAuthClick }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-hero shadow-government">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Calendar className="h-8 w-8 text-primary-foreground mr-2" />
              <span className="text-xl font-bold text-primary-foreground">
                GovTimeSync
              </span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10">
              <FileText className="h-4 w-4 mr-2" />
              Services
            </Button>
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10">
              <Users className="h-4 w-4 mr-2" />
              About
            </Button>
            
            <div className="flex items-center space-x-2 ml-6">
              <Button 
                variant="secondary" 
                onClick={() => onAuthClick('official-signup')}
                className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
              >
                Register as Official
              </Button>
              <Button 
                variant="accent"
                onClick={() => onAuthClick('official-login')}
                className="bg-accent hover:bg-accent/90"
              >
                Official Login
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary-foreground hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Button variant="ghost" className="w-full text-left text-primary-foreground hover:bg-white/10">
                <FileText className="h-4 w-4 mr-2" />
                Services
              </Button>
              <Button variant="ghost" className="w-full text-left text-primary-foreground hover:bg-white/10">
                <Users className="h-4 w-4 mr-2" />
                About
              </Button>
              
              <div className="border-t border-white/20 pt-4 space-y-2">
                <Button 
                  variant="secondary" 
                  onClick={() => onAuthClick('official-signup')}
                  className="w-full bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
                >
                  Register as Official
                </Button>
                <Button 
                  variant="accent"
                  onClick={() => onAuthClick('official-login')}
                  className="w-full bg-accent hover:bg-accent/90"
                >
                  Official Login
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};