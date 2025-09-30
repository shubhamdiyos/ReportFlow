import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, useMotionTemplate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/shared/theme-provider";
import { 
  ArrowRight, 
  Github, 
  BarChart3, 
  Users, 
  GitPullRequest, 
  Star,
  CheckCircle,
  Moon,
  Sun,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Clock,
  Activity,
  Globe,
  FileCheck,
  Eye,
  UserCheck,
  Timer,
  Database,
  Server
} from "lucide-react";
import { 
  SiGoogle, 
  SiApple, 
  SiAmazon, 
  SiGithub, 
  SiSlack, 
  SiSpotify, 
  SiNetflix, 
  SiUber,
  SiStripe,
  SiZoom,
  SiMeta,
  SiAdobe,
  SiFigma,
  SiNotion,
  SiTesla,
  SiSalesforce,
  SiDropbox,
  SiAtlassian,
  SiCanva,
  SiLinkedin,
  SiDiscord,
  SiTrello
} from "react-icons/si";
import { cn, motionVariants, createAdvancedStagger } from "@/lib/utils";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";

// Animated counter hook for smooth counting animations
const useAnimatedCounter = (endValue: number, duration: number = 2000, startAnimation: boolean = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const easedProgress = easeOutCubic(progress);

    // Preserve decimal places for accurate final values
    const currentCount = Math.round(easedProgress * endValue * 10) / 10;
    
    if (currentCount !== countRef.current) {
      countRef.current = currentCount;
      setCount(currentCount);
    }

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [endValue, duration]);

  useEffect(() => {
    if (startAnimation && endValue > 0) {
      startTimeRef.current = undefined;
      countRef.current = 0;
      setCount(0);
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [startAnimation, animate, endValue]);

  return count;
};

// Enhanced animated counter component
const AnimatedCounter = ({ 
  value, 
  prefix = "", 
  suffix = "", 
  startAnimation = false,
  className = "",
  duration = 2000
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  startAnimation?: boolean;
  className?: string;
  duration?: number;
}) => {
  const animatedValue = useAnimatedCounter(value, duration, startAnimation);
  
  const formatValue = (val: number) => {
    if (suffix === "K") {
      // Scale down by 1000 for K suffix (e.g., 50000 -> 50K)
      const scaledValue = Math.round(val / 1000);
      return `${prefix}${scaledValue}${suffix}`;
    }
    if (suffix === "x") {
      // Convert to multiplier (e.g., 300 -> 3x)
      const multiplier = Math.round(val / 100 * 10) / 10;
      return `${multiplier}${suffix}`;
    }
    if (suffix === "h") {
      return `${Math.round(val)}${suffix}`;
    }
    if (suffix === "%") {
      // Preserve decimal places for percentages
      return `${val.toFixed(1).replace(/\.0$/, '')}${suffix}`;
    }
    if (suffix === "/7") {
      return `${Math.round(val)}${suffix}`;
    }
    if (suffix === "+") {
      return `${Math.round(val)}${suffix}`;
    }
    return `${prefix}${Math.round(val)}${suffix}`;
  };

  return (
    <span className={className}>
      {formatValue(animatedValue)}
    </span>
  );
};

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights into your GitHub repositories with AI-powered analysis"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamlessly manage team performance and track contributions"
  },
  {
    icon: GitPullRequest,
    title: "Smart Reports",
    description: "Automated reporting with customizable metrics and visualizations"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with SOC 2 compliance and data encryption"
  }
];

const testimonials = [
  {
    quote: "ReportFlow transformed how we track our development metrics. The insights are incredible.",
    author: "Sarah Chen",
    role: "CTO at TechCorp",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1db?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
  },
  {
    quote: "Finally, a GitHub analytics tool that actually makes sense. Our team productivity is up 40%.",
    author: "Marcus Rodriguez",
    role: "Engineering Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
  }
];

// Enhanced stats with ROI metrics and business impact
const enhancedStats = [
  {
    value: 85,
    displayValue: "85%",
    label: "Faster Development",
    description: "Time reduction in code reviews",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    progressColor: "bg-green-500",
    prefix: "",
    suffix: "%",
    category: "performance"
  },
  {
    value: 20,
    displayValue: "20h",
    label: "Hours Saved Weekly",
    description: "Per developer productivity gain",
    icon: Clock,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    progressColor: "bg-blue-500",
    prefix: "",
    suffix: "h",
    category: "time"
  },
  {
    value: 300,
    displayValue: "3x",
    label: "Team Productivity",
    description: "Increase in delivery velocity",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    progressColor: "bg-purple-500",
    prefix: "",
    suffix: "x",
    category: "productivity"
  },
  {
    value: 50000,
    displayValue: "$50K",
    label: "Cost Savings",
    description: "Annual development cost reduction",
    icon: TrendingUp,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    progressColor: "bg-emerald-500",
    prefix: "$",
    suffix: "K",
    category: "savings"
  },
  {
    value: 98.7,
    displayValue: "98.7%",
    label: "Code Quality",
    description: "Bug detection accuracy",
    icon: Shield,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    progressColor: "bg-cyan-500",
    prefix: "",
    suffix: "%",
    category: "quality"
  },
  {
    value: 99.9,
    displayValue: "99.9%",
    label: "Platform Uptime",
    description: "Enterprise-grade reliability",
    icon: Activity,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    progressColor: "bg-orange-500",
    prefix: "",
    suffix: "%",
    category: "reliability"
  },
  {
    value: 24,
    displayValue: "24/7",
    label: "Expert Support",
    description: "Round-the-clock assistance",
    icon: UserCheck,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    progressColor: "bg-rose-500",
    prefix: "",
    suffix: "/7",
    category: "support"
  },
  {
    value: 150,
    displayValue: "150+",
    label: "Enterprise Clients",
    description: "Fortune 500 companies trust us",
    icon: Globe,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    progressColor: "bg-indigo-500",
    prefix: "",
    suffix: "+",
    category: "clients"
  }
];

// Social proof data
const trustedCompanies = [
  { icon: SiGoogle, name: "Google", color: "#4285F4" },
  { icon: SiApple, name: "Apple", color: "#000000" },
  { icon: SiAmazon, name: "Amazon", color: "#FF9900" },
  { icon: SiGithub, name: "GitHub", color: "#181717" },
  { icon: SiMeta, name: "Meta", color: "#0866FF" },
  { icon: SiAdobe, name: "Adobe", color: "#FF0000" },
  { icon: SiTesla, name: "Tesla", color: "#CC0000" },
  { icon: SiSalesforce, name: "Salesforce", color: "#00A1E0" },
  { icon: SiSlack, name: "Slack", color: "#4A154B" },
  { icon: SiSpotify, name: "Spotify", color: "#1DB954" },
  { icon: SiNetflix, name: "Netflix", color: "#E50914" },
  { icon: SiUber, name: "Uber", color: "#000000" },
  { icon: SiStripe, name: "Stripe", color: "#635BFF" },
  { icon: SiZoom, name: "Zoom", color: "#2D8CFF" },
  { icon: SiFigma, name: "Figma", color: "#F24E1E" },
  { icon: SiNotion, name: "Notion", color: "#000000" },
  { icon: SiDropbox, name: "Dropbox", color: "#0061FF" },
  { icon: SiAtlassian, name: "Atlassian", color: "#0052CC" },
  { icon: SiCanva, name: "Canva", color: "#00C4CC" },
  { icon: SiLinkedin, name: "LinkedIn", color: "#0A66C2" },
  { icon: SiDiscord, name: "Discord", color: "#5865F2" },
  { icon: SiTrello, name: "Trello", color: "#0079BF" }
];

const socialProofMetrics = [
  { 
    icon: Users, 
    value: "50,127", 
    label: "Developers",
    suffix: "+",
    description: "Active monthly users",
    color: "text-blue-500"
  },
  { 
    icon: Activity, 
    value: "2.3M", 
    label: "Reports Generated",
    suffix: "+",
    description: "In the last 30 days",
    color: "text-green-500"
  },
  { 
    icon: Database, 
    value: "98.7", 
    label: "Accuracy Rate",
    suffix: "%",
    description: "AI-powered insights",
    color: "text-purple-500"
  },
  { 
    icon: Globe, 
    value: "150", 
    label: "Countries",
    suffix: "+",
    description: "Worldwide coverage",
    color: "text-orange-500"
  }
];

const fastResultsIndicators = [
  { icon: Timer, text: "Setup in 5 minutes", color: "text-green-500" },
  { icon: Zap, text: "Results in 24 hours", color: "text-yellow-500" },
  { icon: Clock, text: "Real-time updates", color: "text-blue-500" },
  { icon: TrendingUp, text: "Instant insights", color: "text-purple-500" }
];

const securityBadges = [
  { icon: Shield, text: "SOC 2 Compliant", color: "text-blue-600" },
  { icon: FileCheck, text: "GDPR Compliant", color: "text-green-600" },
  { icon: UserCheck, text: "Enterprise Security", color: "text-purple-600" },
  { icon: Server, text: "99.9% Uptime SLA", color: "text-orange-600" }
];

const recentActivity = [
  { action: "Repository analyzed", user: "TechCorp", time: "2 minutes ago", icon: Eye },
  { action: "Report generated", user: "StartupXYZ", time: "5 minutes ago", icon: FileCheck },
  { action: "Team invited", user: "DevTeam", time: "8 minutes ago", icon: Users },
  { action: "Insights delivered", user: "Enterprise", time: "12 minutes ago", icon: TrendingUp }
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdsRef = useRef<string[]>([]);
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const motionPreferences = useMotionPreferences();
  
  // Enhanced parallax effects
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const y3 = useTransform(scrollY, [300, 800], [0, -60]);
  const y4 = useTransform(scrollY, [600, 1200], [0, -40]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.98]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);
  
  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  
  // Motion template for magnetic halo effect
  const haloBg = useMotionTemplate`radial-gradient(300px circle at ${smoothMouseX}px ${smoothMouseY}px, hsla(var(--primary), 0.05), transparent 40%)`;

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      // Only update motion values, not React state to avoid re-renders
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Enhanced animation variants with motion preferences (moved from inside component)
  // Stabilize dependencies to prevent hook order issues
  const reducedMotion = Boolean(shouldReduceMotion);
  const slowAnimations = Boolean(motionPreferences?.prefersSlowAnimations);
  
  const containerVariants = useMemo(() => createAdvancedStagger(
    reducedMotion ? 0 : 0.08, 
    reducedMotion ? 0 : 0.15
  ), [reducedMotion]);
  
  const heroItemVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      y: reducedMotion ? 0 : 40, 
      scale: reducedMotion ? 1 : 0.95, 
      filter: reducedMotion ? "blur(0px)" : "blur(8px)" 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: reducedMotion ? { duration: 0 } : {
        duration: slowAnimations ? 1.2 : 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        filter: { duration: slowAnimations ? 0.9 : 0.6 }
      }
    }
  }), [reducedMotion, slowAnimations]);

  const floatingVariants = useMemo(() => ({
    float: reducedMotion ? {} : {
      y: [-15, 15, -15],
      rotate: [-2, 2, -2],
      transition: {
        duration: slowAnimations ? 12 : 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }), [reducedMotion, slowAnimations]);
  
  const iconPulseVariants = useMemo(() => ({
    initial: { scale: 1, rotate: 0 },
    animate: reducedMotion ? {} : {
      scale: [1, 1.1, 1],
      rotate: [0, 5, 0],
      transition: {
        duration: slowAnimations ? 3 : 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    hover: reducedMotion ? {} : {
      scale: 1.2,
      rotate: 10,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }), [reducedMotion, slowAnimations]);
  
  const navLinkVariants = useMemo(() => ({
    rest: { 
      backgroundSize: "0% 2px",
      color: "hsl(var(--muted-foreground))"
    },
    hover: reducedMotion ? {
      color: "hsl(var(--foreground))"
    } : {
      backgroundSize: "100% 2px",
      color: "hsl(var(--foreground))",
      transition: { duration: 0.3, ease: "easeOut" }
    }
  }), [reducedMotion]);

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ display: shouldReduceMotion ? 'none' : 'block' }}>
        {/* Primary gradient orb */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          style={{ willChange: 'transform, opacity' }}
          animate={shouldReduceMotion ? {} : {
            scale: [1, 1.3, 0.9, 1.2, 1],
            opacity: [0.3, 0.6, 0.2, 0.5, 0.3],
            x: [0, 50, -30, 20, 0],
            y: [0, -30, 40, -20, 0]
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Secondary gradient orb */}
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
          style={{ willChange: 'transform, opacity' }}
          animate={shouldReduceMotion ? {} : {
            scale: [1.2, 0.8, 1.4, 1, 1.2],
            opacity: [0.2, 0.5, 0.1, 0.4, 0.2],
            x: [0, -40, 60, -20, 0],
            y: [0, 30, -50, 40, 0]
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional gradient orbs for more depth */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-60 h-60 bg-pink-500/3 rounded-full blur-3xl"
          style={{ willChange: 'transform, opacity' }}
          animate={shouldReduceMotion ? {} : {
            scale: [0.8, 1.1, 0.9, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.05, 0.25, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-cyan-500/4 rounded-full blur-3xl"
          style={{ willChange: 'transform, opacity' }}
          animate={shouldReduceMotion ? {} : {
            scale: [1, 0.7, 1.3, 0.9, 1],
            opacity: [0.15, 0.4, 0.1, 0.3, 0.15]
          }}
          transition={shouldReduceMotion ? {} : {
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating particles - always render 6 but conditionally show */}
        {[...Array(6)].map((_, i) => {
          const shouldShow = motionPreferences.devicePixelRatio >= 2 || i < 3;
          return (
            <motion.div
              key={`floating-particle-hero-${i}`}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                display: shouldShow ? 'block' : 'none'
              }}
              animate={shouldReduceMotion ? {} : {
                y: [-20, -60, -20],
                x: [-10, 10, -10],
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={shouldReduceMotion ? {} : {
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          );
        })}
      </div>
      {/* Static background fallback for reduced motion */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ display: shouldReduceMotion ? 'block' : 'none' }}>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 bg-pink-500/3 rounded-full blur-3xl opacity-15" />
        <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-cyan-500/4 rounded-full blur-3xl opacity-15" />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 border-b border-border/50 backdrop-blur-xl bg-background/80"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">ReportFlow</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <motion.a 
                href="#features" 
                className="relative text-muted-foreground hover:text-foreground transition-colors py-2"
                style={{
                  backgroundImage: "linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom center",
                  backgroundSize: "0% 2px"
                }}
                variants={navLinkVariants}
                initial="rest"
                whileHover="hover"
                data-testid="nav-features"
              >
                Features
              </motion.a>
              <motion.a 
                href="#pricing" 
                className="relative text-muted-foreground hover:text-foreground transition-colors py-2"
                style={{
                  backgroundImage: "linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom center",
                  backgroundSize: "0% 2px"
                }}
                variants={navLinkVariants}
                initial="rest"
                whileHover="hover"
                data-testid="nav-pricing"
              >
                Pricing
              </motion.a>
              <motion.a 
                href="#docs" 
                className="relative text-muted-foreground hover:text-foreground transition-colors py-2"
                style={{
                  backgroundImage: "linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom center",
                  backgroundSize: "0% 2px"
                }}
                variants={navLinkVariants}
                initial="rest"
                whileHover="hover"
                data-testid="nav-docs"
              >
                Docs
              </motion.a>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
                data-testid="button-theme-toggle"
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </Button>
              
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login">
                  Login
                </Button>
              </Link>
              
              <Link href="/signup">
                <motion.div
                  variants={motionVariants.buttonAdvanced}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  whileFocus="focus"
                >
                  <Button 
                    data-testid="button-signup"
                    className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90"
                  >
                    <motion.span className="relative z-10 flex items-center">
                      Sign Up
                      <motion.div
                        animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                        transition={shouldReduceMotion ? {} : { duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.div>
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0"
                      whileHover={{ opacity: 0.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-32 lg:py-40 xl:py-48">
        <motion.div
          className="max-w-7xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div variants={heroItemVariants}>
            <Badge variant="secondary" className="mb-8 px-6 py-3 text-sm font-medium">
              <Sparkles className="w-5 h-5 mr-2" />
              Now with AI-powered insights
            </Badge>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight mb-8 lg:mb-12"
            variants={heroItemVariants}
          >
            <span className="bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              Smarter GitHub
            </span>
            <br />
            <span className="text-foreground">Analytics</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-16 lg:mb-20 max-w-4xl mx-auto leading-relaxed"
            variants={heroItemVariants}
          >
            Transform your development workflow with enterprise-grade analytics, 
            team insights, and automated reporting that scales with your organization.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center mb-20 lg:mb-24"
            variants={heroItemVariants}
          >
            <Link href="/signup">
              <motion.div
                variants={motionVariants.buttonAdvanced}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-lg font-semibold relative overflow-hidden bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90 shadow-2xl hover:shadow-3xl transition-all duration-300" 
                  data-testid="hero-signup"
                >
                  <motion.span className="relative z-10 flex items-center">
                    Start Free Trial Now
                    <motion.div
                      animate={shouldReduceMotion ? {} : { x: [0, 6, 0] }}
                      transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-6 h-6 ml-3" />
                    </motion.div>
                  </motion.span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0"
                    whileHover={{ opacity: 0.15 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Enhanced pulse glow effect */}
                  <>
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-lg opacity-0 blur-xl"
                      style={{ display: shouldReduceMotion ? 'none' : 'block' }}
                      animate={shouldReduceMotion ? {} : { 
                        opacity: [0, 0.4, 0],
                        scale: [0.95, 1.05, 0.95]
                      }}
                      transition={shouldReduceMotion ? {} : { 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-lg opacity-0 blur-lg"
                      style={{ display: shouldReduceMotion ? 'none' : 'block' }}
                      animate={shouldReduceMotion ? {} : { 
                        opacity: [0, 0.6, 0],
                        scale: [0.98, 1.02, 0.98]
                      }}
                      transition={shouldReduceMotion ? {} : { 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </>
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/login">
              <motion.div
                variants={motionVariants.buttonAdvanced}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-16 px-12 text-lg font-semibold border-2 border-border hover:border-primary/50 hover:bg-primary/10 bg-background/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300" 
                  data-testid="hero-demo"
                >
                  <motion.div
                    variants={iconPulseVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Github className="w-6 h-6 mr-3" />
                  </motion.div>
                  Watch Live Demo
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Floating parallax elements around dashboard */}
          <>
            <motion.div
              className="absolute -top-20 -left-20 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-2xl"
              style={{ y: y2, display: shouldReduceMotion ? 'none' : 'block' }}
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={shouldReduceMotion ? {} : {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.div
              className="absolute -top-10 -right-32 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-full blur-xl"
              style={{ y: y3, display: shouldReduceMotion ? 'none' : 'block' }}
              animate={shouldReduceMotion ? {} : {
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [0.8, 1.1, 0.8]
              }}
              transition={shouldReduceMotion ? {} : {
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute bottom-10 -left-16 w-20 h-20 bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-full blur-xl"
              style={{ y: y4, display: shouldReduceMotion ? 'none' : 'block' }}
              animate={shouldReduceMotion ? {} : {
                rotate: [0, -180, -360],
                scale: [1, 0.7, 1]
              }}
              transition={shouldReduceMotion ? {} : {
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </>

          {/* Enhanced Dashboard Preview */}
          <motion.div 
            className="relative max-w-7xl mx-auto mt-32 px-4"
            variants={heroItemVariants}
            style={{ y: y1 }}
          >
            {/* Enhanced background effects */}
            <div className="absolute inset-0 -m-16">
              {/* Multiple layered glow effects */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 blur-3xl"
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={shouldReduceMotion ? {} : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Secondary glow layer */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-rose-500/20 blur-2xl"
                animate={shouldReduceMotion ? {} : {
                  scale: [1.05, 0.95, 1.05],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={shouldReduceMotion ? {} : {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              {/* Floating light particles - always render 8 */}
              {[...Array(8)].map((_, i) => {
                // Generate stable IDs only once
                if (!particleIdsRef.current[i]) {
                  particleIdsRef.current[i] = `floating-light-particle-dashboard-${i}-${Math.random().toString(36).substr(2, 9)}`;
                }
                return (
                <motion.div
                  key={particleIdsRef.current[i]}
                  className="absolute w-2 h-2 bg-primary/40 rounded-full blur-sm"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${20 + (i % 3) * 20}%`,
                    display: shouldReduceMotion ? 'none' : 'block'
                  }}
                  animate={shouldReduceMotion ? {} : {
                    y: [-30, 30, -30],
                    x: [-20, 20, -20],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5]
                  }}
                  transition={shouldReduceMotion ? {} : {
                    duration: 6 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                />
                );
              })}
            </div>
            
            {/* Main dashboard preview container */}
            <motion.div
              className="relative"
              whileHover="hover"
              initial="rest"
              variants={{
                rest: { scale: 1, y: 0, rotateX: 0, rotateY: 0 },
                hover: { 
                  scale: 1.03, 
                  y: -12,
                  rotateX: -5,
                  rotateY: 2
                }
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ perspective: "1000px" }}
            >
              {/* Enhanced animated gradient border */}
              <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-sm"
                animate={shouldReduceMotion ? {} : {
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, 0]
                }}
                transition={shouldReduceMotion ? {} : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Rotating accent border */}
              <motion.div 
                className="absolute -inset-2 bg-gradient-to-r from-cyan-500/30 via-transparent to-rose-500/30 rounded-2xl opacity-0 blur-lg"
                style={{ display: shouldReduceMotion ? 'none' : 'block' }}
                animate={shouldReduceMotion ? {} : {
                  opacity: [0, 0.4, 0],
                  rotate: [0, 360]
                }}
                transition={shouldReduceMotion ? {} : {
                  opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                }}
              />
              
              {/* Glass morphism container */}
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/5 dark:bg-black/20 backdrop-blur-2xl rounded-2xl group">
                {/* Reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Enhanced hover glow with multiple layers */}
                <motion.div
                  className="absolute -inset-6 bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50 rounded-2xl opacity-0 blur-3xl"
                  variants={{
                    rest: { opacity: 0, scale: 0.9 },
                    hover: { opacity: 1, scale: 1.1 }
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-transparent to-rose-500/30 rounded-2xl opacity-0 blur-2xl"
                  variants={{
                    rest: { opacity: 0, scale: 0.95 },
                    hover: { opacity: 0.8, scale: 1.05 }
                  }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                />
                
                {/* Enhanced breathing animation with multiple layers */}
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl"
                  animate={shouldReduceMotion ? {} : {
                    opacity: [0.1, 0.4, 0.1],
                    scale: [1, 1.015, 1]
                  }}
                  transition={shouldReduceMotion ? {} : {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {!shouldReduceMotion && (
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-br from-cyan-500/10 via-transparent to-rose-500/10 rounded-2xl"
                    animate={{
                      opacity: [0.05, 0.25, 0.05],
                      scale: [1.01, 0.99, 1.01]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                )}
                
                <CardContent className="p-0 relative z-10" data-testid="dashboard-preview">
                  <div className="aspect-[16/10] bg-gradient-to-br from-background/80 via-background/60 to-background/80 relative overflow-hidden rounded-2xl">
                    {/* Enhanced magnetic mouse tracking effect */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: haloBg
                      }}
                    />
                    
                    {/* Secondary interactive halo */}
                    {!shouldReduceMotion && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{
                          background: `radial-gradient(200px circle at 50% 50%, hsla(var(--primary), 0.08), transparent 30%)`
                        }}
                        animate={{
                          opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    
                    {/* Enhanced realistic dashboard content */}
                    <motion.div 
                      className="w-full h-full p-8"
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1, scale: 1.01 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      role="img"
                      aria-label="Interactive dashboard preview showing analytics charts, metrics cards, and real-time data visualization"
                    >
                        {/* Top bar with enhanced animations */}
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                        >
                          <div className="flex items-center gap-3">
                            <motion.div 
                              className="w-8 h-8 bg-primary/20 rounded-lg relative overflow-hidden"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-primary/40 rounded-lg"
                                animate={{ opacity: [0.2, 0.8, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                            <motion.div 
                              className="h-4 bg-muted rounded w-24"
                              animate={{ opacity: [0.6, 1, 0.6] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </div>
                          <div className="flex gap-2">
                            {[...Array(2)].map((_, i) => (
                              <motion.div 
                                key={i}
                                className="w-8 h-8 bg-muted/50 rounded-full"
                                whileHover={{ scale: 1.2, backgroundColor: "hsl(var(--primary) / 0.3)" }}
                                animate={{ 
                                  scale: [1, 1.05, 1],
                                  rotate: [0, 5, 0] 
                                }}
                                transition={{ 
                                  duration: 4, 
                                  repeat: Infinity, 
                                  delay: i * 0.5 
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                        
                        {/* Enhanced realistic stats cards with actual metrics */}
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-4 gap-4"
                          variants={{
                            animate: {
                              transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.5
                              }
                            }
                          }}
                          initial="initial"
                          animate="animate"
                          role="region"
                          aria-label="Key performance metrics"
                        >
                          {[
                            { label: "Active Repos", value: "847", trend: "+12%", icon: "📊" },
                            { label: "Team Members", value: "24", trend: "+8%", icon: "👥" },
                            { label: "Commits Today", value: "156", trend: "+24%", icon: "🔄" },
                            { label: "Issues Closed", value: "89", trend: "+15%", icon: "✅" }
                          ].map((metric, i) => (
                            <motion.div
                              key={i}
                              className="bg-card/70 backdrop-blur-sm rounded-lg p-4 space-y-3 relative overflow-hidden group/card border border-border/30"
                              variants={{
                                initial: { opacity: 0, y: 20, scale: 0.9 },
                                animate: { opacity: 1, y: 0, scale: 1 }
                              }}
                              whileHover={{ 
                                scale: 1.08, 
                                y: -6,
                                backgroundColor: "hsl(var(--card) / 0.95)",
                                borderColor: "hsl(var(--primary) / 0.4)",
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                              }}
                              animate={shouldReduceMotion ? {} : {
                                y: [-1, 1, -1]
                              }}
                              transition={shouldReduceMotion ? {} : {
                                y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
                                hover: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                              }}
                              role="article"
                              aria-label={`${metric.label}: ${metric.value}, trending ${metric.trend}`}
                            >
                              {/* Enhanced loading shimmer effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/15 to-transparent opacity-0 group-hover/card:opacity-100"
                                animate={shouldReduceMotion ? {} : { x: [-120, 220] }}
                                transition={shouldReduceMotion ? {} : { 
                                  duration: 1.8, 
                                  repeat: Infinity, 
                                  repeatDelay: 2.5,
                                  ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-0 group-hover/card:opacity-100"
                                animate={shouldReduceMotion ? {} : { x: [-80, 180] }}
                                transition={shouldReduceMotion ? {} : { 
                                  duration: 2, 
                                  repeat: Infinity, 
                                  repeatDelay: 3,
                                  ease: "easeInOut",
                                  delay: 0.3
                                }}
                              />
                              
                              {/* Icon and trend */}
                              <div className="flex items-center justify-between">
                                <motion.span 
                                  className="text-lg opacity-60"
                                  animate={shouldReduceMotion ? {} : { 
                                    rotate: [0, 5, 0],
                                    scale: [1, 1.1, 1] 
                                  }}
                                  transition={shouldReduceMotion ? {} : { 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    delay: i * 0.5 
                                  }}
                                >
                                  {metric.icon}
                                </motion.span>
                                <motion.div
                                  className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full"
                                  animate={shouldReduceMotion ? {} : { 
                                    opacity: [0.7, 1, 0.7],
                                    scale: [1, 1.05, 1] 
                                  }}
                                  transition={shouldReduceMotion ? {} : { 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    delay: i * 0.3 
                                  }}
                                >
                                  {metric.trend}
                                </motion.div>
                              </div>
                              
                              {/* Main value */}
                              <motion.div 
                                className="text-2xl font-bold text-foreground"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                  delay: 0.8 + i * 0.1, 
                                  duration: 0.6,
                                  type: "spring",
                                  stiffness: 200 
                                }}
                              >
                                <motion.span
                                  animate={shouldReduceMotion ? {} : {
                                    color: [
                                      "hsl(var(--foreground))", 
                                      "hsl(var(--primary))", 
                                      "hsl(var(--foreground))"
                                    ]
                                  }}
                                  transition={shouldReduceMotion ? {} : { 
                                    duration: 3, 
                                    repeat: Infinity, 
                                    delay: i * 0.5 
                                  }}
                                >
                                  {metric.value}
                                </motion.span>
                              </motion.div>
                              
                              {/* Label */}
                              <motion.div 
                                className="text-sm text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 + i * 0.1 }}
                              >
                                {metric.label}
                              </motion.div>
                              
                              {/* Progress bar */}
                              <motion.div 
                                className="h-1 bg-muted rounded-full overflow-hidden"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                              >
                                <motion.div
                                  className="h-full bg-primary rounded-full"
                                  initial={{ width: "0%" }}
                                  animate={{ width: `${60 + i * 10}%` }}
                                  transition={{ 
                                    delay: 1.4 + i * 0.1, 
                                    duration: 1,
                                    ease: "easeOut"
                                  }}
                                />
                              </motion.div>
                            </motion.div>
                          ))}
                        </motion.div>
                        
                        {/* Enhanced chart area */}
                        <motion.div 
                          className="bg-card/60 rounded-lg p-6 h-48 flex items-end gap-2 relative overflow-hidden group/chart"
                          whileHover={{ backgroundColor: "hsl(var(--card) / 0.8)" }}
                        >
                          {/* Chart background grid */}
                          <motion.div
                            className="absolute inset-6 opacity-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            transition={{ delay: 1 }}
                          >
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-full h-px bg-muted"
                                style={{ top: `${25 * i + 25}%` }}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                              />
                            ))}
                          </motion.div>
                          
                          {/* Enhanced animated bars */}
                          {[...Array(12)].map((_, i) => {
                            const baseHeight = Math.random() * 60 + 20;
                            return (
                              <motion.div
                                key={i}
                                className="bg-gradient-to-t from-primary/40 via-primary/60 to-primary/80 rounded-t flex-1 relative overflow-hidden group/bar"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ 
                                  height: [`${baseHeight}%`, `${baseHeight + 20}%`, `${baseHeight}%`],
                                  opacity: 1
                                }}
                                whileHover={{ 
                                  height: `${baseHeight + 30}%`,
                                  scale: 1.1,
                                  backgroundColor: "hsl(var(--primary) / 0.9)"
                                }}
                                transition={{
                                  height: {
                                    duration: 3 + (i * 0.2),
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.1
                                  },
                                  opacity: { delay: 0.8 + i * 0.05, duration: 0.3 },
                                  hover: { duration: 0.2 }
                                }}
                              >
                                {/* Glowing top effect */}
                                <motion.div
                                  className="absolute top-0 left-0 right-0 h-1 bg-primary/80 opacity-0 group-hover/bar:opacity-100"
                                  animate={{ opacity: [0, 1, 0] }}
                                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                />
                                
                                {/* Data point indicator */}
                                <motion.div
                                  className="absolute -top-1 left-1/2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover/chart:opacity-100"
                                  style={{ transform: "translateX(-50%)" }}
                                  animate={{ scale: [0.8, 1.2, 0.8] }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                />
                              </motion.div>
                            );
                          })}
                          
                          {/* Hover tooltip */}
                          <motion.div
                            className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 text-xs opacity-0 group-hover/chart:opacity-100"
                            initial={{ scale: 0.8, y: 10 }}
                            whileHover={{ scale: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-primary font-semibold">Live Data</div>
                            <div className="text-muted-foreground">Hover to explore</div>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                      
                      {/* Enhanced blur overlay for preview effect */}
                      <motion.div 
                        className="absolute inset-0 bg-background/20 backdrop-blur-[2px]"
                        whileHover={{ backdropFilter: "blur(1px)", backgroundColor: "hsl(var(--background) / 0.1)" }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      {/* Enhanced preview badge */}
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.div
                          whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -2 }}
                          whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        >
                          <Badge 
                            variant="secondary" 
                            className="px-6 py-3 text-base font-semibold relative overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            role="button"
                            tabIndex={0}
                            aria-label="Interactive dashboard preview - Click to explore live dashboard features"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                // Handle preview interaction
                              }
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100"
                              transition={{ duration: 0.3 }}
                            />
                            
                            <motion.div
                              className="relative z-10 flex items-center"
                              animate={shouldReduceMotion ? {} : { x: [0, 2, 0] }}
                              transition={shouldReduceMotion ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <motion.div
                                animate={shouldReduceMotion ? {} : { rotate: [0, 360] }}
                                transition={shouldReduceMotion ? {} : { duration: 8, repeat: Infinity, ease: "linear" }}
                                aria-hidden="true"
                              >
                                <TrendingUp className="w-5 h-5 mr-2" />
                              </motion.div>
                              <span className="sr-only">Live Dashboard Preview - </span>
                              Live Dashboard Preview
                            </motion.div>
                          </Badge>
                        </motion.div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

      {/* Social Proof Section */}
      <section className="relative px-6 lg:px-8 py-16 lg:py-20 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden" data-testid="social-proof-section">
        {/* Background elements */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          style={{ display: shouldReduceMotion ? 'none' : 'block' }}
        >
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </motion.div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Trusted Companies */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-sm font-medium text-muted-foreground/80 uppercase tracking-wide mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Trusted by teams at
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6 lg:gap-8 items-center justify-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {trustedCompanies.map((company, index) => (
                <motion.div
                  key={`company-${company.name.toLowerCase()}-${index}`}
                  className="flex items-center justify-center group cursor-pointer"
                  variants={heroItemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  data-testid={`company-logo-${company.name.toLowerCase()}`}
                >
                  <motion.div
                    className="p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 group-hover:border-primary/30 transition-all duration-300 shadow-sm group-hover:shadow-lg"
                    whileHover={{ 
                      backgroundColor: "hsl(var(--primary) / 0.05)",
                      borderColor: company.color + "40"
                    }}
                  >
                    <company.icon 
                      className="w-6 h-6 md:w-7 md:h-7 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      style={{
                        color: theme === 'dark' ? undefined : company.color
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* User Count and Social Proof Metrics */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {socialProofMetrics.map((metric, index) => (
              <motion.div
                key={`metric-${metric.label.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                className="text-center group"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1 + 0.3, 
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                data-testid={`metric-${metric.label.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/30">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={cn("w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center", 
                        "bg-gradient-to-br from-primary/10 to-primary/5")}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <metric.icon className={cn("w-6 h-6", metric.color)} />
                    </motion.div>
                    
                    <motion.div 
                      className="text-2xl md:text-3xl font-bold mb-1"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.5,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 300
                      }}
                      viewport={{ once: true }}
                    >
                      <motion.span
                        animate={shouldReduceMotion ? {} : {
                          scale: [1, 1.02, 1]
                        }}
                        transition={shouldReduceMotion ? {} : {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        {metric.value}{metric.suffix}
                      </motion.span>
                    </motion.div>
                    
                    <div className="text-sm font-medium text-foreground mb-1">
                      {metric.label}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {metric.description}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Fast Results and Security Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Fast Results Indicators */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 bg-background/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <motion.h3 
                    className="text-lg font-semibold mb-6 flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                    Lightning Fast Results
                  </motion.h3>
                  
                  <div className="space-y-4">
                    {fastResultsIndicators.map((indicator, index) => (
                      <motion.div
                        key={`fast-result-${indicator.text.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                        className="flex items-center group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ x: 4 }}
                        data-testid={`fast-result-${indicator.text.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-lg bg-background/80 border border-border/50 flex items-center justify-center mr-3 group-hover:border-primary/50 transition-colors duration-300"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <indicator.icon className={cn("w-4 h-4", indicator.color)} />
                        </motion.div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {indicator.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Badges */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-border/50 bg-background/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <motion.h3 
                    className="text-lg font-semibold mb-6 flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                    Enterprise Security
                  </motion.h3>
                  
                  <div className="space-y-4">
                    {securityBadges.map((badge, index) => (
                      <motion.div
                        key={`security-${badge.text.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                        className="flex items-center group"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ x: -4 }}
                        data-testid={`security-${badge.text.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-lg bg-background/80 border border-border/50 flex items-center justify-center mr-3 group-hover:border-primary/50 transition-colors duration-300"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <badge.icon className={cn("w-4 h-4", badge.color)} />
                        </motion.div>
                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {badge.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity Feed */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-2 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary mr-2" />
                Live Activity
              </h3>
              <p className="text-sm text-muted-foreground">See what's happening right now</p>
            </motion.div>

            <Card className="border-border/50 bg-background/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={`activity-${activity.action.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                      className="flex items-center justify-between py-3 px-4 rounded-lg bg-background/50 border border-border/30 group hover:border-primary/30 transition-all duration-300"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      data-testid={`activity-${activity.action.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <div className="flex items-center">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <activity.icon className="w-4 h-4 text-primary" />
                        </motion.div>
                        
                        <div>
                          <motion.span 
                            className="text-sm font-medium text-foreground"
                            animate={shouldReduceMotion ? {} : {
                              opacity: [1, 0.8, 1]
                            }}
                            transition={shouldReduceMotion ? {} : {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.3
                            }}
                          >
                            {activity.action}
                          </motion.span>
                          <span className="text-sm text-muted-foreground ml-1">
                            by {activity.user}
                          </span>
                        </div>
                      </div>
                      
                      <motion.div
                        className="text-xs text-muted-foreground flex items-center"
                        animate={shouldReduceMotion ? {} : {
                          scale: [1, 1.05, 1]
                        }}
                        transition={shouldReduceMotion ? {} : {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Stats Section with ROI Metrics */}
      <section className="px-6 lg:px-8 py-24 bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div 
          className="max-w-7xl mx-auto"
          style={{ y: y2 }}
        >
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              Proven Business Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of teams already experiencing measurable results and ROI improvements
            </p>
          </motion.div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {enhancedStats.map((stat, index) => {
              const [isVisible, setIsVisible] = useState(false);
              const IconComponent = stat.icon;
              
              return (
                <motion.div
                  key={`enhanced-stat-${stat.label.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                  className="relative group"
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }
                  }}
                  viewport={{ 
                    once: true,
                    margin: "-50px"
                  }}
                  onViewportEnter={() => setIsVisible(true)}
                  whileHover={{ 
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  data-testid={`stat-card-${stat.category}`}
                >
                  {/* Enhanced Card with Glassmorphism */}
                  <div className={cn(
                    "relative overflow-hidden rounded-2xl p-8 h-full",
                    "bg-card/80 backdrop-blur-xl border border-border/50",
                    "shadow-lg hover:shadow-2xl transition-all duration-500",
                    "hover:border-primary/30 hover:bg-card/90",
                    stat.bgColor
                  )}>
                    {/* Animated Background Gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${stat.color.replace('text-', 'hsl(var(--')} / 0.1), transparent 70%)`
                      }}
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100"
                      animate={shouldReduceMotion ? {} : { x: [-200, 200] }}
                      transition={shouldReduceMotion ? {} : { 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Icon Section */}
                    <motion.div 
                      className="flex items-center justify-between mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <motion.div 
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center",
                          stat.bgColor,
                          "shadow-lg"
                        )}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.3 }
                        }}
                        animate={shouldReduceMotion ? {} : {
                          rotate: [0, 2, 0, -2, 0],
                          scale: [1, 1.05, 1]
                        }}
                        transition={shouldReduceMotion ? {} : {
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5
                        }}
                      >
                        <IconComponent className={cn("w-6 h-6", stat.color)} />
                      </motion.div>
                      
                      {/* Category Badge */}
                      <motion.div
                        className="px-3 py-1 rounded-full bg-muted/50 backdrop-blur-sm text-xs font-medium text-muted-foreground uppercase tracking-wider"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.4 }}
                        viewport={{ once: true }}
                      >
                        {stat.category}
                      </motion.div>
                    </motion.div>

                    {/* Animated Counter */}
                    <motion.div 
                      className="mb-4"
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: index * 0.1 + 0.4,
                        duration: 0.6,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      viewport={{ once: true }}
                    >
                      <div className={cn(
                        "text-4xl md:text-5xl font-bold mb-2 relative",
                        stat.color
                      )}>
                        <AnimatedCounter
                          value={stat.value}
                          prefix={stat.prefix}
                          suffix={stat.suffix}
                          startAnimation={isVisible}
                          duration={2000 + index * 200}
                          className="relative z-10"
                        />
                        
                        {/* Enhanced Glow Effect */}
                        <motion.div
                          className={cn(
                            "absolute inset-0 blur-lg opacity-30",
                            stat.color
                          )}
                          animate={shouldReduceMotion ? {} : {
                            opacity: [0.2, 0.6, 0.2],
                            scale: [0.9, 1.1, 0.9]
                          }}
                          transition={shouldReduceMotion ? {} : {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                        >
                          {stat.displayValue}
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Progress Bar for Percentage Values */}
                    {(stat.suffix === "%" || stat.suffix === "x") && (
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, scaleX: 0 }}
                        whileInView={{ opacity: 1, scaleX: 1 }}
                        transition={{ delay: index * 0.1 + 0.8, duration: 0.8 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", stat.progressColor)}
                            initial={{ width: 0 }}
                            whileInView={{ 
                              width: stat.suffix === "%" ? `${Math.min(stat.value, 100)}%` : 
                                     stat.suffix === "x" ? `${Math.min((stat.value / 100) * 33, 100)}%` : "100%"
                            }}
                            transition={{ 
                              delay: index * 0.1 + 1,
                              duration: 1.5,
                              ease: "easeOut"
                            }}
                            viewport={{ once: true }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Label and Description */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.6, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                        {stat.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {stat.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-muted-foreground mb-8">
              Ready to see these results for your team?
            </p>
            <Link href="/signup">
              <motion.div
                variants={motionVariants.buttonAdvanced}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="stats-cta-button"
                >
                  <motion.span className="flex items-center">
                    Start Your Free Trial
                    <motion.div
                      animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                      transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  </motion.span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 lg:px-8 py-24">
        <motion.div 
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed for modern development teams who demand excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={`feature-${feature.title.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  variants={motionVariants.cardHoverAdvanced}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  className="h-full relative"
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
                    {/* Glow effect on hover */}
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-lg opacity-0 blur-lg"
                      animate={{
                        opacity: hoveredCard === index ? 0.6 : 0,
                        scale: hoveredCard === index ? 1.02 : 0.98
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {/* Icon glow background */}
                          <motion.div
                            className="absolute inset-0 bg-primary/20 rounded-lg"
                            animate={{
                              opacity: hoveredCard === index ? 1 : 0,
                              scale: hoveredCard === index ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                          />
                          
                          <motion.div
                            variants={iconPulseVariants}
                            initial="initial"
                            animate="animate"
                            whileHover="hover"
                            className="relative z-10"
                          >
                            <feature.icon className="w-6 h-6 text-primary" />
                          </motion.div>
                        </motion.div>
                        <div>
                          <motion.h3 
                            className="text-xl font-semibold mb-3"
                            style={{
                              color: hoveredCard === index ? "hsl(var(--primary))" : "hsl(var(--foreground))"
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            {feature.title}
                          </motion.h3>
                          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="px-6 lg:px-8 py-24 bg-muted/30 relative overflow-hidden">
        {/* Parallax background elements */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y: y3 }}
        >
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl" />
        </motion.div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Loved by developers worldwide
            </motion.h2>
            
            {/* Decorative elements */}
            <motion.div
              className="flex justify-center gap-2 mt-4"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`testimonial-star-${i}`}
                  animate={shouldReduceMotion ? {} : {
                    rotate: [0, 10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={shouldReduceMotion ? {} : {
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                >
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`testimonial-${testimonial.author.replace(/\s+/g, '-').toLowerCase()}-${index}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.2, 
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <motion.div
                  variants={motionVariants.cardHoverAdvanced}
                  initial="rest"
                  whileHover="hover"
                  className="relative"
                >
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 relative overflow-hidden group">
                    {/* Quote decoration */}
                    <motion.div
                      className="absolute top-4 right-4 text-6xl text-primary/10 leading-none"
                      animate={shouldReduceMotion ? {} : { rotate: [0, 5, 0] }}
                      transition={shouldReduceMotion ? {} : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      "
                    </motion.div>
                    
                    {/* Subtle glow effect */}
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 rounded-lg opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-start gap-4">
                        <motion.img
                          src={testimonial.avatar}
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full ring-2 ring-primary/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                        <div className="flex-1">
                          <motion.p 
                            className="text-lg mb-4 leading-relaxed"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
                            viewport={{ once: true }}
                          >
                            "{testimonial.quote}"
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                            viewport={{ once: true }}
                          >
                            <div className="font-semibold">{testimonial.author}</div>
                            <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 lg:px-8 py-24 relative overflow-hidden">
        {/* Enhanced background with parallax */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"
          style={{ y: y3, scale }}
        />
        
        {/* Floating elements */}
        {!shouldReduceMotion && (
          <>
            <motion.div
              className="absolute top-20 left-20 w-16 h-16 bg-primary/10 rounded-full blur-xl"
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="absolute bottom-20 right-20 w-12 h-12 bg-purple-500/10 rounded-full blur-xl"
              animate={{
                y: [20, -20, 20],
                x: [10, -10, 10],
                scale: [1.2, 0.8, 1.2]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        {/* Static elements for reduced motion */}
        {shouldReduceMotion && (
          <>
            <div className="absolute top-20 left-20 w-16 h-16 bg-primary/10 rounded-full blur-xl" />
            <div className="absolute bottom-20 right-20 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />
          </>
        )}
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Ready to transform your workflow?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Join thousands of development teams already using ReportFlow to build better software faster.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/signup">
              <motion.div
                variants={motionVariants.buttonAdvanced}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className="relative"
              >
                <Button 
                  size="lg" 
                  className="h-12 px-8 text-base relative overflow-hidden bg-gradient-to-r from-primary via-primary to-purple-600 hover:from-primary/90 hover:via-primary/90 hover:to-purple-600/90" 
                  data-testid="cta-signup"
                >
                  <motion.span className="relative z-10 flex items-center">
                    Start Free Trial
                    <motion.div
                      animate={shouldReduceMotion ? {} : { x: [0, 4, 0] }}
                      transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.div>
                  </motion.span>
                  
                  {/* Enhanced pulse glow effect */}
                  {!shouldReduceMotion && (
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-lg opacity-0 blur-xl"
                      animate={{ 
                        opacity: [0, 0.4, 0],
                        scale: [0.9, 1.1, 0.9]
                      }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                  )}
                </Button>
              </motion.div>
            </Link>
            
            <motion.div
              variants={motionVariants.buttonAdvanced}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 text-base border-2 hover:border-primary/50 hover:bg-primary/5" 
                data-testid="cta-contact"
              >
                <motion.div
                  animate={shouldReduceMotion ? {} : { rotate: [0, 10, 0] }}
                  transition={shouldReduceMotion ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                </motion.div>
                Contact Sales
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ReportFlow</span>
              </div>
              <p className="text-muted-foreground">
                Smarter GitHub analytics for modern development teams.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#docs" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#api" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#careers" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#blog" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#terms" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#security" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/50 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground">
              © 2024 ReportFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#github" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                <Star className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}