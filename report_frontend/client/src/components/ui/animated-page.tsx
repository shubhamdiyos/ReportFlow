import { motion, HTMLMotionProps } from "framer-motion";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { motionVariants, getResponsiveAnimationConfig } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AnimatedPageProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "slide-right" | "slide-left" | "fade-scale";
  className?: string;
}

/**
 * Reusable animated page wrapper component
 * Handles sophisticated page transitions with motion preferences
 */
export function AnimatedPage({ 
  children, 
  variant = "default", 
  className,
  ...props 
}: AnimatedPageProps) {
  const { reducedMotion } = useMotionPreferences();
  const isMobile = useIsMobile();
  
  const getVariant = () => {
    if (reducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.1 }
      };
    }

    switch (variant) {
      case "slide-right":
        return motionVariants.slideFromRight;
      case "slide-left":
        return motionVariants.slideFromLeft;
      case "fade-scale":
        return motionVariants.pageTransitionAdvanced;
      default:
        return {
          initial: motionVariants.pageTransitionAdvanced.initial,
          animate: motionVariants.pageTransitionAdvanced.animate,
          exit: motionVariants.pageTransitionAdvanced.exit,
          transition: getResponsiveAnimationConfig(isMobile, reducedMotion)
        };
    }
  };

  return (
    <motion.div
      {...getVariant()}
      className={cn("min-h-full", className)}
      style={{ willChange: reducedMotion ? 'auto' : 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}