import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { useTheme } from "@/components/shared/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  Menu, 
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Clock,
  Building,
  Check,
  Loader2
} from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";
import { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function TopNavbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { 
    selectedTenant, 
    userOrganizations, 
    isLoading: isTenantLoading, 
    switchTenant, 
    isIndividualMode 
  } = useTenant();
  const [searchValue, setSearchValue] = useState("");
  // Load notifications from localStorage or use mock data
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });
  
  // Save to localStorage whenever notifications change
  const updateNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };
  
  const unreadNotifications = notifications.filter((n: Notification) => !n.isRead);
  // Sort by timestamp desc and take first 5
  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "security":
        return <AlertTriangle className="w-4 h-4 text-purple-500" />;
      case "system":
        return <Settings className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map((n: Notification) => 
      n.id === id ? { ...n, isRead: true } : n
    );
    updateNotifications(updated);
  };

  // Organization helper functions
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "manager":
        return "default";
      case "developer":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "manager":
        return "Manager";
      case "developer":
        return "Developer";
      default:
        return role;
    }
  };

  const getOrganizationInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const handleTenantSwitch = async (organizationId: string) => {
    try {
      await switchTenant(organizationId || null);
    } catch (error) {
      console.error('Failed to switch organization:', error);
      // Toast notifications are now handled in the useTenant hook
    }
  };

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-card px-4 sm:px-6" data-testid="top-navbar">
      {/* Mobile Menu Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden h-10 w-10 flex items-center justify-center flex-shrink-0"
        data-testid="button-mobile-menu"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search Bar - responsive sizing */}
      <div className="flex-1 max-w-sm sm:max-w-md lg:max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            type="text"
            placeholder={window.innerWidth < 640 ? "Search..." : "Search reports, developers, repos..."}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-4 h-10 text-sm w-full"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Organization Switcher - show simplified version on small screens */}
      <div className="flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 h-10 min-w-0 sm:min-w-[160px] justify-start px-3"
              disabled={isTenantLoading}
              data-testid="button-organization-switcher"
            >
              {isTenantLoading ? (
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              ) : (
                <>
                  {selectedTenant ? (
                    <>
                      <Avatar className="w-6 h-6 flex-shrink-0">
                        <AvatarImage src={selectedTenant.logo || undefined} />
                        <AvatarFallback className="text-xs bg-primary/10">
                          {getOrganizationInitials(selectedTenant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline truncate text-sm font-medium max-w-[100px] flex-1">
                        {selectedTenant.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="hidden sm:inline text-sm text-muted-foreground truncate flex-1">
                        {isIndividualMode ? "Individual" : "Personal"}
                      </span>
                    </>
                  )}
                </>
              )}
              <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-[280px]" 
            data-testid="dropdown-organization-switcher"
          >
            <DropdownMenuLabel>
              <div className="flex items-center justify-between">
                <span>Switch Organization</span>
                {userOrganizations.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {userOrganizations.length} available
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Individual/Personal Mode */}
            <DropdownMenuItem
              className={cn(
                "p-3 cursor-pointer",
                isIndividualMode && "bg-primary/5 border-l-2 border-l-primary",
                isTenantLoading && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isTenantLoading && handleTenantSwitch("")}
              disabled={isTenantLoading}
              data-testid="organization-item-individual"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium">Individual</h4>
                    {isIndividualMode && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Personal workspace
                  </p>
                </div>
              </div>
            </DropdownMenuItem>

            {/* Organizations List */}
            {userOrganizations.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {userOrganizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      className={cn(
                        "p-3 cursor-pointer",
                        selectedTenant?.id === org.id && "bg-primary/5 border-l-2 border-l-primary",
                        isTenantLoading && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => !isTenantLoading && handleTenantSwitch(org.id)}
                      disabled={isTenantLoading}
                      data-testid={`organization-item-${org.id}`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={org.logo || undefined} />
                            <AvatarFallback className="text-xs bg-primary/10">
                              {getOrganizationInitials(org.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium truncate">
                              {org.name}
                            </h4>
                            <Badge 
                              variant={getRoleBadgeVariant(org.role) as any}
                              className="text-xs flex-shrink-0"
                            >
                              {getRoleDisplayName(org.role)}
                            </Badge>
                            {selectedTenant?.id === org.id && (
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {org.domain || "No domain set"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {userOrganizations.length === 0 && !isIndividualMode && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Building className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p>No organizations available</p>
                <p className="text-xs mt-1">Contact your admin to join an organization</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          className="h-10 w-10 flex items-center justify-center"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-10 w-10 flex items-center justify-center"
              data-testid="button-notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center min-w-0"
                >
                  {unreadNotifications.length > 9 ? "9+" : unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80" data-testid="dropdown-notifications">
            <DropdownMenuLabel className="flex items-center justify-between py-3">
              <span>Notifications</span>
              {unreadNotifications.length > 0 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {unreadNotifications.length} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="max-h-[400px] overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  No notifications
                </div>
              ) : (
                recentNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "p-3 cursor-pointer",
                      !notification.isRead && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                    data-testid={`notification-item-${notification.id}`}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={cn(
                            "text-sm font-medium truncate flex-1",
                            !notification.isRead && "font-semibold"
                          )}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span>{formatRelativeTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
            
            {recentNotifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="w-full" data-testid="link-view-all-notifications">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                      <Bell className="w-4 h-4" />
                      View All Notifications
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 h-10 px-3"
              data-testid="button-profile-menu"
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={user?.avatar ?? undefined} />
                <AvatarFallback className="text-sm font-medium">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-3 py-2" data-testid="menu-profile">
              <User className="w-4 h-4 flex-shrink-0" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-3 py-2" data-testid="menu-settings">
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={logout}
              className="text-destructive focus:text-destructive flex items-center gap-3 py-2"
              data-testid="menu-logout"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
