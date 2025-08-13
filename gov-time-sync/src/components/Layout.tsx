import { ReactNode } from "react";
import { AuthenticatedNavigation } from "@/components/AuthenticatedNavigation";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation onLogout={handleLogout} />
      {children}
    </div>
  );
};
