import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X, Calendar, BarChart3, Home, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface AuthenticatedNavigationProps {
  onLogout: () => void;
}

export const AuthenticatedNavigation = ({ onLogout }: AuthenticatedNavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
            <Button 
              variant="ghost" 
              className={`text-primary-foreground hover:bg-white/10 ${
                isActive('/') ? 'bg-white/20' : ''
              }`}
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              className={`text-primary-foreground hover:bg-white/10 ${
                isActive('/analytics') ? 'bg-white/20' : ''
              }`}
              asChild
            >
              <Link to="/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            
            <div className="flex items-center ml-6">
              <Button 
                variant="secondary"
                onClick={onLogout}
                className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
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
              <Button 
                variant="ghost" 
                className={`w-full text-left text-primary-foreground hover:bg-white/10 ${
                  isActive('/') ? 'bg-white/20' : ''
                }`}
                asChild
              >
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className={`w-full text-left text-primary-foreground hover:bg-white/10 ${
                  isActive('/analytics') ? 'bg-white/20' : ''
                }`}
                asChild
              >
                <Link to="/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Link>
              </Button>
              
              <div className="border-t border-white/20 pt-4">
                <Button 
                  variant="secondary"
                  onClick={onLogout}
                  className="w-full bg-white/10 text-primary-foreground border-white/20 hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
