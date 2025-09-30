import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import SidebarNav from "./sidebar-nav";
import TopNavbar from "./top-navbar";
import MobileNav from "./mobile-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { AnimatedPage } from "@/components/ui/animated-page";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, needsOnboarding } = useAuth();
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const motionPreferences = useMotionPreferences();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(location);

  // Track location changes for transition state
  useEffect(() => {
    if (location !== previousLocation) {
      setIsTransitioning(true);
      setPreviousLocation(location);
      
      // Reset transitioning state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, motionPreferences.reducedMotion ? 100 : 500);
      
      return () => clearTimeout(timer);
    }
  }, [location, previousLocation, motionPreferences.reducedMotion]);

  // Redirect non-onboarded users to onboarding when they try to access protected routes
  useEffect(() => {
    if (isAuthenticated && needsOnboarding && !location.startsWith("/onboarding")) {
      setLocation("/onboarding");
    }
  }, [isAuthenticated, needsOnboarding, location, setLocation]);

  // Don't show app shell on login page or onboarding pages
  if (!isAuthenticated || location === "/login" || location.startsWith("/onboarding")) {
    return <>{children}</>;
  }

  // Determine animation variant based on route
  const getAnimationVariant = (currentLocation: string, previousLoc: string) => {
    // Navigation flow patterns for different transition directions
    const routeOrder = [
      "/dashboard",
      "/teams", 
      "/developers",
      "/reports",
      "/repositories",
      "/billing",
      "/admin",
      "/settings"
    ];

    const currentIndex = routeOrder.indexOf(currentLocation);
    const previousIndex = routeOrder.indexOf(previousLoc);

    // Determine slide direction based on navigation
    if (currentIndex > previousIndex && currentIndex !== -1 && previousIndex !== -1) {
      return "slide-left";  // Moving forward in the flow
    } else if (currentIndex < previousIndex && currentIndex !== -1 && previousIndex !== -1) {
      return "slide-right"; // Moving backward in the flow
    }

    // Special cases for specific routes
    if (currentLocation.includes("/reports") || currentLocation.includes("/dashboard")) {
      return "fade-scale"; // Data-heavy pages get sophisticated transition
    }

    return "default"; // Default fade + scale + blur transition
  };

  const animationVariant = getAnimationVariant(location, previousLocation);

  return (
    <div className="flex h-screen bg-background">
      <SidebarNav />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        
        <main className={cn(
          "flex-1 overflow-auto relative",
          isMobile && "pb-20" // Add bottom padding on mobile for bottom nav
        )}>
          {/* Optional loading overlay during transitions */}
          {isTransitioning && !motionPreferences.reducedMotion && (
            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <LoadingSpinner 
                variant="dots" 
                size="md" 
                text="Loading..." 
                className="text-primary"
              />
            </div>
          )}
          
          <AnimatePresence mode="wait" initial={false}>
            <AnimatedPage
              key={location}
              variant={animationVariant}
              className="min-h-full"
              data-testid={`page-${location.replace('/', '')}`}
            >
              {children}
            </AnimatedPage>
          </AnimatePresence>
        </main>
        
        {isMobile && <MobileNav />}
      </div>
    </div>
  );
}
