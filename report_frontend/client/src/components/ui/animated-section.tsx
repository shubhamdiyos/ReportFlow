import { motion, HTMLMotionProps } from "framer-motion";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { motionVariants, createAdvancedStagger } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  stagger?: boolean;
  staggerDelay?: number;
  childDelay?: number;
  direction?: "normal" | "reverse";
  className?: string;
}

/**
 * Reusable animated section component with stagger support
 * Perfect for animating groups of content like KPI cards, lists, etc.
 */
export function AnimatedSection({ 
  children, 
  stagger = false,
  staggerDelay = 0.1,
  childDelay = 0.2,
  direction = "normal",
  className,
  ...props 
}: AnimatedSectionProps) {
  const { reducedMotion } = useMotionPreferences();
  
  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  if (stagger) {
    const staggerConfig = createAdvancedStagger(staggerDelay, childDelay, direction);
    
    return (
      <motion.div
        variants={staggerConfig.container}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn("", className)}
        style={{ willChange: 'transform' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={motionVariants.staggerItem}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn("", className)}
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual item within an animated section
 * Use this wrapper for items that should participate in stagger animations
 */
export function AnimatedItem({ 
  children, 
  className,
  ...props 
}: HTMLMotionProps<"div"> & { children: React.ReactNode; className?: string }) {
  const { reducedMotion } = useMotionPreferences();
  
  if (reducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      variants={motionVariants.staggerItem}
      className={cn("", className)}
      style={{ willChange: 'transform, opacity' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}