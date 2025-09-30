import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { motionVariants } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  FileText, 
  GitBranch,
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Developers", href: "/developers", icon: UserCheck },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Settings", href: "/settings", icon: Settings }
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-2 md:hidden z-50 pb-safe" data-testid="mobile-nav">
      <div className="flex items-center justify-around max-w-md mx-auto px-2">
        {mobileNavItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 h-auto py-3 px-1 min-w-0 w-full min-h-[56px] rounded-lg transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10 font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                data-testid={`mobile-nav-${item.href.replace('/', '')}`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-xs leading-tight font-medium truncate">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
