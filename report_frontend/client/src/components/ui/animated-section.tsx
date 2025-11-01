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
  style,
  ...props 
}: AnimatedSectionProps) {
  const { reducedMotion } = useMotionPreferences();

  if (stagger) {
    const staggerConfig = createAdvancedStagger(staggerDelay, childDelay, direction);
    const motionConfig = reducedMotion
      ? {
          initial: false as const,
          animate: { opacity: 1 },
          exit: undefined,
          transition: { duration: 0 },
          variants: undefined
        }
      : {
          variants: staggerConfig.container,
          initial: "initial" as const,
          animate: "animate" as const,
          exit: "exit" as const
        };
    const containerStyle = reducedMotion ? style : { ...style, willChange: "transform" };
    
    return (
      <motion.div
        {...props}
        {...motionConfig}
        className={cn("", className)}
        style={containerStyle}
      >
        {children}
      </motion.div>
    );
  }

  const motionConfig = reducedMotion
    ? {
        initial: false as const,
        animate: { opacity: 1 },
        exit: undefined,
        transition: { duration: 0 },
        variants: undefined
      }
    : {
        variants: motionVariants.staggerItem,
        initial: "initial" as const,
        animate: "animate" as const,
        exit: "exit" as const
      };
  const itemStyle = reducedMotion ? style : { ...style, willChange: "transform, opacity" };

  return (
    <motion.div
      {...props}
      {...motionConfig}
      className={cn("", className)}
      style={itemStyle}
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
  style,
  ...props 
}: HTMLMotionProps<"div"> & { children: React.ReactNode; className?: string }) {
  const { reducedMotion } = useMotionPreferences();
  const motionConfig = reducedMotion
    ? {
        initial: false as const,
        animate: { opacity: 1 },
        exit: undefined,
        transition: { duration: 0 },
        variants: undefined
      }
    : {
        variants: motionVariants.staggerItem,
        initial: "initial" as const,
        animate: "animate" as const,
        exit: "exit" as const
      };
  const itemStyle = reducedMotion ? style : { ...style, willChange: "transform, opacity" };

  return (
    <motion.div
      {...props}
      {...motionConfig}
      className={cn("", className)}
      style={itemStyle}
    >
      {children}
    </motion.div>
  );
}