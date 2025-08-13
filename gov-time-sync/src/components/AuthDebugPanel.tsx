import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const AuthDebugPanel = () => {
  const { user, isLoading, logout, isAuthenticated } = useAuth();

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>Session Debug Panel</CardTitle>
        <CardDescription>Current authentication status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-semibold">Status: </span>
          {isLoading ? (
            <Badge variant="secondary">Loading...</Badge>
          ) : isAuthenticated ? (
            <Badge variant="default">Authenticated</Badge>
          ) : (
            <Badge variant="destructive">Not Authenticated</Badge>
          )}
        </div>
        
        {user && (
          <>
            <div>
              <span className="font-semibold">User Type: </span>
              <Badge variant="outline">{user.type}</Badge>
            </div>
            <div>
              <span className="font-semibold">Token: </span>
              <code className="text-xs bg-gray-100 p-1 rounded">
                {user.token.substring(0, 20)}...
              </code>
            </div>
          </>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          <p>LocalStorage Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
          <p>LocalStorage UserType: {localStorage.getItem('userType') || 'Missing'}</p>
        </div>
        
        {isAuthenticated && (
          <Button onClick={logout} variant="outline" size="sm" className="w-full mt-2">
            Logout
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
