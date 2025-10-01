import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { ArrowRight, Github, Users, BarChart3, CheckCircle } from "lucide-react";
import { apiService } from "@/lib/api";

export default function OnboardingWelcome() {
  const { user, updateUser } = useAuth();
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check onboarding status when component mounts
    const checkOnboardingStatus = async () => {
      try {
        const status = await apiService.getOnboardingStatus();
        if (status.user && status.user.isOnboarded) {
          setLocation("/dashboard");
        }
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      }
    };

    if (user) {
      checkOnboardingStatus();
    }
  }, [user, setLocation]);

  const handleStartSetup = async () => {
    setLoading(true);
    try {
      // First sync organizations from GitHub
      await apiService.syncOnboardingOrganizations();
      setLocation("/onboarding/repositories");
    } catch (error) {
      console.error("Failed to sync organizations:", error);
      // Continue to repositories page even if sync fails
      setLocation("/onboarding/repositories");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Github className="w-5 h-5 text-primary" />,
      title: "Repository Tracking",
      description: "Monitor your GitHub repositories and track development progress"
    },
    {
      icon: <Users className="w-5 h-5 text-primary" />,
      title: "Team Management", 
      description: "Manage team members, roles, and collaboration workflows"
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-primary" />,
      title: "Detailed Reports",
      description: "Generate comprehensive reports on code quality and team performance"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="onboarding-welcome">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to ReportFlow!</h1>
          <p className="text-xl text-muted-foreground">
            Hi {user?.name}! Let's set up your GitHub reporting workspace.
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-center">What you can do with ReportFlow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4" data-testid={`feature-${index}`}>
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            The setup process will take just a few minutes to get you started.
          </p>
          <Button 
            onClick={handleStartSetup}
            size="lg"
            className="px-8"
            disabled={loading}
            data-testid="button-start-setup"
          >
            {loading ? "Setting up..." : "Start Setup"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}