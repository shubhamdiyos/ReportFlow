import { motion } from "framer-motion";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { motionVariants } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse";
  className?: string;
  text?: string;
}

/**
 * Enhanced loading spinner with multiple variants and motion preferences
 */
export function LoadingSpinner({ 
  size = "md", 
  variant = "spinner",
  className,
  text
}: LoadingSpinnerProps) {
  const { reducedMotion } = useMotionPreferences();

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const dotSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  if (reducedMotion) {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <Loader2 className={cn(sizeClasses[size], "text-primary")} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <motion.div
          variants={motionVariants.loadingContainer}
          animate="animate"
          className="flex gap-1"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={motionVariants.loadingDot}
              className={cn(
                dotSizeClasses[size],
                "bg-primary rounded-full"
              )}
            />
          ))}
        </motion.div>
        {text && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={cn(
            sizeClasses[size],
            "bg-primary rounded-full"
          )}
        />
        {text && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground"
          >
            {text}
          </motion.span>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        className={cn(sizeClasses[size])}
      >
        <Loader2 className="w-full h-full text-primary" />
      </motion.div>
      {text && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          {text}
        </motion.span>
      )}
    </div>
  );
}