import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { getUserPermissions, canAccessRoute } from "@/lib/role-utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motionVariants } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  GitBranch, 
  Calendar, 
  Settings, 
  Cog,
  Github,
  PanelLeft,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import WelcomeMessage from "@/components/shared/welcome-message";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
  permission?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Developers", href: "/developers", icon: UserCheck },
  { label: "Reports", href: "/reports", icon: FileText, badge: "3" },
  { label: "Repositories", href: "/repositories", icon: GitBranch, roles: ["admin", "manager"] },
  { label: "Scheduling", href: "/scheduling", icon: Calendar },
  { label: "Billing", href: "/billing", icon: CreditCard, roles: ["admin"] },
  { label: "Admin", href: "/admin", icon: Settings, roles: ["admin"] },
  { label: "Settings", href: "/settings", icon: Cog, roles: ["admin"] }
];

export default function SidebarNav() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  
  // Hide sidebar completely on mobile devices
  if (isMobile) {
    return null;
  }

  const userRole = user?.role || "developer";
  const permissions = getUserPermissions(userRole);
  
  const filteredNavItems = navItems.filter(item => {
    // Check role-based access
    if (item.roles && !item.roles.includes(userRole)) {
      return false;
    }
    // Check route-based access
    return canAccessRoute(userRole, item.href);
  });

  return (
    <aside 
      className={cn(
        "flex-shrink-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
      data-testid="sidebar-nav"
    >
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border transition-all duration-300",
          collapsed ? "justify-center px-4" : "gap-3 px-6"
        )}>
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Github className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground truncate">ReportFlow</span>
          )}
        </div>

        {/* Toggle Button */}
        <div className={cn("p-4", collapsed && "px-2")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "w-full transition-all duration-200 h-9",
              collapsed ? "justify-center px-2" : "justify-start gap-2 px-3"
            )}
            data-testid="button-sidebar-toggle"
          >
            <PanelLeft className={cn(
              "transition-transform duration-200",
              collapsed ? "w-5 h-5 rotate-180" : "w-4 h-4"
            )} />
            {!collapsed && <span>Collapse</span>}
          </Button>
        </div>

        {/* Contextual Welcome Message in Sidebar */}
        {!collapsed && (
          <div className="px-4 pb-4">
            <WelcomeMessage
              variant="sidebar"
              showTips={false}
              showAchievement={true}
              showMotivation={false}
              className="text-xs"
            />
          </div>
        )}

        {/* Navigation Items */}
        <nav className={cn(
          "flex-1 space-y-1 transition-all duration-300",
          collapsed ? "p-2" : "p-4"
        )}>
          {filteredNavItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full text-sm font-medium transition-all duration-200 h-10",
                    collapsed ? "justify-center px-2" : "justify-start gap-3 px-3",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  data-testid={`link-${item.href.replace('/', '')}`}
                >
                  <Icon className={cn(
                    "flex-shrink-0 transition-all duration-200",
                    collapsed ? "w-5 h-5" : "w-4 h-4"
                  )} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-1 bg-sidebar-primary/10 text-sidebar-primary flex-shrink-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={cn(
          "border-t border-sidebar-border transition-all duration-300",
          collapsed ? "p-2" : "p-4"
        )}>
          <div className={cn(
            "flex items-center transition-all duration-200",
            collapsed ? "justify-center" : "gap-3"
          )}>
            <Avatar className={cn(
              "flex-shrink-0 transition-all duration-200",
              collapsed ? "w-8 h-8" : "w-10 h-10"
            )}>
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className="text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate mt-1">
                  {user?.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
