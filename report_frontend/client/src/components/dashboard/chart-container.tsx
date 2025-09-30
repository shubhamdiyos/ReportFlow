import React, { useState, useEffect, useRef, useMemo, useCallback, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Eye,
  Activity,
  GitCommit,
  GitPullRequest,
  MessageSquare,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Download,
  FileImage,
  FileSpreadsheet,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MousePointer,
  Target,
  Layers,
  Filter,
  Link2,
  Brush,
  MoreVertical,
  Maximize2,
  Settings,
  RefreshCw
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  ReferenceLine,
  Brush as RechartsBrush,
  Legend
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartData, ChartDrillDownData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";
import { chartAnimations, getChartAnimationConfig, cn, motionVariants, motionPresets } from "@/lib/utils";
import { ChartSkeleton } from "@/components/ui/skeleton-loader";
import { 
  useChartInteractions, 
  useChartExport, 
  useChartLinking
} from "@/hooks/use-chart-interactions";
import { useToast } from "@/hooks/use-toast";

interface ChartContainerProps {
  title: string;
  description: string;
  data: ChartData[];
  type: "line" | "bar" | "area";
  dataKey: string;
  color?: string;
  enableLiveUpdates?: boolean;
  liveUpdateInterval?: number;
  onDataUpdate?: (newData: ChartData[]) => void;
  allowTypeSwitch?: boolean;
  isLoading?: boolean;
  showComparison?: boolean;
  comparisonData?: ChartData[];
  comparisonMode?: boolean;
  height?: number;
  // Missing props from dashboard
  onBrushChange?: (range: [number, number] | null) => void;
  linkedSelections?: ChartData[];
  exportFileName?: string;
  enableDrillDown?: boolean;
  onAddAnnotation?: (annotation: any) => void;
  // Enhanced interaction props
  enableZoom?: boolean;
  enablePan?: boolean;
  enableBrush?: boolean;
  enableMultiSelect?: boolean;
  enableCrosshair?: boolean;
  enableExport?: boolean;
  enableAnnotations?: boolean;
  enableLinking?: boolean;
  linkedCharts?: string[];
  chartId?: string;
  onPointClick?: (point: ChartData, index: number) => void;
  onSelectionChange?: (selectedPoints: ChartData[]) => void;
  onZoomChange?: (transform: { x: number; y: number; k: number }) => void;
  customColors?: string[];
  showLegend?: boolean;
  annotations?: Array<{
    x: number | string;
    y?: number;
    label: string;
    color?: string;
  }>;
}

const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(({
  title,
  description,
  data: initialData,
  type: initialType,
  dataKey,
  color = "hsl(var(--primary))",
  enableLiveUpdates = false,
  liveUpdateInterval = 30000,
  onDataUpdate,
  allowTypeSwitch = true,
  isLoading = false,
  showComparison = false,
  comparisonData,
  comparisonMode = false,
  height = 256,
  // Enhanced interaction props
  enableZoom = false,
  enablePan = false,
  enableBrush = false,
  enableMultiSelect = false,
  enableCrosshair = true,
  enableExport = true,
  enableAnnotations = false,
  enableLinking = false,
  linkedCharts = [],
  chartId,
  onPointClick,
  onSelectionChange,
  onZoomChange,
  customColors = [],
  showLegend = false,
  annotations = []
}: ChartContainerProps, ref) => {
  const [data, setData] = useState(initialData);
  const [currentType, setCurrentType] = useState(initialType);
  const [selectedPoint, setSelectedPoint] = useState<ChartData | null>(null);
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [isLive, setIsLive] = useState(enableLiveUpdates);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [brushEnabled, setBrushEnabled] = useState(enableBrush);
  const [crosshairEnabled, setCrosshairEnabled] = useState(enableCrosshair);
  const [internalComparisonMode, setInternalComparisonMode] = useState(comparisonMode || false);
  const [selectedColors, setSelectedColors] = useState(customColors.length > 0 ? customColors : [color]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [interactionDropdownOpen, setInteractionDropdownOpen] = useState(false);
  
  const { reducedMotion, prefersSlowAnimations } = useMotionPreferences();
  const animationConfig = getChartAnimationConfig(reducedMotion, prefersSlowAnimations);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Enhanced hooks for interactions
  const chartInteractions = useChartInteractions(
    data,
    {
      enableZoom,
      enablePan,
      enableBrush: brushEnabled,
      enableMultiSelect,
      enableCrosshair: crosshairEnabled,
      enableComparison: showComparison || internalComparisonMode
    },
    {
      onDataPointClick: (point, index) => {
        // Handle drill-down functionality directly
        setSelectedPoint(point);
        if (point.drillDown) {
          setShowDrillDown(true);
        }
        onPointClick?.(point, index);
      },
      onSelectionChange: (selectedPoints) => {
        onSelectionChange?.(selectedPoints);
      },
      onZoomChange: (transform) => {
        onZoomChange?.(transform);
      }
    }
  );
  
  const chartExport = useChartExport(containerRef, title);
  const chartLinking = useChartLinking(chartId || title);
  
  // Efficient data comparison using useMemo to avoid JSON.stringify
  const dataHasChanged = useMemo(() => {
    if (initialData.length !== data.length) return true;
    
    return initialData.some((item, index) => {
      const currentItem = data[index];
      return !currentItem || 
        item.name !== currentItem.name ||
        item.value !== currentItem.value ||
        item.date !== currentItem.date ||
        item.trend !== currentItem.trend;
    });
  }, [initialData, data]);
  
  // Cleanup function for DOM style mutations
  const cleanupDOMStyles = useCallback(() => {
    if (containerRef.current) {
      const chartWrapper = containerRef.current.querySelector('.recharts-wrapper') as HTMLElement;
      if (chartWrapper) {
        chartWrapper.style.transform = '';
        chartWrapper.style.opacity = '';
        chartWrapper.style.transition = '';
      }
      // Reset container styles
      containerRef.current.style.transform = '';
      containerRef.current.style.transition = '';
    }
  }, []);

  // Live updates simulation with smooth transitions (fixed dependencies to avoid timer churn)
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Use callback to get current data state to avoid dependencies
      setData(currentData => {
        const updatedData = currentData.map(item => {
          const variation = Math.floor(Math.random() * 10) - 5;
          const newValue = Math.max(0, item.value + variation);
          const newChangePercent = item.previousValue ? 
            ((newValue - item.previousValue) / item.previousValue) * 100 : 0;
          
          return {
            ...item,
            value: newValue,
            changePercent: newChangePercent,
            trend: newChangePercent > 5 ? "up" as const : 
                  newChangePercent < -5 ? "down" as const : "stable" as const,
            details: item.details ? {
              ...item.details,
              commits: item.details.commits! + Math.floor(Math.random() * 3),
              pullRequests: item.details.pullRequests! + Math.floor(Math.random() * 2)
            } : undefined
          };
        });
        
        // Call update callback and reset transition state
        setTimeout(() => {
          onDataUpdate?.(updatedData);
          setIsTransitioning(false);
        }, reducedMotion ? 0 : 100);
        
        return updatedData;
      });
    }, liveUpdateInterval);

    return () => {
      clearInterval(interval);
      // Cleanup transition state
      setIsTransitioning(false);
    };
  }, [isLive, liveUpdateInterval, onDataUpdate, reducedMotion]);

  // Enhanced smooth data transition when external data changes with accessibility support
  useEffect(() => {
    if (dataHasChanged) {
      setIsTransitioning(true);
      
      // Staggered data update for smoother animation (respects motion preferences)
      const updateData = async () => {
        try {
          if (!reducedMotion) {
            // First, fade out old data
            await new Promise(resolve => setTimeout(resolve, 150));
          }
          
          // Update data
          setData(initialData);
          
          if (!reducedMotion) {
            // Fade in new data
            await new Promise(resolve => setTimeout(resolve, 150));
          }
        } catch (error) {
          console.warn('Data transition animation failed:', error);
        } finally {
          setIsTransitioning(false);
        }
      };
      
      updateData();
    }
  }, [dataHasChanged, initialData, reducedMotion]);

  // Enhanced chart type switching with morphing animation and proper cleanup
  const handleTypeSwitch = (newType: "line" | "bar" | "area") => {
    if (newType === currentType || !allowTypeSwitch) return;
    
    setIsTransitioning(true);
    
    // Show morphing animation with accessibility support
    const morphAnimation = async () => {
      try {
        if (!reducedMotion) {
          // Phase 1: Scale down and fade current chart
          if (containerRef.current) {
            const chartArea = containerRef.current.querySelector('.recharts-wrapper') as HTMLElement;
            if (chartArea) {
              chartArea.style.transform = 'scale(0.95)';
              chartArea.style.opacity = '0.7';
              chartArea.style.transition = 'all 0.2s ease';
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Phase 2: Switch type
        setCurrentType(newType);
        
        if (!reducedMotion) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Phase 3: Scale up and fade in new chart
          if (containerRef.current) {
            const chartArea = containerRef.current.querySelector('.recharts-wrapper') as HTMLElement;
            if (chartArea) {
              chartArea.style.transform = 'scale(1)';
              chartArea.style.opacity = '1';
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.warn('Chart type switch animation failed:', error);
      } finally {
        // Ensure cleanup happens regardless of success/failure
        cleanupDOMStyles();
        setIsTransitioning(false);
      }
    };
    
    if (!reducedMotion) {
      morphAnimation();
    } else {
      setCurrentType(newType);
      setIsTransitioning(false);
    }
  };


  const handleMouseEnter = (data: any, index: number) => {
    setHoveredIndex(index);
    if (!reducedMotion) {
      // Add subtle pulse animation to container
      if (containerRef.current) {
        containerRef.current.style.transform = 'scale(1.001)';
        containerRef.current.style.transition = 'transform 0.2s ease';
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    if (!reducedMotion) {
      // Reset container scale
      if (containerRef.current) {
        containerRef.current.style.transform = 'scale(1)';
      }
    }
  };
  
  // Cleanup effect for DOM styles when component unmounts
  useEffect(() => {
    return () => {
      cleanupDOMStyles();
    };
  }, [cleanupDOMStyles]);

  // Enhanced dropdown state management with keyboard and cleanup
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && interactionDropdownOpen) {
        setInteractionDropdownOpen(false);
        event.stopPropagation();
      }
    };

    if (interactionDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown, { capture: true });
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.body.style.overflow = '';
    };
  }, [interactionDropdownOpen]);

  // Cleanup dropdown state when chart interactions are active
  useEffect(() => {
    if (chartInteractions.state.selectedPoints.length > 0 || chartInteractions.state.zoomTransform.k !== 1) {
      setInteractionDropdownOpen(false);
    }
  }, [chartInteractions.state.selectedPoints, chartInteractions.state.zoomTransform.k]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      case "down":
        return <TrendingDown className="w-3 h-3 text-red-500" />;
      default:
        return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };


  // Enhanced chart export functions with animation feedback
  const handleExportCSV = useCallback(async () => {
    setIsTransitioning(true);
    try {
      await chartExport.exportToCSV(data, `${title}-data`);
      toast({
        title: "Export Successful",
        description: "Chart data exported to CSV successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed", 
        description: "Failed to export chart data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [chartExport, data, title, toast]);

  const handleExportPNG = useCallback(async () => {
    setIsTransitioning(true);
    try {
      await chartExport.exportToPNG(`${title}-chart`);
      toast({
        title: "Export Successful",
        description: "Chart exported as PNG successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export chart as PNG. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [chartExport, title, toast]);

  // Enhanced filtering
  const filteredData = useMemo(() => {
    if (!filterValue) return data;
    return data.filter(item => 
      item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      (item.details && Object.values(item.details).some(value => 
        String(value).toLowerCase().includes(filterValue.toLowerCase())
      ))
    );
  }, [data, filterValue]);

  // Enhanced color management
  const getDataPointColor = useCallback((item: ChartData, index: number) => {
    if (selectedColors.length > 1) {
      return selectedColors[index % selectedColors.length];
    }
    if (item.trend === "up") return "#10b981";
    if (item.trend === "down") return "#ef4444";
    return selectedColors[0] || color;
  }, [selectedColors, color]);

  // Chart linking effects
  useEffect(() => {
    if (!enableLinking || linkedCharts.length === 0) return;

    chartLinking.linkCharts(linkedCharts);
    
    const unsubscribe = chartLinking.subscribeToUpdates((update) => {
      // Handle linked chart updates
      if (update.type === 'selection') {
        // Sync selection state
      } else if (update.type === 'zoom') {
        // Sync zoom state
      }
    });

    return unsubscribe;
  }, [enableLinking, linkedCharts, chartLinking]);

  // Enhanced tooltip with stagger effects
  const EnhancedTooltip = ({ active, payload, label, coordinate }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload as ChartData;
    const isMultiSelect = chartInteractions.state.selectedPoints.length > 1;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.9, 
            y: -5,
            transition: { duration: 0.15 }
          }}
          className="bg-background border border-border rounded-lg p-3 shadow-xl min-w-[250px] backdrop-blur-sm"
          style={{
            background: 'rgba(var(--background), 0.95)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              {crosshairEnabled && <Target className="w-3 h-3" />}
              {label}
            </h4>
            <div className="flex items-center gap-1">
              {getTrendIcon(data.trend)}
              <span className={`text-xs font-medium ${getTrendColor(data.trend)}`}>
                {data.changePercent ? `${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(1)}%` : ''}
              </span>
            </div>
          </div>
          
          <motion.div 
            className="space-y-1 text-xs"
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
          >
            <motion.div 
              variants={{
                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 }
              }}
              className="flex items-center justify-between"
            >
              <span className="text-muted-foreground">Current:</span>
              <span className="font-medium">{payload[0].value}</span>
            </motion.div>
            
            {data.previousValue && (
              <motion.div 
                variants={{
                  initial: { opacity: 0, x: -10 },
                  animate: { opacity: 1, x: 0 }
                }}
                className="flex items-center justify-between"
              >
                <span className="text-muted-foreground">Previous:</span>
                <span>{data.previousValue}</span>
              </motion.div>
            )}
            
            {data.details && (
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 5 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="border-t pt-2 mt-2 space-y-1"
              >
                {Object.entries(data.details).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    variants={{
                      initial: { opacity: 0, x: -5 },
                      animate: { 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.02 }
                      }
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1">
                      {key === 'commits' && <GitCommit className="w-3 h-3" />}
                      {key === 'pullRequests' && <GitPullRequest className="w-3 h-3" />}
                      {key === 'reviewComments' && <MessageSquare className="w-3 h-3" />}
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    </div>
                    <span>{value}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {isMultiSelect && (
              <motion.div
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { opacity: 1, scale: 1 }
                }}
                className="text-xs text-blue-500 mt-2 pt-2 border-t flex items-center gap-1"
              >
                <Layers className="w-3 h-3" />
                {chartInteractions.state.selectedPoints.length} points selected
              </motion.div>
            )}
            
            {data.drillDown && (
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 5 },
                  animate: { opacity: 1, y: 0 }
                }}
                className="text-xs text-blue-500 mt-2 pt-2 border-t flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                Click to view details
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Crosshair component
  const CrosshairLines = () => {
    if (!crosshairEnabled || !chartInteractions.state.crosshairPosition) return null;

    const { x, y } = chartInteractions.state.crosshairPosition;
    
    return (
      <>
        <ReferenceLine x={x} stroke="#888" strokeDasharray="3 3" strokeOpacity={0.5} />
        <ReferenceLine y={y} stroke="#888" strokeDasharray="3 3" strokeOpacity={0.5} />
      </>
    );
  };

  // Enhanced loading state with staggered animations
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <ChartSkeleton chartType={initialType} animated={!reducedMotion} />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      {...(reducedMotion ? {} : motionPresets.fadeIn)}
      className="relative"
    >
      <Card 
        ref={containerRef}
        className={cn(
          "relative overflow-hidden transition-all duration-500 ease-out",
          isTransitioning && "opacity-80 scale-[0.998] ring-2 ring-primary/20",
          hoveredIndex !== null && !reducedMotion && "shadow-lg transform-gpu"
        )} 
        data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}
        style={{
          willChange: 'transform, opacity, box-shadow',
          backfaceVisibility: 'hidden'
        }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              {title}
              <AnimatePresence>
                {isTransitioning && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      rotate: [0, 360]
                    }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ 
                      scale: { duration: 0.2 },
                      opacity: { duration: 0.2 },
                      rotate: { duration: 1, ease: "linear", repeat: Infinity }
                    }}
                    className="w-3 h-3 flex items-center justify-center"
                  >
                    <Activity className="w-3 h-3 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {chartInteractions.state.selectedPoints.length > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, x: -10 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0, x: -10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {chartInteractions.state.selectedPoints.length} selected
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardTitle>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Enhanced Chart Controls */}
            {(enableZoom || enablePan) && (
              <div className="flex items-center border rounded-md p-0.5 mr-1">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "hsl(var(--muted))",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={chartInteractions.controls.resetZoom}
                  className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  data-testid="reset-zoom"
                  title="Reset Zoom"
                  style={{ willChange: 'transform, background-color, box-shadow' }}
                >
                  <RotateCcw className="w-3 h-3" />
                </motion.button>
              </div>
            )}
            
            {/* Filter Input */}
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "hsl(var(--muted))",
                    rotate: [0, -2, 2, 0],
                    transition: { rotate: { duration: 0.3 } }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  data-testid="filter-chart"
                  style={{ willChange: 'transform, background-color' }}
                >
                  <Filter className="w-3 h-3" />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter Data</label>
                  <input
                    type="text"
                    placeholder="Search data points..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                  {filterValue && (
                    <p className="text-xs text-muted-foreground">
                      Showing {filteredData.length} of {data.length} points
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Chart type switcher */}
            {allowTypeSwitch && (
              <div className="flex items-center border rounded-md p-0.5">
                {(['line', 'bar', 'area'] as const).map((chartType) => {
                  const Icon = {
                    line: LineChartIcon,
                    bar: BarChart3,
                    area: PieChartIcon
                  }[chartType];
                  
                  return (
                    <motion.button
                      key={chartType}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTypeSwitch(chartType)}
                      className={cn(
                        "p-1.5 rounded-sm transition-colors duration-200",
                        currentType === chartType
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      data-testid={`switch-to-${chartType}`}
                    >
                      <Icon className="w-3 h-3" />
                    </motion.button>
                  );
                })}
              </div>
            )}
            
            {/* Interactive Features Toggle */}
            <DropdownMenu open={interactionDropdownOpen} onOpenChange={setInteractionDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  data-testid="interaction-controls"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInteractionDropdownOpen(!interactionDropdownOpen);
                  }}
                >
                  <MousePointer className="w-3 h-3" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 z-50"
                onCloseAutoFocus={(event) => {
                  // Prevent focus from going to chart area on close
                  event.preventDefault();
                }}
                onEscapeKeyDown={() => {
                  setInteractionDropdownOpen(false);
                }}
                onPointerDownOutside={(event) => {
                  // Allow clicking on chart elements to close dropdown
                  setInteractionDropdownOpen(false);
                }}
                onInteractOutside={(event) => {
                  // Ensure dropdown closes when interacting with chart
                  setInteractionDropdownOpen(false);
                }}
              >
                <DropdownMenuLabel>Interaction Features</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={brushEnabled}
                  onCheckedChange={setBrushEnabled}
                  disabled={!enableBrush}
                >
                  <Brush className="w-4 h-4 mr-2" />
                  Brush Selection
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={crosshairEnabled}
                  onCheckedChange={setCrosshairEnabled}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Crosshair Cursor
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={internalComparisonMode}
                  onCheckedChange={setInternalComparisonMode}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Comparison Mode
                </DropdownMenuCheckboxItem>
                {enableLinking && (
                  <DropdownMenuCheckboxItem
                    checked={chartLinking.linkedCharts.length > 1}
                    onCheckedChange={() => {
                      if (chartLinking.linkedCharts.length > 1) {
                        chartLinking.unlinkCharts();
                      } else {
                        chartLinking.linkCharts(linkedCharts);
                      }
                    }}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Chart Linking
                  </DropdownMenuCheckboxItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Export Options */}
            {enableExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "hsl(var(--muted))",
                      y: -1,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    data-testid="export-chart"
                    disabled={chartExport.isExporting}
                    style={{ willChange: 'transform, background-color, box-shadow' }}
                  >
                    <AnimatePresence mode="wait">
                      {chartExport.isExporting ? (
                        <motion.div
                          key="exporting"
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: 1, rotate: 360 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ 
                            scale: { duration: 0.2 },
                            rotate: { duration: 1, ease: "linear", repeat: Infinity }
                          }}
                        >
                          <RefreshCw className="w-3 h-3" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="download"
                          initial={{ scale: 0, y: -5 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, y: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        >
                          <Download className="w-3 h-3" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Chart</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPNG}>
                    <FileImage className="w-4 h-4 mr-2" />
                    Export as PNG
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Live updates toggle */}
            {enableLiveUpdates && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="sm"
                  variant={isLive ? "default" : "outline"}
                  onClick={() => setIsLive(!isLive)}
                  className="h-7 px-2 text-xs"
                  data-testid="toggle-live-updates"
                >
                  <Activity className={`w-3 h-3 mr-1 ${isLive ? 'animate-pulse' : ''}`} />
                  {isLive ? 'Live' : 'Static'}
                </Button>
              </motion.div>
            )}
            
            {/* Settings */}
            <DropdownMenu open={showSettings} onOpenChange={setShowSettings}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "hsl(var(--muted))",
                    rotate: [0, 45, 0],
                    transition: { rotate: { duration: 0.4 } }
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="p-1.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  data-testid="chart-settings"
                  style={{ willChange: 'transform, background-color' }}
                >
                  <Settings className="w-3 h-3" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Chart Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => chartInteractions.controls.clearSelections()}>
                  Clear Selection
                </DropdownMenuItem>
                {enableBrush && (
                  <DropdownMenuItem onClick={chartInteractions.controls.clearBrush}>
                    Clear Brush
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={chartInteractions.controls.resetZoom}>
                  Reset View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 relative">
          {/* Selection Summary */}
          <AnimatePresence>
            {chartInteractions.state.selectedPoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  <span>{chartInteractions.state.selectedPoints.length} selected</span>
                  <button 
                    onClick={chartInteractions.controls.clearSelections}
                    className="text-muted-foreground hover:text-foreground ml-1"
                  >
                    ×
                  </button>
                </div>
                {comparisonMode && chartInteractions.state.selectedPoints.length > 1 && (
                  <div className="mt-1 text-muted-foreground">
                    Comparison mode active
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className={cn(
              "h-48 sm:h-64 relative", 
              crosshairEnabled && "cursor-crosshair",
              interactionDropdownOpen && "pointer-events-none"
            )}
            style={{ 
              height,
              pointerEvents: interactionDropdownOpen ? 'none' : 'auto'
            }}
            onClick={() => {
              if (interactionDropdownOpen) {
                setInteractionDropdownOpen(false);
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              {currentType === "line" ? (
                <LineChart 
                  data={filteredData} 
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      const pointData = data.activePayload[0].payload as ChartData;
                      chartInteractions.handlers.onDataPointClick(pointData, data.activeTooltipIndex || 0);
                    }
                  }}
                  onMouseMove={chartInteractions.handlers.onMouseMove as any}
                  onMouseLeave={chartInteractions.handlers.onMouseLeave}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    opacity={0.3}
                    stroke="currentColor"
                    className="text-muted-foreground/20"
                  />
                  <XAxis 
                    dataKey="name" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                    width={50}
                  />
                  <Tooltip 
                    content={<EnhancedTooltip />} 
                    animationDuration={reducedMotion ? 0 : 200}
                    animationEasing="ease-out"
                    position={{ x: undefined, y: undefined }}
                    allowEscapeViewBox={{ x: true, y: true }}
                    offset={10}
                  />
                  {showLegend && <Legend />}
                  
                  {/* Annotations */}
                  {annotations.map((annotation, index) => (
                    <ReferenceLine
                      key={`annotation-${index}`}
                      x={annotation.x}
                      y={annotation.y}
                      stroke={annotation.color || "#666"}
                      strokeDasharray="5 5"
                      label={{
                        value: annotation.label,
                        position: "top" as any,
                        style: { 
                          fontSize: 10, 
                          fill: annotation.color || "#666",
                          fontWeight: 500
                        }
                      }}
                    />
                  ))}
                  
                  {/* Crosshair */}
                  <CrosshairLines />
                  
                  <Line 
                    type="monotone" 
                    dataKey={dataKey} 
                    stroke={selectedColors[0] || color} 
                    strokeWidth={2.5}
                    dot={(props: any) => {
                      const { payload, cx, cy, index } = props;
                      const isSelected = chartInteractions.state.selectedPoints.some(p => p.name === payload.name);
                      const isHovered = chartInteractions.state.hoveredIndex === index;
                      
                      return (
                        <motion.circle
                          key={`dot-${index}`}
                          cx={cx || 0}
                          cy={cy || 0}
                          r={isHovered ? 7 : isSelected ? 6 : 4}
                          fill={getDataPointColor(payload, index)}
                          stroke="white"
                          strokeWidth={isSelected ? 3 : 2}
                          className="cursor-pointer"
                          animate={{
                            r: isHovered ? 7 : isSelected ? 6 : 4,
                            scale: isHovered ? 1.2 : isSelected ? 1.1 : 1,
                            strokeWidth: isHovered ? 4 : isSelected ? 3 : 2
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                          }}
                          style={{
                            filter: isHovered 
                              ? 'drop-shadow(0 0 16px rgba(59, 130, 246, 0.8)) brightness(1.1)'
                              : isSelected 
                              ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))' 
                              : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))',
                            willChange: 'filter, transform'
                          }}
                        />
                      );
                    }}
                    activeDot={{
                      r: 8, 
                      stroke: selectedColors[0] || color, 
                      strokeWidth: 3,
                      fill: 'white',
                      style: {
                        filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6))'
                      }
                    }}
                    animationDuration={reducedMotion ? 0 : animationConfig.animationDuration}
                    animationEasing={"ease-out" as any}
                    connectNulls={false}
                  />
                  
                  {/* Comparison line */}
                  {comparisonMode && comparisonData && (
                    <Line 
                      type="monotone"
                      dataKey={dataKey}
                      data={comparisonData}
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: "#94a3b8" }}
                      name="Comparison"
                    />
                  )}
                  
                  {/* Brush for time-based selection */}
                  {brushEnabled && currentType === "line" && (
                    <RechartsBrush
                      dataKey="name"
                      height={30}
                      stroke={selectedColors[0] || color}
                      fill={selectedColors[0] || color}
                      fillOpacity={0.1}
                      travellerWidth={8}
                      onChange={(brushData) => {
                        // Handle brush selection
                        if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
                          const selectedData = filteredData.slice(brushData.startIndex, brushData.endIndex + 1);
                          onSelectionChange?.(selectedData);
                        }
                      }}
                    />
                  )}
                </LineChart>
              ) : currentType === "area" ? (
                <AreaChart 
                  data={filteredData} 
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      const pointData = data.activePayload[0].payload as ChartData;
                      chartInteractions.handlers.onDataPointClick(pointData, data.activeTooltipIndex || 0);
                    }
                  }}
                  onMouseMove={chartInteractions.handlers.onMouseMove as any}
                  onMouseLeave={chartInteractions.handlers.onMouseLeave}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                  />
                  <Tooltip 
                    content={<EnhancedTooltip />}
                    animationDuration={reducedMotion ? 0 : 200}
                    animationEasing="ease-out"
                  />
                  {showLegend && <Legend />}
                  
                  {/* Annotations */}
                  {annotations.map((annotation, index) => (
                    <ReferenceLine
                      key={`annotation-${index}`}
                      x={annotation.x}
                      y={annotation.y}
                      stroke={annotation.color || "#666"}
                      strokeDasharray="5 5"
                      label={{
                        value: annotation.label,
                        position: "top" as any
                      }}
                    />
                  ))}
                  
                  <CrosshairLines />
                  
                  <Area 
                    type="monotone" 
                    dataKey={dataKey} 
                    stroke={selectedColors[0] || color}
                    strokeWidth={2}
                    fill={selectedColors[0] || color}
                    fillOpacity={0.1}
                    dot={(props: any) => {
                      const { payload, cx, cy, index } = props;
                      const isSelected = chartInteractions.state.selectedPoints.some(p => p.name === payload.name);
                      const isHovered = chartInteractions.state.hoveredIndex === index;
                      
                      return (
                        <motion.circle
                          key={`dot-${index}`}
                          cx={cx || 0}
                          cy={cy || 0}
                          r={isHovered ? 6 : isSelected ? 5 : 3}
                          fill={getDataPointColor(payload, index)}
                          stroke="white"
                          strokeWidth={isSelected ? 3 : 2}
                          className="cursor-pointer"
                          animate={{
                            r: isHovered ? 7 : isSelected ? 6 : 3,
                            scale: isHovered ? 1.3 : isSelected ? 1.1 : 1,
                            strokeWidth: isHovered ? 4 : isSelected ? 3 : 2
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                          style={{
                            filter: isHovered 
                              ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.7)) brightness(1.1)'
                              : isSelected 
                              ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' 
                              : 'none',
                            willChange: 'filter, transform'
                          }}
                        />
                      );
                    }}
                    animationDuration={reducedMotion ? 0 : animationConfig.animationDuration}
                    animationEasing={"ease-out" as any}
                  />
                  
                  {brushEnabled && (
                    <RechartsBrush
                      dataKey="name"
                      height={30}
                      stroke={selectedColors[0] || color}
                      fill={selectedColors[0] || color}
                      fillOpacity={0.1}
                      travellerWidth={8}
                    />
                  )}
                </AreaChart>
              ) : (
                <BarChart 
                  data={filteredData} 
                  onClick={(data: any) => {
                    if (data && data.activePayload && data.activePayload[0]) {
                      const pointData = data.activePayload[0].payload as ChartData;
                      chartInteractions.handlers.onDataPointClick(pointData, data.activeTooltipIndex || 0);
                    }
                  }}
                  onMouseMove={chartInteractions.handlers.onMouseMove as any}
                  onMouseLeave={chartInteractions.handlers.onMouseLeave}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                  />
                  <Tooltip 
                    content={<EnhancedTooltip />}
                    animationDuration={reducedMotion ? 0 : 200}
                    animationEasing="ease-out"
                  />
                  {showLegend && <Legend />}
                  
                  {/* Annotations */}
                  {annotations.map((annotation, index) => (
                    <ReferenceLine
                      key={`annotation-${index}`}
                      x={annotation.x}
                      y={annotation.y}
                      stroke={annotation.color || "#666"}
                      strokeDasharray="5 5"
                      label={{
                        value: annotation.label,
                        position: "top" as any
                      }}
                    />
                  ))}
                  
                  <CrosshairLines />
                  
                  <Bar 
                    dataKey={dataKey} 
                    radius={[2, 2, 0, 0]} 
                    cursor="pointer"
                    animationDuration={reducedMotion ? 0 : animationConfig.animationDuration}
                    animationEasing={"ease-out" as any}
                  >
                    {filteredData.map((entry, index) => {
                      const isSelected = chartInteractions.state.selectedPoints.some(p => p.name === entry.name);
                      const isHovered = chartInteractions.state.hoveredIndex === index;
                      
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getDataPointColor(entry, index)}
                          stroke={isSelected ? "#3b82f6" : "transparent"}
                          strokeWidth={isSelected ? 2 : 0}
                          style={{
                            filter: isHovered 
                              ? 'brightness(1.15) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' 
                              : isSelected 
                              ? 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6)) brightness(1.05)' 
                              : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1))',
                            transform: isHovered 
                              ? 'scale(1.05) translateY(-2px)' 
                              : isSelected 
                              ? 'scale(1.02) translateY(-1px)' 
                              : 'scale(1)',
                            transformOrigin: 'center bottom',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'filter, transform'
                          }}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
          
          {/* Multi-select summary */}
          <AnimatePresence>
            {chartInteractions.state.selectedPoints.length > 1 && comparisonMode && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="mt-4 p-3 bg-muted/50 rounded-lg"
              >
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Selection Comparison
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                  {chartInteractions.state.selectedPoints.map((point, index) => (
                    <motion.div
                      key={point.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-2 bg-background rounded border"
                    >
                      <div>
                        <div className="font-medium">{point.name}</div>
                        <div className="text-muted-foreground">{point.value}</div>
                      </div>
                      <div className={`text-xs font-medium ${getTrendColor(point.trend)}`}>
                        {point.changePercent ? `${point.changePercent > 0 ? '+' : ''}${point.changePercent.toFixed(1)}%` : ''}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Enhanced Drill-down modal with animations */}
      <Dialog open={showDrillDown} onOpenChange={setShowDrillDown}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {selectedPoint?.name} - Detailed Analysis
              {selectedPoint?.trend && (
                <Badge variant={selectedPoint.trend === "up" ? "default" : selectedPoint.trend === "down" ? "destructive" : "secondary"}>
                  {selectedPoint.trend}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Comprehensive breakdown and drill-down analysis for {selectedPoint?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPoint?.drillDown && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Summary Cards with Animations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg"
                >
                  <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Current Value</h4>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedPoint.value}</div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {selectedPoint.date}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={cn(
                    "p-4 rounded-lg",
                    selectedPoint.trend === "up" ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900" :
                    selectedPoint.trend === "down" ? "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900" :
                    "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900"
                  )}
                >
                  <h4 className={cn(
                    "text-sm font-medium mb-2",
                    selectedPoint.trend === "up" ? "text-green-700 dark:text-green-300" :
                    selectedPoint.trend === "down" ? "text-red-700 dark:text-red-300" :
                    "text-gray-700 dark:text-gray-300"
                  )}>Change</h4>
                  <div className={cn(
                    "text-2xl font-bold flex items-center gap-2",
                    selectedPoint.trend === "up" ? "text-green-900 dark:text-green-100" :
                    selectedPoint.trend === "down" ? "text-red-900 dark:text-red-100" :
                    "text-gray-900 dark:text-gray-100"
                  )}>
                    {getTrendIcon(selectedPoint.trend)}
                    {selectedPoint.changePercent ? `${selectedPoint.changePercent > 0 ? '+' : ''}${selectedPoint.changePercent.toFixed(1)}%` : 'N/A'}
                  </div>
                  <div className={cn(
                    "text-xs mt-1",
                    selectedPoint.trend === "up" ? "text-green-600 dark:text-green-400" :
                    selectedPoint.trend === "down" ? "text-red-600 dark:text-red-400" :
                    "text-gray-600 dark:text-gray-400"
                  )}>
                    vs previous: {selectedPoint.previousValue || 'N/A'}
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg"
                >
                  <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Drill-down Items</h4>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{selectedPoint.drillDown.length}</div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Sub-categories available
                  </div>
                </motion.div>
              </div>
              
              {/* Detailed Metrics */}
              {selectedPoint.details && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-muted/50 rounded-lg p-4"
                >
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Detailed Metrics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedPoint.details).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.05) }}
                        className="text-center"
                      >
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {key === 'commits' && <GitCommit className="w-3 h-3 text-muted-foreground" />}
                          {key === 'pullRequests' && <GitPullRequest className="w-3 h-3 text-muted-foreground" />}
                          {key === 'reviewComments' && <MessageSquare className="w-3 h-3 text-muted-foreground" />}
                          <span className="text-xs text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <div className="text-lg font-semibold">{value}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Enhanced Drill-down Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Breakdown Analysis
                </h4>
                <div className="h-64 bg-background rounded-lg border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={selectedPoint.drillDown}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="name" 
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (!active || !payload || !payload.length) return null;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <h4 className="font-semibold text-sm mb-2">{label}</h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Value:</span>
                                  <span className="font-medium">{payload[0].value}</span>
                                </div>
                                {payload[0].payload.details && (
                                  <div className="border-t pt-2 mt-2 space-y-1">
                                    {Object.entries(payload[0].payload.details).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-muted-foreground capitalize">{key}:</span>
                                        <span>{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[2, 2, 0, 0]}
                        animationDuration={reducedMotion ? 0 : 800}
                        animationEasing="ease-out"
                      >
                        {(selectedPoint.drillDown || []).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={selectedColors[index % selectedColors.length] || color}
                            opacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Export Options for Drill-down */}
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => chartExport.exportToCSV(selectedPoint.drillDown || [], `${selectedPoint.name}-breakdown`)}
                    className="text-xs"
                    disabled={chartExport.isExporting}
                  >
                    <FileSpreadsheet className="w-3 h-3 mr-1" />
                    Export CSV
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
});

export default ChartContainer;
