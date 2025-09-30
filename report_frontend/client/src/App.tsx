import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { TenantProvider } from "@/hooks/use-tenant";
import AppShell from "@/components/layout/app-shell";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import InviteTeam from "@/pages/invite-team";
import Welcome from "@/pages/welcome";
import Dashboard from "@/pages/dashboard";
import Teams from "@/pages/teams";
import Developers from "@/pages/developers";
import Reports from "@/pages/reports";
import Repositories from "@/pages/repositories";
import Admin from "@/pages/admin";
import Settings from "@/pages/settings";
import Notifications from "@/pages/notifications";
import Billing from "@/pages/billing";
import NotFound from "@/pages/not-found";
import OnboardingWelcome from "@/pages/onboarding/welcome";
import OnboardingRepositories from "@/pages/onboarding/repositories";
import OnboardingTeam from "@/pages/onboarding/team";
import OnboardingComplete from "@/pages/onboarding/complete";
import Profile from "@/pages/profile";
import AuthCallback from "@/pages/auth-callback";

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/signup" component={Signup} />
      <Route path="/invite-team" component={InviteTeam} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/onboarding" component={OnboardingWelcome} />
      <Route path="/onboarding/repositories" component={OnboardingRepositories} />
      <Route path="/onboarding/team" component={OnboardingTeam} />
      <Route path="/onboarding/complete" component={OnboardingComplete} />
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/teams" component={Teams} />
      <Route path="/developers" component={Developers} />
      <Route path="/reports" component={Reports} />
      <Route path="/repositories" component={Repositories} />
      <Route path="/admin" component={Admin} />
      <Route path="/settings" component={Settings} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/billing" component={Billing} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TenantProvider>
            <TooltipProvider>
              <Toaster />
              <AppShell>
                <Router />
              </AppShell>
            </TooltipProvider>
          </TenantProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
