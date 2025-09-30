import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useWelcomeMessages } from "@/hooks/use-welcome-messages";
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Trophy, 
  Star,
  ChevronRight,
  X,
  User,
  Clock,
  Target
} from "lucide-react";

interface WelcomeMessageProps {
  variant?: "card" | "banner" | "inline" | "sidebar" | "compact";
  showDismiss?: boolean;
  showTips?: boolean;
  showAchievement?: boolean;
  showMotivation?: boolean;
  className?: string;
  autoRotate?: boolean;
  rotateInterval?: number;
  onDismiss?: () => void;
  onClick?: () => void;
}

export default function WelcomeMessage({
  variant = "card",
  showDismiss = false,
  showTips = true,
  showAchievement = true,
  showMotivation = true,
  className,
  autoRotate = false,
  rotateInterval = 8000,
  onDismiss,
  onClick
}: WelcomeMessageProps) {
  const { 
    personalizedMessage, 
    contextualTips, 
    achievementMessage,
    userName,
    userRole 
  } = useWelcomeMessages();
  
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Auto-rotate tips if enabled
  useEffect(() => {
    if (autoRotate && contextualTips.length > 1) {
      const interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % contextualTips.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [autoRotate, contextualTips.length, rotateInterval]);

  // Mark as animated after first render
  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 300);
  };

  if (!isVisible) return null;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const pulseVariants = {
    idle: { scale: 1 },
    pulse: {
      scale: [1, 1.02, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  // Role-based styling
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "from-red-500/20 to-pink-500/20 border-red-200 dark:border-red-800";
      case "manager":
        return "from-blue-500/20 to-indigo-500/20 border-blue-200 dark:border-blue-800";
      case "developer":
        return "from-green-500/20 to-emerald-500/20 border-green-200 dark:border-green-800";
      default:
        return "from-primary/20 to-primary/10 border-primary/20";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Trophy className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "manager":
        return <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case "developer":
        return <User className="w-4 h-4 text-green-600 dark:text-green-400" />;
      default:
        return <Star className="w-4 h-4 text-primary" />;
    }
  };

  // Content sections
  const renderGreeting = () => (
    <motion.div variants={itemVariants} className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {getRoleIcon(userRole)}
        <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight">
          {personalizedMessage.greeting}
        </h3>
      </div>
      <motion.div
        animate={hasAnimated ? "idle" : "pulse"}
        variants={pulseVariants}
      >
        <Sparkles className="w-4 h-4 text-yellow-500" />
      </motion.div>
    </motion.div>
  );

  const renderMessage = () => (
    <motion.p 
      variants={itemVariants} 
      className="text-sm sm:text-base text-muted-foreground leading-relaxed"
    >
      {personalizedMessage.message}
    </motion.p>
  );

  const renderAchievement = () => {
    if (!showAchievement || !achievementMessage) return null;
    
    return (
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200 dark:border-yellow-800 rounded-lg"
      >
        <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
          {achievementMessage}
        </span>
      </motion.div>
    );
  };

  const renderTips = () => {
    if (!showTips || contextualTips.length === 0) return null;
    
    return (
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-foreground">Pro Tip</span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={`tip-${currentTipIndex}-${contextualTips[currentTipIndex]?.slice(0, 10)}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground pl-6"
          >
            {contextualTips[currentTipIndex]}
          </motion.p>
        </AnimatePresence>
        {contextualTips.length > 1 && (
          <div className="flex items-center gap-1 pl-6">
            {contextualTips.map((_, index) => (
              <div
                key={`tip-indicator-${index}`}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors duration-200",
                  index === currentTipIndex
                    ? "bg-blue-500"
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  const renderMotivation = () => {
    if (!showMotivation || !personalizedMessage.motivation) return null;
    
    return (
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-2 p-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg"
      >
        <Target className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-sm font-medium text-primary">
          {personalizedMessage.motivation}
        </span>
      </motion.div>
    );
  };

  // Render different variants
  const renderCardVariant = () => (
    <Card className={cn(
      "border-2 shadow-lg hover:shadow-xl transition-all duration-300",
      `bg-gradient-to-br ${getRoleColor(userRole)}`,
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {renderGreeting()}
          {showDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="opacity-70 hover:opacity-100 h-6 w-6 p-0"
              data-testid="button-dismiss-welcome"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderMessage()}
        {renderAchievement()}
        {renderTips()}
        {renderMotivation()}
      </CardContent>
    </Card>
  );

  const renderBannerVariant = () => (
    <div className={cn(
      "p-4 border-2 rounded-xl shadow-sm",
      `bg-gradient-to-r ${getRoleColor(userRole)}`,
      className
    )}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-4">
            {renderGreeting()}
            {renderAchievement()}
          </div>
          {renderMessage()}
        </div>
        {showDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="opacity-70 hover:opacity-100"
            data-testid="button-dismiss-welcome"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );

  const renderInlineVariant = () => (
    <div className={cn("flex items-center gap-3 p-2", className)}>
      {getRoleIcon(userRole)}
      <span className="text-sm font-medium text-foreground">
        {personalizedMessage.greeting}
      </span>
      <span className="text-sm text-muted-foreground">
        {personalizedMessage.message}
      </span>
      {achievementMessage && (
        <Badge variant="secondary" className="text-xs">
          {achievementMessage.replace(/[🏆⭐🔥🎯]/g, '').trim()}
        </Badge>
      )}
    </div>
  );

  const renderSidebarVariant = () => (
    <div className={cn(
      "p-3 border rounded-lg space-y-2",
      `bg-gradient-to-br ${getRoleColor(userRole)}`,
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getRoleIcon(userRole)}
          <span className="text-sm font-semibold text-foreground">Welcome</span>
        </div>
        <Clock className="w-3 h-3 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {personalizedMessage.message}
      </p>
      {achievementMessage && (
        <div className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
          {achievementMessage}
        </div>
      )}
    </div>
  );

  const renderCompactVariant = () => (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg border",
      `bg-gradient-to-r ${getRoleColor(userRole)}`,
      onClick && "cursor-pointer hover:shadow-md transition-all duration-200",
      className
    )} onClick={onClick}>
      {getRoleIcon(userRole)}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {personalizedMessage.greeting}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {personalizedMessage.message}
        </p>
      </div>
      {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "banner":
        return renderBannerVariant();
      case "inline":
        return renderInlineVariant();
      case "sidebar":
        return renderSidebarVariant();
      case "compact":
        return renderCompactVariant();
      default:
        return renderCardVariant();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      data-testid="welcome-message"
    >
      {renderVariant()}
    </motion.div>
  );
}