import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { API_CONFIG } from "@/lib/config";

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { loginWithToken } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const success = urlParams.get('success');
        const error = urlParams.get('error');
        const errorMessage = urlParams.get('message');

        // Check if backend already processed and redirected with token
        if (success === 'true' && token) {
          setMessage("Authentication successful! Redirecting...");
          setStatus("success");

          // Decode the JWT to get user data
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);

            localStorage.setItem('auth_token', token);
            
            // Fetch user details with the token
            const userResponse = await fetch(`${API_CONFIG.BASE_URL}/users/me`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              localStorage.setItem('auth_user', JSON.stringify(userData));
              loginWithToken({ token, user: userData, success: true });
            }
          } catch (e) {
            console.error('Error decoding token:', e);
          }

          // Redirect to dashboard
          setTimeout(() => {
            setLocation("/dashboard");
          }, 1000);
          return;
        }

        // Handle error from backend redirect
        if (error) {
          throw new Error(errorMessage || `Authentication error: ${error}`);
        }

        // Fallback: If we have a code, process it
        const code = urlParams.get('code');
        if (!code) {
          throw new Error('No authorization code or token received');
        }

        setMessage("Exchanging code for access token...");

        // Send the code to our backend
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINTS.GITHUB_CALLBACK}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Authentication failed: ${errorData}`);
        }

        const authResponse = await response.json();
        
        // Check if authentication was successful
        if (!authResponse.success && authResponse.error) {
          throw new Error(authResponse.message || 'Authentication failed');
        }
        
        setMessage("Authentication successful! Redirecting...");
        setStatus("success");

        // Store token and user data
        if (authResponse.token) {
          localStorage.setItem('auth_token', authResponse.token);
        }
        if (authResponse.user) {
          // Ensure isOnboarded has a default value
          const userData = {
            ...authResponse.user,
            isOnboarded: authResponse.user.isOnboarded ?? true
          };
          localStorage.setItem('auth_user', JSON.stringify(userData));
          loginWithToken({ ...authResponse, user: userData });
        }

        // Redirect to dashboard immediately
        setTimeout(() => {
          setLocation("/dashboard");
        }, 1000);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Authentication failed");
        
        // Redirect to login page after error
        setTimeout(() => {
          setLocation("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [loginWithToken, setLocation]);

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-8 h-8 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "error":
        return <AlertCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "text-blue-600";
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            {getIcon()}
            <div>
              <h2 className="text-xl font-semibold mb-2">GitHub Authentication</h2>
              <p className={`text-sm ${getStatusColor()}`}>
                {message}
              </p>
            </div>
            
            {status === "loading" && (
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            )}
            
            {status === "error" && (
              <p className="text-xs text-gray-500 mt-2">
                Redirecting to login page...
              </p>
            )}
            
            {status === "success" && (
              <p className="text-xs text-gray-500 mt-2">
                Redirecting to dashboard...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
