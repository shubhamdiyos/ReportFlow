import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { motionVariants } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  index?: number;
}

export default function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
  index = 0
}: KPICardProps) {
  const { reducedMotion } = useMotionPreferences();

  return (
    <motion.div
      variants={motionVariants.cardHoverAdvanced}
      initial="rest"
      whileHover={reducedMotion ? {} : "hover"}
      whileTap={reducedMotion ? {} : "tap"}
      className="group relative"
    >
      {/* Glassmorphism Card with Enhanced Shadows */}
      <Card 
        className={cn(
          // Base glassmorphism styles
          "relative overflow-hidden border-0",
          // Background with glassmorphism effect
          "bg-card/40 dark:bg-card/20",
          "backdrop-blur-xl backdrop-saturate-150",
          // Enhanced shadow system with multiple layers
          "shadow-sm",
          // Border highlight for premium feel
          "ring-1 ring-white/20 dark:ring-white/10",
          // Hover effects with progressive elevation
          "transition-all duration-300 ease-out",
          "hover:shadow-2xl hover:shadow-primary/10",
          "hover:ring-primary/20 dark:hover:ring-primary/30",
          "hover:bg-card/60 dark:hover:bg-card/30"
        )}
        data-testid={`kpi-${title.toLowerCase().replace(' ', '-')}`}
      >
        {/* Purple glow effect on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), hsla(250, 84%, 60%, 0.06), transparent 40%)",
          }}
        />
        
        {/* Enhanced border gradient */}
        <motion.div 
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(135deg, hsl(250 84% 60% / 0.1) 0%, transparent 50%, hsl(280 85% 65% / 0.1) 100%)",
            zIndex: -1,
            margin: "1px"
          }}
        />

        <CardContent className="relative p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.p 
                className="text-sm font-medium text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {title}
              </motion.p>
              <motion.p 
                className="text-3xl font-bold text-foreground group-hover:text-primary/90 transition-colors duration-300" 
                data-testid={`text-${title.toLowerCase().replace(' ', '-')}-value`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 100 }}
              >
                {value}
              </motion.p>
              <motion.p 
                className={cn(
                  "text-sm mt-1 transition-colors duration-200",
                  changeType === "positive" && "text-green-600 group-hover:text-green-500",
                  changeType === "negative" && "text-red-600 group-hover:text-red-500",
                  changeType === "neutral" && "text-muted-foreground group-hover:text-foreground/70"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <span data-testid={`text-${title.toLowerCase().replace(' ', '-')}-change`}>
                  {change}
                </span> from last month
              </motion.p>
            </div>
            
            {/* Enhanced icon container with glassmorphism */}
            <motion.div 
              className={cn(
                "relative w-14 h-14 rounded-2xl flex items-center justify-center",
                "backdrop-blur-sm border border-white/20 dark:border-white/10",
                "transition-all duration-300 ease-out",
                // Enhanced icon backgrounds with gradient overlays
                iconColor === "primary" && "bg-gradient-to-br from-primary/20 to-primary/10",
                iconColor === "blue-500" && "bg-gradient-to-br from-blue-500/20 to-blue-400/10",
                iconColor === "green-500" && "bg-gradient-to-br from-green-500/20 to-green-400/10",
                iconColor === "purple-500" && "bg-gradient-to-br from-purple-500/20 to-purple-400/10",
                // Hover effects for icon container
                "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20",
                "group-hover:border-primary/30"
              )}
              initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1 + 0.5, 
                type: "spring", 
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.15, 
                rotate: 10,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
            >
              {/* Icon glow effect */}
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300",
                  iconColor === "primary" && "bg-primary/20 shadow-lg shadow-primary/40",
                  iconColor === "blue-500" && "bg-blue-500/20 shadow-lg shadow-blue-500/40",
                  iconColor === "green-500" && "bg-green-500/20 shadow-lg shadow-green-500/40",
                  iconColor === "purple-500" && "bg-purple-500/20 shadow-lg shadow-purple-500/40"
                )}
              />
              
              <Icon className={cn(
                "w-7 h-7 relative z-10 transition-all duration-300",
                iconColor === "primary" && "text-primary group-hover:text-primary/90 group-hover:drop-shadow-sm",
                iconColor === "blue-500" && "text-blue-500 group-hover:text-blue-400 group-hover:drop-shadow-sm",
                iconColor === "green-500" && "text-green-500 group-hover:text-green-400 group-hover:drop-shadow-sm",
                iconColor === "purple-500" && "text-purple-500 group-hover:text-purple-400 group-hover:drop-shadow-sm"
              )} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
