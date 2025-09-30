import { motion } from "framer-motion";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { motionVariants } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "image" | "kpi";
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  lines?: number;
}

/**
 * Enhanced skeleton loader component with smooth animations
 */
export function SkeletonLoader({ 
  className,
  variant = "text",
  width,
  height,
  rounded = false,
  lines = 1
}: SkeletonLoaderProps) {
  const { reducedMotion } = useMotionPreferences();

  const baseClasses = cn(
    "bg-muted relative overflow-hidden",
    "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    rounded && "rounded-md",
    className
  );

  const motionProps = reducedMotion 
    ? {} 
    : {
        variants: motionVariants.skeleton,
        animate: "animate"
      };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // Text skeleton with multiple lines
  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            {...motionProps}
            className={cn(
              baseClasses,
              "h-4",
              i === lines - 1 && "w-3/4" // Last line is shorter
            )}
            style={{
              ...style,
              ...(i === lines - 1 && !width && { width: '75%' })
            }}
          />
        ))}
      </div>
    );
  }

  // Predefined variants
  const variantStyles = {
    text: "h-4 w-full",
    card: "h-32 w-full rounded-lg",
    avatar: "h-10 w-10 rounded-full",
    image: "h-48 w-full rounded-md",
    kpi: "h-24 w-full rounded-lg"
  };

  return (
    <motion.div
      {...motionProps}
      className={cn(
        baseClasses,
        variantStyles[variant]
      )}
      style={style}
    />
  );
}

/**
 * Predefined skeleton layouts for common components
 */
export function KPICardSkeleton({ index = 0 }: { index?: number }) {
  const { reducedMotion } = useMotionPreferences();
  const shouldAnimate = !reducedMotion;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, scale: 0.9, y: 20 } : {}}
      animate={shouldAnimate ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="p-6 border rounded-lg bg-card relative overflow-hidden"
    >
      {/* Enhanced shimmer overlay */}
      {shouldAnimate && (
        <div className="absolute inset-0 shimmer-effect-alt opacity-20 pointer-events-none" />
      )}
      
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          {/* Title skeleton */}
          <motion.div
            initial={shouldAnimate ? { width: 0 } : {}}
            animate={shouldAnimate ? { width: "60%" } : {}}
            transition={{ delay: 0.2 + (index * 0.1), duration: 0.4 }}
            className={cn(
              "h-3 bg-muted rounded",
              shouldAnimate && "shimmer-effect"
            )}
            style={{ animationDelay: `${0.5 + (index * 0.2)}s` }}
          />
          
          {/* Value skeleton */}
          <motion.div
            initial={shouldAnimate ? { width: 0, height: 24 } : {}}
            animate={shouldAnimate ? { width: "80%", height: 32 } : {}}
            transition={{ 
              delay: 0.4 + (index * 0.1), 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            className={cn(
              "bg-muted rounded font-bold",
              shouldAnimate && "shimmer-effect animate-pulse-glow"
            )}
            style={{ animationDelay: `${0.7 + (index * 0.2)}s` }}
          />
          
          {/* Change indicator skeleton */}
          <motion.div
            initial={shouldAnimate ? { width: 0 } : {}}
            animate={shouldAnimate ? { width: "45%" } : {}}
            transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
            className={cn(
              "h-4 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 rounded",
              shouldAnimate && "shimmer-effect"
            )}
            style={{ animationDelay: `${0.9 + (index * 0.2)}s` }}
          />
        </div>
        
        {/* Icon skeleton */}
        <motion.div
          initial={shouldAnimate ? { scale: 0, rotate: -90 } : {}}
          animate={shouldAnimate ? { scale: 1, rotate: 0 } : {}}
          transition={{ 
            delay: 0.3 + (index * 0.1),
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className={cn(
            "w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/40 rounded-xl",
            shouldAnimate && "shimmer-effect animate-float"
          )}
          style={{ animationDelay: `${1 + (index * 0.3)}s` }}
        />
      </div>
    </motion.div>
  );
}

export function ChartSkeleton({ chartType = "bar", animated = true }: { chartType?: "bar" | "line" | "area"; animated?: boolean }) {
  const { reducedMotion } = useMotionPreferences();
  const shouldAnimate = animated && !reducedMotion;

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20, scale: 0.95 } : {}}
      animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }}
      className="p-6 border rounded-lg bg-card overflow-hidden relative"
    >
      {/* Enhanced shimmer overlay */}
      {shouldAnimate && (
        <div className="absolute inset-0 shimmer-effect-alt opacity-30 pointer-events-none" />
      )}
      
      <div className="space-y-4">
        {/* Header with interactive elements skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className={cn(
              "h-4 bg-muted rounded w-32",
              shouldAnimate && "shimmer-effect"
            )} />
            <div className={cn(
              "h-3 bg-muted rounded w-48",
              shouldAnimate && "shimmer-effect"
            )} style={{ animationDelay: '0.1s' }} />
          </div>
          
          {/* Control buttons skeleton */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={shouldAnimate ? { scale: 0 } : {}}
                animate={shouldAnimate ? { scale: 1 } : {}}
                transition={{ delay: 0.3 + (i * 0.1) }}
                className={cn(
                  "w-8 h-8 bg-muted rounded",
                  shouldAnimate && "shimmer-effect"
                )}
                style={{ animationDelay: `${0.2 + (i * 0.1)}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Chart area skeleton */}
        <div className="relative h-64 bg-muted/20 rounded border overflow-hidden">
          {chartType === "bar" ? (
            <BarChartSkeleton animated={shouldAnimate} />
          ) : chartType === "line" ? (
            <LineChartSkeleton animated={shouldAnimate} />
          ) : (
            <AreaChartSkeleton animated={shouldAnimate} />
          )}
        </div>
        
        {/* Legend/Footer skeleton */}
        <div className="flex justify-between items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={shouldAnimate ? { opacity: 0, x: -10 } : {}}
              animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 + (i * 0.05) }}
              className={cn(
                "h-3 bg-muted rounded",
                shouldAnimate && "shimmer-effect"
              )}
              style={{ 
                width: `${12 + (Math.random() * 8)}%`,
                animationDelay: `${0.3 + (i * 0.1)}s`
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Specialized chart skeleton components
function BarChartSkeleton({ animated }: { animated: boolean }) {
  const barHeights = [0.3, 0.8, 0.5, 0.9, 0.4, 0.7, 0.6, 0.35, 0.75, 0.45];
  
  return (
    <div className="absolute inset-4 flex items-end justify-between">
      {barHeights.map((height, i) => (
        <motion.div
          key={i}
          initial={animated ? { scaleY: 0 } : {}}
          animate={animated ? { scaleY: height } : {}}
          transition={{ 
            delay: 0.1 + (i * 0.05), 
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            repeat: animated ? Infinity : 0,
            repeatType: "reverse",
            repeatDelay: 2
          }}
          className={cn(
            "bg-muted rounded-t flex-1 mx-0.5",
            animated && "chart-skeleton-bar"
          )}
          style={{ 
            height: `${height * 100}%`,
            transformOrigin: 'bottom',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

function LineChartSkeleton({ animated }: { animated: boolean }) {
  const points = Array.from({ length: 12 }, (_, i) => ({
    x: (i / 11) * 100,
    y: 20 + (Math.sin(i * 0.5) * 30) + (Math.random() * 20)
  }));
  
  const pathData = points.reduce((path, point, i) => {
    return path + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
  }, '');
  
  return (
    <div className="absolute inset-4">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.line
            key={`grid-${i}`}
            x1="0"
            y1={i * 25}
            x2="100"
            y2={i * 25}
            stroke="hsl(var(--muted-foreground) / 0.1)"
            strokeWidth="0.5"
            initial={animated ? { opacity: 0 } : {}}
            animate={animated ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.1 }}
          />
        ))}
        
        {/* Chart line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="hsl(var(--muted-foreground) / 0.3)"
          strokeWidth="2"
          className={animated ? "chart-skeleton-line" : ""}
          initial={animated ? { pathLength: 0 } : {}}
          animate={animated ? { pathLength: 1 } : {}}
          transition={{ 
            duration: 1.5, 
            ease: "easeInOut",
            repeat: animated ? Infinity : 0,
            repeatType: "reverse",
            repeatDelay: 1
          }}
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="1.5"
            fill="hsl(var(--muted-foreground) / 0.4)"
            initial={animated ? { scale: 0, opacity: 0 } : {}}
            animate={animated ? { scale: 1, opacity: 1 } : {}}
            transition={{ 
              delay: 0.5 + (i * 0.05),
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function AreaChartSkeleton({ animated }: { animated: boolean }) {
  const points = Array.from({ length: 10 }, (_, i) => ({
    x: (i / 9) * 100,
    y: 30 + (Math.sin(i * 0.7) * 25) + (Math.random() * 15)
  }));
  
  const pathData = points.reduce((path, point, i) => {
    return path + (i === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`);
  }, '') + ` L 100 100 L 0 100 Z`;
  
  return (
    <div className="absolute inset-4">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaSkeleton" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted-foreground) / 0.2)" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground) / 0.05)" />
          </linearGradient>
        </defs>
        
        <motion.path
          d={pathData}
          fill="url(#areaSkeleton)"
          stroke="hsl(var(--muted-foreground) / 0.3)"
          strokeWidth="1"
          initial={animated ? { scaleY: 0, opacity: 0 } : {}}
          animate={animated ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ 
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            repeat: animated ? Infinity : 0,
            repeatType: "reverse",
            repeatDelay: 1.5
          }}
          style={{ transformOrigin: 'bottom' }}
        />
      </svg>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-4">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonLoader 
          key={i} 
          variant="text" 
          width={i === 0 ? "25%" : i === columns - 1 ? "15%" : "20%"} 
        />
      ))}
    </div>
  );
}