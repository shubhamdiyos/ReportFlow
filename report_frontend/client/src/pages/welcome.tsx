import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/components/shared/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Moon, 
  Sun,
  Rocket,
  Users,
  BarChart3,
  Github,
  Heart,
  Star,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive insights into your GitHub repositories"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Manage and track your team's performance"
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Seamless connection to your repositories"
  }
];

const quickTips = [
  "Connect your first repository to see insights",
  "Explore the team dashboard to track productivity",
  "Set up custom reports for your workflows",
  "Invite more team members when you're ready"
];

export default function Welcome() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [showSecondaryContent, setShowSecondaryContent] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Show secondary content after main animation
    const timer1 = setTimeout(() => {
      setShowSecondaryContent(true);
    }, 1500);

    // Cycle through tips
    const timer2 = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % quickTips.length);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearInterval(timer2);
    };
  }, []);

  const handleGoToDashboard = () => {
    setLocation("/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const checkmarkVariants = {
    hidden: { 
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const floatingVariants = {
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden" data-testid="welcome-page">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-500/6 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
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

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      >
        <div className="text-center space-y-8">
          {/* Success Checkmark */}
          <motion.div variants={itemVariants} className="relative">
            <motion.div
              className="mx-auto w-32 h-32 relative"
              variants={checkmarkVariants}
            >
              {/* Pulse rings */}
              <motion.div
                className="absolute inset-0 bg-green-500/20 rounded-full"
                variants={pulseVariants}
                animate="pulse"
              />
              <motion.div
                className="absolute inset-2 bg-green-500/30 rounded-full"
                variants={pulseVariants}
                animate="pulse"
                transition={{ delay: 0.5 }}
              />
              
              {/* Main checkmark circle */}
              <div className="relative w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-16 h-16 text-white" strokeWidth={1.5} />
              </div>
              
              {/* Sparkles */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Message */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-green-600 via-primary to-purple-600 bg-clip-text text-transparent">
                You're all set!
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-muted-foreground">
              <span>Welcome to ReportFlow</span>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 2 }}
              >
                <Rocket className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
            {user && (
              <p className="text-lg text-muted-foreground">
                Hi <span className="font-semibold text-foreground">{user.name}</span>, 
                your account is ready to go!
              </p>
            )}
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              onClick={handleGoToDashboard}
              className="h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-go-to-dashboard"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Go to Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Secondary Content */}
          <AnimatePresence>
            {showSecondaryContent && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Quick Tips */}
                <motion.div
                  variants={floatingVariants}
                  animate="float"
                  className="max-w-2xl mx-auto"
                >
                  <Card className="bg-muted/20 border-border/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Quick Tip</span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={currentTip}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-muted-foreground"
                        >
                          {quickTips[currentTip]}
                        </motion.p>
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      <Card className="h-full bg-card/40 border-border/50 backdrop-blur-sm hover:bg-card/60 transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <feature.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="font-semibold mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                >
                  <span>Made with</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 2 }}
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </motion.div>
                  <span>for developers</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}