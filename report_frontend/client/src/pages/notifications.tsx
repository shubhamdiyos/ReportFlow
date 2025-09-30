import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle2, 
  Archive,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Shield,
  Settings,
  Clock,
  ExternalLink,
  MoreHorizontal
} from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";
import { Notification } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { toast } = useToast();
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | Notification["type"]>("all");

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

  const getNotificationBadge = (type: Notification["type"]) => {
    const colors = {
      success: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700",
      error: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700",
      security: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700",
      system: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700",
      info: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
    };
    
    return <Badge variant="outline" className={colors[type]}>{type}</Badge>;
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

  // Sort notifications by timestamp desc, then apply filters
  const sortedNotifications = [...notifications]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
  const filteredNotifications = sortedNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "read" && notification.isRead) ||
                         (filter === "unread" && !notification.isRead);
    const matchesType = typeFilter === "all" || notification.type === typeFilter;
    
    return matchesSearch && matchesFilter && matchesType;
  });

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map((n: Notification) => 
      n.id === id ? { ...n, isRead: true } : n
    );
    updateNotifications(updated);
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    });
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n: Notification) => ({ ...n, isRead: true }));
    updateNotifications(updated);
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications have been marked as read.`,
    });
  };

  const archiveNotification = (id: string) => {
    const updated = notifications.filter((n: Notification) => n.id !== id);
    updateNotifications(updated);
    toast({
      title: "Notification archived",
      description: "The notification has been archived and removed.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
      data-testid="notifications-page"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="w-8 h-8" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay updated with system alerts, reports, and activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:bg-blue-950">
              {unreadCount} unread
            </Badge>
          )}
          <Button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            data-testid="button-mark-all-read"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card data-testid="card-filters">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-notifications"
              />
            </div>
            
            {/* Read Status Filter */}
            <Select value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
              <SelectTrigger className="w-full sm:w-[140px]" data-testid="select-read-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
              <SelectTrigger className="w-full sm:w-[140px]" data-testid="select-type-filter">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card data-testid="empty-notifications">
            <CardContent className="py-12 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No notifications found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your search or filters." 
                  : "You're all caught up! New notifications will appear here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "transition-colors hover:bg-muted/50 cursor-pointer",
                !notification.isRead && "border-l-4 border-l-primary bg-primary/5"
              )}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
              data-testid={`notification-${notification.id}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={cn(
                            "font-medium",
                            !notification.isRead && "font-semibold"
                          )}>
                            {notification.title}
                          </h3>
                          {getNotificationBadge(notification.type)}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        
                        {notification.source && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>From: {notification.source.name}</span>
                            {notification.source.type && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{notification.source.type}</span>
                              </>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(notification.timestamp)}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Link href={notification.actionUrl}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              data-testid={`action-${notification.id}`}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {notification.actionText || "View"}
                            </Button>
                          </Link>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(notification.id);
                          }}
                          data-testid={`archive-${notification.id}`}
                        >
                          <Archive className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredNotifications.length > 0 && (
        <Card data-testid="card-summary">
          <CardContent className="p-4">
            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredNotifications.length} of {notifications.length} notifications
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}