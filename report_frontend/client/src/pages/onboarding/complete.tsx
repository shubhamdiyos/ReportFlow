import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { CheckCircle, Loader2, Rocket, BarChart3, Github, Users } from "lucide-react";

export default function OnboardingComplete() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isCompleting, setIsCompleting] = useState(false);

  const completeOnboarding = async () => {
    setIsCompleting(true);
    
    try {
      // Simulate onboarding completion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark user as onboarded
      updateUser({ isOnboarded: true });
      
      toast({
        title: "Setup complete!",
        description: "Welcome to ReportFlow. Your workspace is ready.",
      });
      
      // Navigate to dashboard
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "There was an error completing your setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const achievements = [
    {
      icon: <Github className="w-5 h-5 text-green-500" />,
      title: "Repositories Connected",
      description: "Your GitHub repositories are now being tracked"
    },
    {
      icon: <Users className="w-5 h-5 text-green-500" />,
      title: "Team Configured",
      description: "Reporting preferences have been set up"
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-green-500" />,
      title: "Reports Ready",
      description: "Your first reports will be generated soon"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="onboarding-complete">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-6">
            <Rocket className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">You're All Set!</h1>
          <p className="text-xl text-muted-foreground">
            Welcome aboard, {user?.name}! Your ReportFlow workspace is ready.
          </p>
        </div>

        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Setup Complete</h2>
              <p className="text-muted-foreground">
                Everything has been configured and you're ready to start tracking your development progress.
              </p>
            </div>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-4" data-testid={`achievement-${index}`}>
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{achievement.title}</h3>
                    <p className="text-muted-foreground text-sm">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={completeOnboarding}
            disabled={isCompleting}
            size="lg"
            className="px-8"
            data-testid="button-complete-setup"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finalizing Setup...
              </>
            ) : (
              <>
                Go to Dashboard
                <Rocket className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}