import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { getUserPermissions } from "@/lib/role-utils";
import { 
  Activity, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Github,
  UserPlus,
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar
} from "lucide-react";
import { mockAdminStatus, mockManagementUsers } from "@/lib/mock-data";
import { ManagementUser } from "@/lib/types";
import { cn } from "@/lib/utils";

const failedJobs = [
  { id: 1, name: "mobile-app sync", time: "2 hours ago" },
  { id: 2, name: "webhook processing", time: "5 hours ago" },
];

export default function Admin() {
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const userRole = user?.role || "developer";
  const permissions = getUserPermissions(userRole);
  const [users, setUsers] = useState(mockManagementUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [inviteRole, setInviteRole] = useState<"developer" | "manager" | "admin">("developer");
  const [selectedUser, setSelectedUser] = useState<ManagementUser | null>(null);
  const [actionType, setActionType] = useState<"deactivate" | "role" | "resend" | null>(null);
  const [newRole, setNewRole] = useState<"developer" | "manager" | "admin">("developer");
  const [isLoading, setIsLoading] = useState(false);

  // Check if current user can perform admin actions
  const canManageUsers = permissions.canManageUsers;
  const canPromoteToAdmin = user?.role === "admin";

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setInviteEmail(email);
    if (email && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !isValidEmail(inviteEmail)) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: ManagementUser = {
        id: String(users.length + 1),
        name: inviteEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: inviteEmail,
        username: inviteEmail.split('@')[0],
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
        role: inviteRole,
        status: "pending",
        joinedOn: new Date().toISOString().split('T')[0],
        lastActive: "Never",
        invitedBy: user?.name || "Admin"
      };
      
      setUsers(prev => [...prev, newUser]);
      setInviteEmail("");
      setEmailError("");
      setInviteRole("developer");
      setShowInviteModal(false);
      
      toast({
        title: "User Invited",
        description: `Invitation sent to ${inviteEmail} with ${inviteRole} role.`,
      });
    } catch (error) {
      toast({
        title: "Invitation Failed",
        description: "There was an error sending the invitation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async () => {
    if (!selectedUser || !actionType) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (actionType === "deactivate") {
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id 
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u
        ));
        toast({
          title: selectedUser.status === "active" ? "User Deactivated" : "User Activated",
          description: `${selectedUser.name} has been ${selectedUser.status === "active" ? "deactivated" : "activated"}.`,
        });
      } else if (actionType === "role" && newRole) {
        setUsers(prev => prev.map(u => 
          u.id === selectedUser.id ? { ...u, role: newRole } : u
        ));
        toast({
          title: "Role Updated",
          description: `${selectedUser.name}'s role has been changed to ${newRole}.`,
        });
      } else if (actionType === "resend") {
        toast({
          title: "Invitation Resent",
          description: `Invitation has been resent to ${selectedUser.name}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error performing this action.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const getStatusBadge = (status: ManagementUser['status']) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-600 dark:bg-green-950">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 dark:text-red-400 dark:border-red-600 dark:bg-red-950">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-600 dark:bg-yellow-950">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: ManagementUser['role']) => {
    const colors = {
      admin: "bg-purple-500 text-white",
      manager: "bg-blue-500 text-white", 
      developer: "bg-gray-500 text-white"
    };
    return (
      <Badge className={colors[role]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6"
      data-testid="admin-page"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">Admin Console</h1>
          <p className="text-muted-foreground mt-2">System status and configuration</p>
        </div>
        <Button 
          className="h-10 px-4 flex items-center justify-center gap-2 w-full sm:w-auto" 
          data-testid="button-view-logs"
        >
          <Activity className="w-4 h-4" />
          <span>View Logs</span>
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="card-github-status">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">GitHub App</p>
                <p className="text-lg font-semibold text-green-600">Connected</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-api-usage">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">API Usage</p>
                <p className="text-lg font-semibold text-foreground">
                  {mockAdminStatus.apiUsage.current} / {mockAdminStatus.apiUsage.limit}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-failed-jobs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed Jobs</p>
                <p className="text-lg font-semibold text-red-600">
                  {mockAdminStatus.failedJobs}
                </p>
              </div>
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-ai-tokens">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Tokens</p>
                <p className="text-lg font-semibold text-foreground">
                  ${mockAdminStatus.aiTokenCost}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GitHub App Status */}
        <Card data-testid="card-github-integration">
          <CardHeader>
            <CardTitle>GitHub Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                <span className="text-sm font-medium">App Installation</span>
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 flex-shrink-0">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                <span className="text-sm font-medium">Webhook</span>
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800 flex-shrink-0">Listening</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
                <span className="text-sm font-medium">Rate Limit</span>
              </div>
              <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800 flex-shrink-0">
                {mockAdminStatus.apiUsage.current} / {mockAdminStatus.apiUsage.limit}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Failed Jobs */}
        <Card data-testid="card-failed-jobs-detail">
          <CardHeader>
            <CardTitle>Failed Sync Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {failedJobs.map((job) => (
              <div 
                key={job.id} 
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                data-testid={`failed-job-${job.id}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground leading-tight">{job.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{job.time}</p>
                </div>
                <Button 
                  size="sm" 
                  className="h-8 px-3 flex items-center justify-center flex-shrink-0" 
                  data-testid={`button-retry-job-${job.id}`}
                >
                  Retry
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* User Management Section */}
      <Card data-testid="card-user-management">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                User Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage user access, roles, and permissions
              </p>
            </div>
            {canManageUsers && (
              <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
                <DialogTrigger asChild>
                  <Button 
                    className="h-10 px-4 flex items-center justify-center gap-2" 
                    data-testid="button-invite-user"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite User</span>
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-invite-user">
                  <DialogHeader>
                    <DialogTitle>Invite New User</DialogTitle>
                    <DialogDescription>
                      Send an invitation to join your organization with a specific role.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="invite-email" className="text-sm font-medium">Email Address</Label>
                      <Input
                        id="invite-email"
                        type="email"
                        placeholder="user@company.com"
                        value={inviteEmail}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        className={cn(
                          "h-10",
                          emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                        )}
                        data-testid="input-invite-email"
                      />
                      {emailError && (
                        <p className="text-sm text-red-600 mt-1" data-testid="error-invite-email">
                          {emailError}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="invite-role" className="text-sm font-medium">Role</Label>
                      <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as typeof inviteRole)}>
                        <SelectTrigger className="h-10" data-testid="select-invite-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="developer">Developer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          {canPromoteToAdmin && (
                            <SelectItem value="admin">Admin</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {!canPromoteToAdmin && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Only admins can invite other admins
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowInviteModal(false)}
                      className="h-10 px-4 flex items-center justify-center"
                      data-testid="button-cancel-invite"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleInviteUser}
                      disabled={!inviteEmail.trim() || !isValidEmail(inviteEmail) || isLoading}
                      className="h-10 px-4 flex items-center justify-center"
                      data-testid="button-send-invite"
                    >
                      {isLoading ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card Layout */}
          {isMobile ? (
            <div className="space-y-3 p-4">
              {users.map((user) => (
                <Card key={user.id} className="p-4" data-testid={`user-card-${user.id}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                        </div>
                      </div>
                      {canManageUsers && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              aria-label={`Actions for ${user.name}`}
                              data-testid={`button-user-actions-${user.id}`}
                            >
                              <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType("role");
                                setNewRole(user.role);
                              }}
                              data-testid={`action-change-role-${user.id}`}
                            >
                              <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user);
                                setActionType("deactivate");
                              }}
                              data-testid={`action-toggle-status-${user.id}`}
                            >
                              {user.status === "active" ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" aria-hidden="true" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" aria-hidden="true" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            {user.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setActionType("resend");
                                  }}
                                  data-testid={`action-resend-invite-${user.id}`}
                                >
                                  <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                                  Resend Invite
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Role:</span>
                        <div className="mt-1">{getRoleBadge(user.role)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <div className="mt-1">{getStatusBadge(user.status)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Joined:</span>
                        <p className="font-medium">{new Date(user.joinedOn).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    {user.lastActive !== "Never" && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Last Active:</span>
                        <p className="font-medium">{user.lastActive}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Desktop Table Layout */
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">User</TableHead>
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[100px]">Role</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Joined</TableHead>
                    <TableHead className="min-w-[120px]">Last Active</TableHead>
                    {canManageUsers && <TableHead className="text-right min-w-[100px]">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>{new Date(user.joinedOn).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                      {canManageUsers && (
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                aria-label={`Actions for ${user.name}`}
                                data-testid={`button-user-actions-${user.id}`}
                              >
                                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionType("role");
                                  setNewRole(user.role);
                                }}
                                data-testid={`action-change-role-${user.id}`}
                              >
                                <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setSelectedUser(user);
                                  setActionType("deactivate");
                                }}
                                data-testid={`action-toggle-status-${user.id}`}
                              >
                                {user.status === "active" ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" aria-hidden="true" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" aria-hidden="true" />
                                  Activate
                                </>
                              )}
                              </DropdownMenuItem>
                              {user.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setActionType("resend");
                                    }}
                                    data-testid={`action-resend-invite-${user.id}`}
                                  >
                                    <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                                    Resend Invite
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!canManageUsers && (
            <div className="p-4 text-center text-sm text-muted-foreground border-t">
              <Shield className="w-4 h-4 mx-auto mb-2" />
              Only administrators can manage users
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialogs */}
      <AlertDialog open={!!selectedUser && !!actionType} onOpenChange={(open) => !open && (setSelectedUser(null), setActionType(null))}>
        <AlertDialogContent data-testid="dialog-user-action">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "deactivate" && selectedUser?.status === "active" && "Deactivate User"}
              {actionType === "deactivate" && selectedUser?.status !== "active" && "Activate User"}
              {actionType === "role" && "Change User Role"}
              {actionType === "resend" && "Resend Invitation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "deactivate" && selectedUser?.status === "active" && 
                `Are you sure you want to deactivate ${selectedUser?.name}? They will lose access to the platform.`}
              {actionType === "deactivate" && selectedUser?.status !== "active" && 
                `Are you sure you want to activate ${selectedUser?.name}? They will regain access to the platform.`}
              {actionType === "role" && (
                <div className="space-y-3">
                  <p>Change the role for {selectedUser?.name}:</p>
                  <Select value={newRole} onValueChange={(value) => setNewRole(value as typeof newRole)}>
                    <SelectTrigger data-testid="select-new-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      {canPromoteToAdmin && (
                        <SelectItem value="admin">Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {!canPromoteToAdmin && newRole === "admin" && (
                    <p className="text-xs text-muted-foreground">
                      Only admins can promote users to admin role
                    </p>
                  )}
                </div>
              )}
              {actionType === "resend" && 
                `Resend the invitation email to ${selectedUser?.name}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-action">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUserAction}
              disabled={isLoading}
              data-testid="button-confirm-action"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
