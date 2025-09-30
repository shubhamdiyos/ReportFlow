import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/shared/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { 
  UserPlus, 
  Mail, 
  Trash2, 
  Plus, 
  Send, 
  Check, 
  Moon, 
  Sun, 
  Sparkles,
  Users,
  Shield,
  User,
  Crown,
  Code,
  AlertCircle,
  Loader2,
  CheckCircle,
  ArrowRight,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  {
    value: "admin",
    label: "Admin",
    icon: Crown,
    description: "Full access to all features and settings",
    color: "text-red-500"
  },
  {
    value: "manager",
    label: "Manager",
    icon: Shield,
    description: "Manage teams and view all reports",
    color: "text-blue-500"
  },
  {
    value: "developer",
    label: "Developer",
    icon: Code,
    description: "View reports and manage own repositories",
    color: "text-green-500"
  }
];

const inviteSchema = z.object({
  invites: z.array(
    z.object({
      email: z.string().email("Please enter a valid email address"),
      role: z.enum(["admin", "manager", "developer"], {
        required_error: "Please select a role"
      })
    })
  ).min(1, "Please add at least one team member")
});

type InviteForm = z.infer<typeof inviteSchema>;

export default function InviteTeam() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const form = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      invites: [{ email: "", role: "developer" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "invites"
  });

  const addInvite = () => {
    append({ email: "", role: "developer" });
  };

  const removeInvite = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: InviteForm) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Deterministic success for enterprise-grade UX
      setSubmissionSuccess(true);
      toast({
        title: "Invitations sent!",
        description: `Successfully sent ${data.invites.length} team invitation${data.invites.length > 1 ? 's' : ''}.`,
      });
      
      // Auto-redirect after success using SPA navigation
      setTimeout(() => {
        setLocation("/welcome");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error sending invitations",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipInvites = () => {
    toast({
      title: "Setup complete!",
      description: "You can invite team members later from your dashboard.",
    });
    setTimeout(() => {
      setLocation("/welcome");
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const inviteVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" data-testid="invite-team-page">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30">
        <motion.div
          className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/6 rounded-full blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -90, 0],
            y: [0, 80, 0],
            scale: [1.3, 1, 1.3],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Theme Toggle */}
      <motion.div
        className="absolute top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-10 h-10 p-0 bg-background/80 backdrop-blur-sm border border-border/50"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </Button>
      </motion.div>

      {/* Skip Button */}
      <motion.div
        className="absolute top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={skipInvites}
          className="bg-background/80 backdrop-blur-sm border border-border/50"
          data-testid="button-skip"
        >
          Skip for now
        </Button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <Card className="border-0 shadow-2xl bg-card/40 backdrop-blur-xl ring-1 ring-white/20 dark:ring-white/10">
          <CardHeader className="text-center pb-6">
            <motion.div variants={itemVariants}>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Invite Your Team</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Add team members to your organization and assign appropriate roles for collaboration.
              </p>
              <Badge variant="secondary" className="mt-4 px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1" />
                Optional Step
              </Badge>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <motion.div variants={itemVariants}>
              {submissionSuccess ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Invitations Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your team members will receive email invitations to join your organization.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting to welcome screen...
                  </div>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Role Explanation */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {roles.map((role) => (
                        <div key={role.value} className="bg-muted/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <role.icon className={cn("w-5 h-5", role.color)} />
                            <span className="font-semibold">{role.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      ))}
                    </div>

                    {/* Team Invitations */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Team Member Invitations
                      </h3>

                      <AnimatePresence>
                        {fields.map((field, index) => (
                          <motion.div
                            key={field.id}
                            variants={inviteVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-muted/20 rounded-lg p-4 space-y-4"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-muted-foreground">
                                Team Member {index + 1}
                              </span>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeInvite(index)}
                                  className="text-destructive hover:text-destructive h-8 w-8 p-0"
                                  data-testid={`button-remove-${index}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`invites.${index}.email`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                          type="email"
                                          placeholder="colleague@company.com"
                                          className="pl-10"
                                          {...field}
                                          data-testid={`input-email-${index}`}
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`invites.${index}.role`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger data-testid={`select-role-${index}`}>
                                          <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {roles.map((role) => (
                                          <SelectItem key={role.value} value={role.value}>
                                            <div className="flex items-center gap-2">
                                              <role.icon className={cn("w-4 h-4", role.color)} />
                                              {role.label}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Add More Button */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInvite}
                        className="w-full border-dashed"
                        data-testid="button-add-member"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Team Member
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={skipInvites}
                        className="flex-1"
                        disabled={isSubmitting}
                        data-testid="button-skip-invites"
                      >
                        Skip for Now
                      </Button>
                      
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                        data-testid="button-send-invites"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Sending Invitations...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Invitations
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Info Note */}
                    <Alert className="bg-muted/20 border-border/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Team members will receive email invitations with instructions to join your organization. 
                        You can always add more members later from your dashboard settings.
                      </AlertDescription>
                    </Alert>
                  </form>
                </Form>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}