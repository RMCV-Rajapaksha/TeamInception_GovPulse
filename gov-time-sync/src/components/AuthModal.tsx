import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { apiClient, UserSignupRequest, UserLoginRequest, OfficialRegisterRequest, OfficialLoginRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'citizen-login' | 'citizen-signup' | 'official-login' | 'official-signup' | null;
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
        case 'citizen-signup':
          response = await apiClient.userSignup(formData as UserSignupRequest);
          userType = 'citizen';
          break;
        case 'citizen-login':
          response = await apiClient.userLogin(formData as UserLoginRequest);
          userType = 'citizen';
          break;
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
      case 'citizen-signup': return 'Citizen Registration';
      case 'citizen-login': return 'Citizen Login';
      case 'official-signup': return 'Official Registration';
      case 'official-login': return 'Official Login';
      default: return 'Authentication';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'citizen-signup': return 'Create your citizen account to access government services';
      case 'citizen-login': return 'Sign in to your citizen account';
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
              {(type === 'citizen-signup') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        required
                        value={formData.first_name || ''}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        required
                        value={formData.last_name || ''}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nic">NIC Number</Label>
                    <Input
                      id="nic"
                      required
                      value={formData.nic || ''}
                      onChange={(e) => setFormData({...formData, nic: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
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

              {(type === 'citizen-login') && (
                <>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
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

              {(type === 'citizen-login' || type === 'citizen-signup') && (
                <div className="text-center text-sm text-muted-foreground">
                  {type === 'citizen-login' ? (
                    <span>
                      Need an account?{' '}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => window.location.reload()}
                      >
                        Sign up here
                      </button>
                    </span>
                  ) : (
                    <span>
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="text-primary hover:underline"
                        onClick={() => window.location.reload()}
                      >
                        Sign in here
                      </button>
                    </span>
                  )}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};