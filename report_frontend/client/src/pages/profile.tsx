import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/hooks/use-tenant";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, 
  Mail, 
  Calendar, 
  Users, 
  Settings, 
  Github, 
  Upload, 
  Save, 
  Shield, 
  Bell, 
  Eye, 
  LogOut,
  Activity,
  GitCommit,
  GitPullRequest,
  Code,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck,
  Clock,
  Edit3,
  Camera,
  Link as LinkIcon
} from "lucide-react";

// Validation schemas
const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, and underscores"),
  email: z.string().email("Please enter a valid email address"),
});

const settingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  weeklyDigest: z.boolean(),
  profileVisibility: z.enum(["public", "private", "organization"]),
  twoFactorAuth: z.boolean(),
});

type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
type SettingsForm = z.infer<typeof settingsSchema>;

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { userOrganizations, switchTenant } = useTenant();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [orgToLeave, setOrgToLeave] = useState<string | null>(null);

  // Personal information form
  const personalForm = useForm<PersonalInfoForm>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  // Settings form
  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
      profileVisibility: "organization",
      twoFactorAuth: false,
    },
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('profileSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        settingsForm.reset(parsed);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, [settingsForm]);

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File Too Large",
        description: "Please choose an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please choose an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const reader = new FileReader();
      reader.onload = (e) => {
        const avatarUrl = e.target?.result as string;
        updateUser({ avatar: avatarUrl });
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePersonalInfoSubmit = async (data: PersonalInfoForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateUser({
        name: data.name,
        username: data.username,
        email: data.email,
      });

      setIsEditingPersonal(false);
      toast({
        title: "Profile Updated",
        description: "Your personal information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsSubmit = async (data: SettingsForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('profileSettings', JSON.stringify(data));

      toast({
        title: "Settings Saved",
        description: "Your account settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveOrganization = async (orgId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Left Organization",
        description: "You have successfully left the organization.",
      });
    } catch (error) {
      toast({
        title: "Leave Failed",
        description: "Failed to leave organization. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setOrgToLeave(null);
    }
  };

  const connectGithub = async () => {
    setIsLoading(true);
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateUser({ githubId: "github123" });
      toast({
        title: "GitHub Connected",
        description: "Your GitHub account has been connected successfully.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect GitHub account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock activity data
  const activityStats = {
    commits: 142,
    pullRequests: 28,
    codeReviews: 45,
    linesOfCode: "12.5k"
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "manager": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Crown;
      case "manager": return UserCheck;
      default: return User;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-muted-foreground">Not authenticated</h2>
          <p className="text-sm text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6 max-w-4xl mx-auto"
      data-testid="profile-page"
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3 leading-tight">
            <User className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
            <span>My Profile</span>
          </h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card data-testid="card-personal-info">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 flex-shrink-0" />
                <span>Personal Information</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                className="h-9 px-3 flex items-center justify-center gap-2 flex-shrink-0"
                data-testid="button-edit-personal"
              >
                <Edit3 className="w-4 h-4" />
                <span>{isEditingPersonal ? "Cancel" : "Edit"}</span>
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-24 h-24" data-testid="img-avatar">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="text-2xl">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0 flex items-center justify-center"
                    onClick={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    data-testid="button-upload-avatar"
                  >
                    <Camera className="w-3 h-3" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    data-testid="input-avatar-file"
                  />
                </div>
                <div className="space-y-2 min-w-0 flex-1">
                  <h3 className="font-semibold text-lg leading-tight" data-testid="text-user-name">
                    {user.name}
                  </h3>
                  <p className="text-muted-foreground" data-testid="text-user-username">
                    @{user.username}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span data-testid="text-join-date">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Info Form */}
              <Form {...personalForm}>
                <form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={personalForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditingPersonal}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={personalForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditingPersonal}
                              data-testid="input-username"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={personalForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            disabled={!isEditingPersonal}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isEditingPersonal && (
                    <div className="flex gap-3 pt-6">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-10 px-4 flex items-center justify-center gap-2"
                        data-testid="button-save-personal"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                      </Button>
                    </div>
                  )}
                </form>
              </Form>

              {/* GitHub Connection */}
              <Separator />
              <div className="space-y-3">
                <Label className="text-sm font-medium">GitHub Connection</Label>
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Github className="w-5 h-5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium leading-tight">
                        {user.githubId ? "Connected" : "Not Connected"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {user.githubId 
                          ? "GitHub account is connected for repository access"
                          : "Connect your GitHub account to access repositories"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {user.githubId ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" data-testid="icon-github-connected" />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 flex items-center justify-center"
                          data-testid="button-disconnect-github"
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={connectGithub}
                        disabled={isLoading}
                        className="h-9 px-3 flex items-center justify-center gap-2"
                        data-testid="button-connect-github"
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span>Connect GitHub</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Onboarding Status */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Account Status</Label>
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  {user.isOnboarded ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium" data-testid="text-onboarding-status">
                      {user.isOnboarded ? "Setup Complete" : "Setup Incomplete"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.isOnboarded 
                        ? "Your account is fully set up and ready to use"
                        : "Complete the onboarding process to unlock all features"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Memberships Section */}
          <Card data-testid="card-organizations">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Organization Memberships
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!userOrganizations || userOrganizations.length === 0 ? (
                <div className="text-center py-8" data-testid="empty-organizations">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-muted-foreground mb-2">No Organizations</h3>
                  <p className="text-sm text-muted-foreground">
                    You're not a member of any organizations yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrganizations.map((org) => {
                    const RoleIcon = getRoleIcon(org.role);
                    return (
                      <div
                        key={org.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                        data-testid={`org-membership-${org.id}`}
                      >
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage src={org.logo || undefined} />
                            <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium leading-tight" data-testid={`text-org-name-${org.id}`}>
                                {org.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getRoleBadgeColor(org.role)}
                                  data-testid={`badge-role-${org.id}`}
                                >
                                  <RoleIcon className="w-3 h-3 mr-1" />
                                  {org.role}
                                </Badge>
                                <Badge
                                  variant={org.isActive ? "default" : "secondary"}
                                  data-testid={`badge-status-${org.id}`}
                                >
                                  {org.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Joined {new Date(org.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 flex items-center justify-center gap-2 flex-shrink-0"
                              data-testid={`button-leave-${org.id}`}
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Leave</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent data-testid={`dialog-leave-${org.id}`}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Leave Organization</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to leave <strong>{org.name}</strong>? 
                                You will lose access to all organization resources and need to be re-invited to rejoin.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel data-testid={`button-cancel-leave-${org.id}`}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleLeaveOrganization(org.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                data-testid={`button-confirm-leave-${org.id}`}
                              >
                                Leave Organization
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Settings and Activity */}
        <div className="space-y-6">
          {/* Account Settings */}
          <Card data-testid="card-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(handleSettingsSubmit)} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        <Bell className="w-4 h-4 inline mr-2" />
                        Notifications
                      </Label>
                      <div className="space-y-3 ml-6">
                        <FormField
                          control={settingsForm.control}
                          name="emailNotifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                              <FormLabel className="text-sm">Email Notifications</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-email-notifications"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="pushNotifications"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                              <FormLabel className="text-sm">Push Notifications</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-push-notifications"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="weeklyDigest"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                              <FormLabel className="text-sm">Weekly Digest</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-weekly-digest"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        <Eye className="w-4 h-4 inline mr-2" />
                        Privacy
                      </Label>
                      <div className="ml-6">
                        <FormField
                          control={settingsForm.control}
                          name="profileVisibility"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">Profile Visibility</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-profile-visibility">
                                    <SelectValue placeholder="Select visibility" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="public">Public</SelectItem>
                                  <SelectItem value="organization">Organization Only</SelectItem>
                                  <SelectItem value="private">Private</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Security
                      </Label>
                      <div className="ml-6">
                        <FormField
                          control={settingsForm.control}
                          name="twoFactorAuth"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between space-y-0">
                              <div className="space-y-1">
                                <FormLabel className="text-sm">Two-Factor Authentication</FormLabel>
                                <p className="text-xs text-muted-foreground">
                                  Add an extra layer of security to your account
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  data-testid="switch-two-factor"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-10 flex items-center justify-center gap-2" 
                    disabled={isLoading}
                    data-testid="button-save-settings"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isLoading ? "Saving..." : "Save Settings"}</span>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card data-testid="card-activity">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <GitCommit className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold" data-testid="stat-commits">
                    {activityStats.commits}
                  </div>
                  <div className="text-xs text-muted-foreground">Commits</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <GitPullRequest className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold" data-testid="stat-prs">
                    {activityStats.pullRequests}
                  </div>
                  <div className="text-xs text-muted-foreground">Pull Requests</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <UserCheck className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold" data-testid="stat-reviews">
                    {activityStats.codeReviews}
                  </div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
                
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Code className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold" data-testid="stat-lines">
                    {activityStats.linesOfCode}
                  </div>
                  <div className="text-xs text-muted-foreground">Lines of Code</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>This Month's Activity</span>
                  <span className="text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" data-testid="progress-activity" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}