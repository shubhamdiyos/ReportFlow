import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/shared/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Github, Loader2, CheckCircle, AlertCircle, Mail, Lock, Eye, EyeOff, Moon, Sun, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { API_CONFIG } from "@/lib/config";

type OAuthState = "idle" | "loading" | "success" | "error";
type LoginMethod = "oauth" | "form";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [oauthState, setOauthState] = useState<OAuthState>("idle");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("oauth");
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleDemoLogin = () => {
    const demoUser = {
      id: "demo-1",
      name: "John Doe",
      username: "johndoe", 
      email: "john.doe@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
      role: "MANAGER" as const,
      githubId: null,
      isOnboarded: true,
      createdAt: new Date().toISOString()
    };
    login(demoUser);
  };

  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormLoading(true);
    setError("");

    try {
      // Simulate form login
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Deterministic success for enterprise-grade UX
      const formUser = {
        id: "form-user-123",
        name: "Form User",
        username: "formuser",
        email: formData.email,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
        role: "DEVELOPER" as const,
        githubId: null,
        isOnboarded: true,
        createdAt: new Date().toISOString()
      };

      toast({
        title: "Login successful!",
        description: "Welcome back to ReportFlow.",
      });

      login(formUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleGitHubOAuth = async () => {
    setOauthState("loading");
    setError("");
    
    try {
      // Get GitHub OAuth URL from backend
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINTS.GITHUB_URL}`);
      if (!response.ok) {
        throw new Error('Failed to get GitHub OAuth URL');
      }
      
      const { url } = await response.json();
      
      // Redirect to GitHub OAuth
      window.location.href = url;
      
    } catch (err) {
      setOauthState("error");
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Reset state after error
      setTimeout(() => {
        setOauthState("idle");
        setError("");
      }, 3000);
    }
  };

  // Handle OAuth callback (this would be called from a callback page)
  const handleOAuthCallback = async (code: string) => {
    setOauthState("loading");
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINTS.GITHUB_CALLBACK}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) {
        throw new Error('GitHub authentication failed');
      }
      
      const authResponse = await response.json();
      
      setOauthState("success");
      
      toast({
        title: "Authentication successful!",
        description: authResponse.message || "Welcome! Let's set up your workspace.",
      });
      
      // Use the new loginWithToken method
      if (authResponse.token && authResponse.user) {
        login(authResponse.user, authResponse.token);
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (err) {
      setOauthState("error");
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      setError(errorMessage);
      toast({
        title: "Authentication failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Reset state after error
      setTimeout(() => {
        setOauthState("idle");
        setError("");
      }, 3000);
    }
  };

  const getOAuthButtonContent = () => {
    switch (oauthState) {
      case "loading":
        return (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Connecting to GitHub...</span>
          </>
        );
      case "success":
        return (
          <>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">Success! Redirecting...</span>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="font-medium">Try Again</span>
          </>
        );
      default:
        return (
          <>
            <Github className="w-5 h-5" />
            <span className="font-medium">Continue with GitHub</span>
          </>
        );
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" data-testid="login-page">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30">
        {/* Animated particles/blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-3/4 left-1/3 w-48 h-48 bg-blue-500/6 rounded-full blur-2xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Theme Toggle */}
      <motion.div
        className="absolute top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-10 h-10 p-0 bg-background/80 backdrop-blur-sm border border-border/50"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </motion.div>

      {/* Back to Landing */}
      <motion.div
        className="absolute top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/">
          <Button variant="ghost" size="sm" className="bg-background/80 backdrop-blur-sm border border-border/50">
            ← Back to Home
          </Button>
        </Link>
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <Card className="border-0 shadow-2xl bg-card/40 backdrop-blur-xl ring-1 ring-white/20 dark:ring-white/10">
          <CardHeader className="text-center pb-4">
            <motion.div variants={itemVariants}>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Github className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="mt-2 text-muted-foreground">
                Sign in to access your GitHub analytics dashboard
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8 pt-0">
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Login Method Toggle */}
              <div className="flex bg-muted/50 rounded-lg p-1">
                <button
                  onClick={() => setLoginMethod("oauth")}
                  className={cn(
                    "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                    loginMethod === "oauth"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="toggle-oauth"
                >
                  OAuth
                </button>
                <button
                  onClick={() => setLoginMethod("form")}
                  className={cn(
                    "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all",
                    loginMethod === "form"
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid="toggle-form"
                >
                  Email
                </button>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive" data-testid="login-error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {loginMethod === "oauth" ? (
                  <motion.div
                    key="oauth"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Button
                      onClick={handleGitHubOAuth}
                      disabled={oauthState === "loading" || oauthState === "success"}
                      className="w-full flex items-center justify-center gap-3 h-12 bg-[#24292f] hover:bg-[#24292f]/90 text-white border-0"
                      data-testid="button-github-oauth"
                    >
                      {getOAuthButtonContent()}
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/50"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-card text-muted-foreground">Or try demo</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleDemoLogin}
                      disabled={oauthState === "loading" || oauthState === "success"}
                      variant="outline"
                      className="w-full h-12"
                      data-testid="button-demo-login"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Continue as Demo User
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleFormLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-10 h-12"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            data-testid="input-email"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 h-12"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            data-testid="input-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-10 w-10 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full h-12"
                        disabled={isFormLoading}
                        data-testid="button-form-login"
                      >
                        {isFormLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" data-testid="link-signup">
                  <Button variant="link" className="p-0 h-auto font-normal text-primary hover:underline">
                    Sign up here
                  </Button>
                </Link>
              </div>
              
              <div className="text-center text-xs text-muted-foreground leading-relaxed">
                By signing in, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
