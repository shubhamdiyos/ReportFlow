import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, type Variants } from "framer-motion"
import { Loader2 } from "lucide-react"

import { cn, easingCurves, scaleValues } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover-glow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Animation variants for different button states
const buttonAnimationVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  },
  hover: {
    scale: scaleValues.lg,
    y: -2,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)",
    transition: {
      duration: 0.15,
      ease: easingCurves.easeOut,
    },
  },
  tap: {
    scale: scaleValues.md,
    y: 0,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    transition: {
      duration: 0.1,
      ease: easingCurves.easeOut,
    },
  },
  loading: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: easingCurves.easeInOut,
    },
  },
}

// Shimmer effect for loading state
const shimmerVariants: Variants = {
  loading: {
    x: ["-100%", "100%"],
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading
    
    // For asChild, we need to handle it differently since we can't wrap Slot with motion.button
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    // Separate motion-specific and HTML button props
    const { onDrag, onDragStart, onDragEnd, ...buttonProps } = props as any;

    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        variants={buttonAnimationVariants}
        initial="idle"
        whileHover={!isDisabled ? "hover" : "idle"}
        whileTap={!isDisabled ? "tap" : "idle"}
        animate={loading ? "loading" : "idle"}
        disabled={isDisabled}
        {...buttonProps}
      >
        {/* Loading shimmer effect overlay */}
        {loading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="loading"
            style={{ willChange: "transform" }}
          />
        )}
        
        {/* Button content */}
        <motion.div
          className="flex items-center justify-center gap-2"
          animate={{
            opacity: loading ? 0.7 : 1,
            transition: { duration: 0.2 },
          }}
        >
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="w-4 h-4 animate-spin" />
            </motion.div>
          )}
          
          <motion.span
            animate={{
              x: loading ? 4 : 0,
              transition: { duration: 0.2, ease: easingCurves.easeOut },
            }}
          >
            {loading && loadingText ? loadingText : children}
          </motion.span>
        </motion.div>
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
