import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/shared/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ArrowRight, 
  ArrowLeft, 
  User, 
  Users, 
  Mail, 
  Lock, 
  Building, 
  Globe, 
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  Shield,
  Check,
  X,
  Info,
  Moon,
  Sun,
  Sparkles,
  Eye,
  EyeOff,
  Camera,
  Briefcase,
  UserPlus
} from "lucide-react";
import { Link } from "wouter";
import { signupStep1Schema, signupStep2Schema, SignupStep1, SignupStep2 } from "@shared/schema";
import { cn } from "@/lib/utils";

type SignupStep = 1 | 2;
type SubmissionState = "idle" | "loading" | "success" | "error";

type PasswordStrength = {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
};

const industries = [
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "media", label: "Media & Entertainment" },
  { value: "other", label: "Other" }
];

const teamSizes = [
  { value: "1-10", label: "1-10 people" },
  { value: "11-50", label: "11-50 people" },
  { value: "51-200", label: "51-200 people" },
  { value: "201-1000", label: "201-1000 people" },
  { value: "1000+", label: "1000+ people" }
];

const getPasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(requirements).filter(Boolean).length;
  
  const strengthMap = {
    0: { label: "Very Weak", color: "text-red-500" },
    1: { label: "Very Weak", color: "text-red-500" },
    2: { label: "Weak", color: "text-orange-500" },
    3: { label: "Fair", color: "text-yellow-500" },
    4: { label: "Good", color: "text-blue-500" },
    5: { label: "Strong", color: "text-green-500" }
  };
  
  return {
    score,
    label: strengthMap[score as keyof typeof strengthMap].label,
    color: strengthMap[score as keyof typeof strengthMap].color,
    requirements
  };
};

export default function Signup() {
  const [currentStep, setCurrentStep] = useState<SignupStep>(1);
  const [step1Data, setStep1Data] = useState<SignupStep1 | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [error, setError] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Form for Step 1
  const step1Form = useForm<SignupStep1>({
    resolver: zodResolver(signupStep1Schema),
    mode: "onBlur", // Enable real-time validation
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      accountType: "individual"
    }
  });
  
  // Watch password field for strength calculation
  const watchedPassword = step1Form.watch("password");
  
  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength(getPasswordStrength(watchedPassword));
    } else {
      setPasswordStrength(null);
    }
  }, [watchedPassword]);

  // Form for Step 2 (Organization)
  const step2Form = useForm<SignupStep2>({
    resolver: zodResolver(signupStep2Schema),
    mode: "onBlur", // Enable real-time validation
    defaultValues: {
      organizationName: "",
      domain: "",
      logo: ""
    }
  });

  const handleStep1Submit = (data: SignupStep1) => {
    setStep1Data(data);
    if (data.accountType === "organization") {
      setCurrentStep(2);
    } else {
      // For individual accounts, proceed directly to submission
      handleFinalSubmission(data, null);
    }
  };

  const handleStep2Submit = (data: SignupStep2) => {
    if (step1Data) {
      handleFinalSubmission(step1Data, data);
    }
  };

  const handleFinalSubmission = async (step1: SignupStep1, step2: SignupStep2 | null) => {
    setSubmissionState("loading");
    setError("");

    try {
      // Mock API call - simulate account creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Deterministic success for enterprise-grade UX
      setSubmissionState("success");

      // Create user object based on signup data
      const newUser = {
        id: `user-${Date.now()}`,
        name: step1.name,
        username: step1.username,
        email: step1.email,
        avatar: null,
        role: "DEVELOPER" as const,
        githubId: null,
        isOnboarded: false, // New users need onboarding
        createdAt: new Date().toISOString()
      };

      toast({
        title: "Account created successfully!",
        description: "Welcome! Let's set up your workspace.",
      });

      // Log the user in and redirect to onboarding
      login(newUser);
    } catch (err) {
      setSubmissionState("error");
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Reset state after error
      setTimeout(() => {
        setSubmissionState("idle");
        setError("");
      }, 3000);
    }
  };

  const goBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const getProgressValue = () => {
    if (currentStep === 1) return 50;
    if (currentStep === 2) return 100;
    return 0;
  };

  const isLoading = submissionState === "loading";
  const isSuccess = submissionState === "success";

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

  const stepVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" data-testid="signup-page">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30">
        <motion.div
          className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-500/6 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -70, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/3 w-56 h-56 bg-blue-500/5 rounded-full blur-2xl"
          animate={{
            x: [0, -60, 0],
            y: [0, 40, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 18,
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

      {/* Back to Landing */}
      <motion.div
        className="absolute top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/">
          <Button variant="ghost" size="sm" className="bg-background/80 backdrop-blur-sm border border-border/50">
            ← Back to Home
          </Button>
        </Link>
      </motion.div>

      {/* Main Signup Card */}
      <motion.div
        className="relative z-10 w-full max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <Card className="border-0 shadow-2xl bg-card/40 backdrop-blur-xl ring-1 ring-white/20 dark:ring-white/10">
          <CardHeader className="text-center pb-6">
            <motion.div variants={itemVariants}>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold">Create Account</h2>
              <p className="mt-2 text-muted-foreground">
                Join thousands of developers using ReportFlow
              </p>
            </motion.div>

            {/* Step Progress */}
            <motion.div variants={itemVariants} className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {[1, 2].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                        currentStep >= step 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {currentStep > step ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step
                        )}
                      </div>
                      {step < 2 && (
                        <div className={cn(
                          "w-12 h-1 mx-2 rounded-full transition-all duration-300",
                          currentStep > step ? "bg-primary" : "bg-muted"
                        )} />
                      )}
                    </div>
                  ))}
                </div>
                <Badge variant="secondary" className="px-3 py-1" data-testid="step-indicator">
                  Step {currentStep} of {step1Data?.accountType === "organization" ? "2" : "1"}
                </Badge>
              </div>

              <Progress 
                value={getProgressValue()} 
                className="h-2" 
                data-testid="progress-bar"
              />
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <motion.div variants={itemVariants}>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <Alert variant="destructive" data-testid="signup-error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info + Account Type */}
                {currentStep === 1 && (
            <Form {...step1Form}>
              <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={step1Form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="John Doe" 
                              {...field}
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormDescription>
                            Your full name as it will appear on your profile
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step1Form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="johndoe" 
                              {...field}
                              data-testid="input-username"
                            />
                          </FormControl>
                          <FormDescription>
                            3-20 characters, letters, numbers, hyphens, underscores only
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={step1Form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="email"
                              placeholder="john@example.com" 
                              className="pl-10"
                              {...field}
                              data-testid="input-email"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          We'll use this email for important notifications about your account
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={step1Form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10"
                                {...field}
                                onFocus={() => setShowPasswordRequirements(true)}
                                onBlur={() => setShowPasswordRequirements(false)}
                                data-testid="input-password"
                              />
                            </div>
                          </FormControl>
                          
                          {/* Password Strength Indicator */}
                          {passwordStrength && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Password strength:</span>
                                <span className={passwordStrength.color}>{passwordStrength.label}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    passwordStrength.score <= 1 ? 'bg-red-500' :
                                    passwordStrength.score === 2 ? 'bg-orange-500' :
                                    passwordStrength.score === 3 ? 'bg-yellow-500' :
                                    passwordStrength.score === 4 ? 'bg-blue-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Password Requirements */}
                          {(showPasswordRequirements || passwordStrength) && (
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                {passwordStrength?.requirements.length ? 
                                  <Check className="w-3 h-3 text-green-500" /> : 
                                  <X className="w-3 h-3 text-muted-foreground" />
                                }
                                <span className={passwordStrength?.requirements.length ? 'text-green-500' : 'text-muted-foreground'}>
                                  At least 8 characters
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {passwordStrength?.requirements.uppercase ? 
                                  <Check className="w-3 h-3 text-green-500" /> : 
                                  <X className="w-3 h-3 text-muted-foreground" />
                                }
                                <span className={passwordStrength?.requirements.uppercase ? 'text-green-500' : 'text-muted-foreground'}>
                                  One uppercase letter
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {passwordStrength?.requirements.lowercase ? 
                                  <Check className="w-3 h-3 text-green-500" /> : 
                                  <X className="w-3 h-3 text-muted-foreground" />
                                }
                                <span className={passwordStrength?.requirements.lowercase ? 'text-green-500' : 'text-muted-foreground'}>
                                  One lowercase letter
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {passwordStrength?.requirements.number ? 
                                  <Check className="w-3 h-3 text-green-500" /> : 
                                  <X className="w-3 h-3 text-muted-foreground" />
                                }
                                <span className={passwordStrength?.requirements.number ? 'text-green-500' : 'text-muted-foreground'}>
                                  One number
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {passwordStrength?.requirements.special ? 
                                  <Check className="w-3 h-3 text-green-500" /> : 
                                  <X className="w-3 h-3 text-muted-foreground" />
                                }
                                <span className={passwordStrength?.requirements.special ? 'text-green-500' : 'text-muted-foreground'}>
                                  One special character
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={step1Form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="pl-10"
                                {...field}
                                data-testid="input-confirm-password"
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Re-enter your password to confirm
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Type</h3>
                  
                  <FormField
                    control={step1Form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            data-testid="radio-account-type"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <Label
                                htmlFor="individual"
                                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                                data-testid="label-individual"
                              >
                                <RadioGroupItem 
                                  value="individual" 
                                  id="individual" 
                                  className="sr-only"
                                  data-testid="radio-individual"
                                />
                                <User className="mb-2 h-6 w-6" />
                                <span className="font-semibold">Individual</span>
                                <span className="text-xs text-muted-foreground text-center">
                                  Personal account for individual developers
                                </span>
                              </Label>

                              <Label
                                htmlFor="organization"
                                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary"
                                data-testid="label-organization"
                              >
                                <RadioGroupItem 
                                  value="organization" 
                                  id="organization" 
                                  className="sr-only"
                                  data-testid="radio-organization"
                                />
                                <Users className="mb-2 h-6 w-6" />
                                <span className="font-semibold">Organization</span>
                                <span className="text-xs text-muted-foreground text-center">
                                  Team account with advanced features
                                </span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base"
                  disabled={isLoading}
                  data-testid="button-continue"
                >
                  {step1Form.watch("accountType") === "organization" ? (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Success! Redirecting...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: Organization Details */}
          {currentStep === 2 && (
            <Form {...step2Form}>
              <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Organization Details
                  </h3>

                  <FormField
                    control={step2Form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Acme Corp" 
                              className="pl-10"
                              {...field}
                              data-testid="input-org-name"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Your company or organization name as it will appear to team members
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Domain</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="company.com" 
                              className="pl-10"
                              {...field}
                              data-testid="input-domain"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Used for email domain verification and team invitations
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step2Form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Logo (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Upload className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com/logo.png" 
                              className="pl-10"
                              {...field}
                              data-testid="input-logo"
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Provide a URL to your company logo (PNG, JPG, or SVG format)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={goBack}
                    className="flex-1"
                    disabled={isLoading}
                    data-testid="button-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isLoading}
                    data-testid="button-create-account"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating Account...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Success! Redirecting...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" data-testid="link-login">
              <Button variant="link" className="p-0 h-auto font-normal">
                Sign in here
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-xs font-normal" data-testid="link-terms">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-xs font-normal" data-testid="link-privacy">
              Privacy Policy
            </Button>
          </div>
              </AnimatePresence>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}