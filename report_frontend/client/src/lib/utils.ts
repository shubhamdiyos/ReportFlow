import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Animation utilities and constants
export const animationDurations = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 750,
  slowest: 1000,
} as const

export const easingCurves = {
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  spring: [0.175, 0.885, 0.32, 1.275],
} as const

export const scaleValues = {
  sm: 0.95,
  md: 0.97,
  lg: 1.02,
  xl: 1.05,
} as const

// Framer Motion presets for common animations
export const motionPresets = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: easingCurves.easeInOut },
  },
  
  pageTransitionSlide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: easingCurves.easeOut },
  },

  // Staggered children animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: easingCurves.easeOut },
  },

  // Button interactions
  buttonHover: {
    scale: scaleValues.lg,
    transition: { duration: 0.15, ease: easingCurves.easeOut },
  },

  buttonTap: {
    scale: scaleValues.md,
    transition: { duration: 0.1, ease: easingCurves.easeOut },
  },

  // Card interactions
  cardHover: {
    y: -4,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3, ease: easingCurves.easeOut },
  },

  // Loading states
  loadingPulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easingCurves.easeInOut,
    },
  },

  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },

  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: easingCurves.easeOut },
  },
} as const

// Helper function to create staggered animation variants
export function createStaggerVariants(staggerDelay = 0.1, childDelay = 0.1) {
  return {
    container: {
      animate: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: childDelay,
        },
      },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: easingCurves.easeOut },
      },
    },
  }
}

// Enhanced motion variants for sophisticated animations
export const motionVariants = {
  // Enhanced page transitions with multiple effects
  pageTransitionAdvanced: {
    initial: { 
      opacity: 0, 
      scale: 0.96, 
      y: 20,
      filter: "blur(4px)"
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { duration: 0.4 },
        filter: { duration: 0.3 }
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.02, 
      y: -20,
      filter: "blur(2px)",
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  },

  // Slide transitions with enhanced easing
  slideFromRight: {
    initial: { x: 100, opacity: 0, scale: 0.98 },
    animate: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        x: { type: "spring", stiffness: 300, damping: 30 }
      }
    },
    exit: { 
      x: -100, 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
    }
  },

  slideFromLeft: {
    initial: { x: -100, opacity: 0, scale: 0.98 },
    animate: { 
      x: 0, 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        x: { type: "spring", stiffness: 300, damping: 30 }
      }
    },
    exit: { 
      x: 100, 
      opacity: 0, 
      scale: 0.98,
      transition: { duration: 0.3, ease: [0.4, 0, 1, 1] }
    }
  },

  // Stagger container variants
  staggerContainer: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren"
      }
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  },

  // Stagger item variants with enhanced effects
  staggerItem: {
    initial: { 
      opacity: 0, 
      y: 30, 
      scale: 0.9,
      filter: "blur(4px)"
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94],
        filter: { duration: 0.4 }
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.9,
      filter: "blur(2px)",
      transition: { duration: 0.3 }
    }
  },

  // Card hover animations with enhanced depth
  cardHoverAdvanced: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      filter: "brightness(1)"
    },
    hover: { 
      scale: 1.02, 
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      filter: "brightness(1.05)",
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94],
        boxShadow: { duration: 0.4 }
      }
    },
    tap: { 
      scale: 0.98, 
      y: -4,
      transition: { duration: 0.1 }
    }
  },

  // Button interactions with micro-animations
  buttonAdvanced: {
    rest: { 
      scale: 1,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    tap: { 
      scale: 0.96,
      transition: { duration: 0.1, ease: [0.4, 0, 1, 1] }
    },
    focus: {
      boxShadow: "0 0 0 2px rgba(var(--primary), 0.2), 0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 }
    }
  },

  // Loading states with sophisticated animations
  loadingContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        repeat: Infinity,
        repeatType: "loop" as const,
        repeatDelay: 0.5
      }
    }
  },

  loadingDot: {
    animate: {
      y: [0, -10, 0],
      opacity: [0.4, 1, 0.4],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  },

  // Navigation animations
  navItemSlide: {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: { 
        duration: 0.3, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    },
    exit: { 
      x: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  },

  // Skeleton loading animations
  skeleton: {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Chart-specific loading states
  chartSkeleton: {
    container: {
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    },
    bar: {
      animate: {
        scaleY: [0.3, 1, 0.3],
        opacity: [0.3, 0.6, 0.3],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    line: {
      animate: {
        pathLength: [0, 1, 0],
        opacity: [0.3, 0.7, 0.3],
        transition: {
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  }
}

// Performance-optimized animation configuration
export const performanceConfig = {
  // Reduce animations on low-end devices
  respectReducedMotion: true,
  // Optimize for 60fps
  layoutId: true,
  // Use GPU acceleration
  style: { willChange: 'transform, opacity' },
  // Enable hardware acceleration
  transformTemplate: ({ x, y, scale, rotate }: any) => 
    `translate3d(${x}, ${y}, 0) scale(${scale}) rotate(${rotate})`,
}

// Enhanced stagger configuration generator
export function createAdvancedStagger(
  staggerDelay = 0.1,
  childDelay = 0.2,
  direction: 'normal' | 'reverse' = 'normal'
) {
  return {
    container: {
      animate: {
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: childDelay,
          staggerDirection: direction === 'reverse' ? -1 : 1,
          when: "beforeChildren"
        }
      }
    },
    item: motionVariants.staggerItem
  }
}

// Chart-specific animation configurations
export const chartAnimations = {
  // Recharts animation configurations
  recharts: {
    // Data entry animations
    dataEntry: {
      animationBegin: 0,
      animationDuration: 800,
      animationEasing: 'ease-out'
    },
    // Data update animations
    dataUpdate: {
      animationBegin: 0,
      animationDuration: 600,
      animationEasing: 'ease-in-out'
    },
    // Chart appearance animations
    chartAppear: {
      animationBegin: 200,
      animationDuration: 1000,
      animationEasing: 'ease-out'
    },
    // Tooltip animations
    tooltip: {
      animationDuration: 150,
      animationEasing: 'ease-out'
    }
  },
  
  // Chart type morphing
  morphing: {
    bar: {
      initial: { scaleY: 0, opacity: 0 },
      animate: { scaleY: 1, opacity: 1 },
      exit: { scaleY: 0, opacity: 0 },
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    line: {
      initial: { pathLength: 0, opacity: 0 },
      animate: { pathLength: 1, opacity: 1 },
      exit: { pathLength: 0, opacity: 0 },
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    area: {
      initial: { scaleY: 0, opacity: 0, transformOrigin: 'bottom' },
      animate: { scaleY: 1, opacity: 1 },
      exit: { scaleY: 0, opacity: 0 },
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  },

  // Data point highlighting
  dataPoint: {
    rest: { 
      scale: 1, 
      r: 4,
      stroke: 'var(--chart-primary)',
      strokeWidth: 2,
      fill: 'var(--background)'
    },
    hover: { 
      scale: 1.5, 
      r: 6,
      strokeWidth: 3,
      fill: 'var(--chart-primary)',
      boxShadow: '0 0 20px var(--chart-primary)',
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    active: {
      scale: 1.3,
      r: 5,
      strokeWidth: 3,
      fill: 'var(--chart-primary)',
      transition: { duration: 0.15 }
    }
  },

  // Chart container animations
  container: {
    loading: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    dataChange: {
      initial: { opacity: 1 },
      animate: { 
        opacity: [1, 0.7, 1],
        scale: [1, 0.98, 1],
        transition: { duration: 0.6, ease: 'easeInOut' }
      }
    }
  },

  // Tooltip animations
  tooltip: {
    initial: { 
      opacity: 0, 
      scale: 0.8, 
      y: 10,
      filter: 'blur(4px)'
    },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.2, 
        ease: [0.25, 0.46, 0.45, 0.94],
        filter: { duration: 0.1 }
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: -5,
      filter: 'blur(2px)',
      transition: { duration: 0.15 }
    }
  }
} as const

// Chart skeleton configurations
export const chartSkeletonConfig = {
  bar: {
    bars: 8,
    height: 300,
    barHeights: [0.3, 0.8, 0.5, 0.9, 0.4, 0.7, 0.6, 0.35]
  },
  line: {
    points: 12,
    height: 300,
    pathPattern: 'smooth'
  },
  pie: {
    segments: 6,
    radius: 100
  }
} as const

// Responsive animation configuration
export function getResponsiveAnimationConfig(isMobile: boolean, reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      duration: 0,
      ease: "linear",
      scale: { duration: 0 },
      opacity: { duration: 0.1 }
    }
  }

  if (isMobile) {
    return {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      scale: { duration: 0.3 },
      opacity: { duration: 0.3 }
    }
  }

  return {
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94],
    scale: { duration: 0.4 },
    opacity: { duration: 0.4 }
  }
}

// Generate responsive chart animation config
export function getChartAnimationConfig(
  reducedMotion: boolean, 
  prefersSlowAnimations: boolean
) {
  if (reducedMotion) {
    return {
      animationDuration: 0,
      animationEasing: 'linear',
      tooltip: { animationDuration: 0 },
      dataEntry: { animationDuration: 0 },
      dataUpdate: { animationDuration: 0 }
    }
  }

  const multiplier = prefersSlowAnimations ? 1.5 : 1
  
  return {
    animationDuration: Math.round(chartAnimations.recharts.dataEntry.animationDuration * multiplier),
    animationEasing: chartAnimations.recharts.dataEntry.animationEasing,
    tooltip: {
      animationDuration: Math.round(chartAnimations.recharts.tooltip.animationDuration * multiplier)
    },
    dataEntry: {
      ...chartAnimations.recharts.dataEntry,
      animationDuration: Math.round(chartAnimations.recharts.dataEntry.animationDuration * multiplier)
    },
    dataUpdate: {
      ...chartAnimations.recharts.dataUpdate,
      animationDuration: Math.round(chartAnimations.recharts.dataUpdate.animationDuration * multiplier)
    }
  }
}
