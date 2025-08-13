import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { apiClient, OfficialRegisterRequest, OfficialLoginRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'official-login' | 'official-signup' | null;
  onSuccess: (token: string, userType: string) => void;
}

export const AuthModal = ({ isOpen, onClose, type, onSuccess }: AuthModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      let userType = '';

      switch (type) {
        case 'official-signup':
          response = await apiClient.officialRegister(formData as OfficialRegisterRequest);
          userType = 'official';
          break;
        case 'official-login':
          response = await apiClient.officialLogin(formData as OfficialLoginRequest);
          userType = 'official';
          break;
        default:
          throw new Error('Invalid auth type');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('userType', userType);
      
      toast({
        title: "Success!",
        description: response.message || "Authentication successful",
      });

      onSuccess(response.token, userType);
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'official-signup': return 'Official Registration';
      case 'official-login': return 'Official Login';
      default: return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'official-signup': return 'Register as a government official';
      case 'official-login': return 'Sign in to your official account';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardDescription>{getDescription()}</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              {(type === 'official-signup') && (
                <>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      required
                      value={formData.username || ''}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      required
                      placeholder="e.g., District Secretary"
                      value={formData.position || ''}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="authority_id">Authority ID</Label>
                    <Input
                      id="authority_id"
                      type="number"
                      required
                      value={formData.authority_id || ''}
                      onChange={(e) => setFormData({...formData, authority_id: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </>
              )}

              {(type === 'official-login') && (
                <>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      required
                      value={formData.username || ''}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? 'Loading...' : 'Submit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};