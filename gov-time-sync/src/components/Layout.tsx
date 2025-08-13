import { ReactNode, useEffect } from "react";
import { AuthenticatedNavigation } from "@/components/AuthenticatedNavigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to home
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading while validating session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation onLogout={handleLogout} />
      {children}
    </div>
  );
};
