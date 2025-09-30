import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { select, Selection } from "d3-selection";
import { zoom, zoomTransform, ZoomBehavior } from "d3-zoom";
import { brush, brushSelection, BrushBehavior } from "d3-brush";
import { ChartData } from "@/lib/types";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";

export interface ChartInteractionState {
  selectedPoints: ChartData[];
  highlightedPoint: ChartData | null;
  zoomTransform: { x: number; y: number; k: number };
  brushSelection: [number, number] | null;
  crosshairPosition: { x: number; y: number } | null;
  hoveredIndex: number | null;
  comparisonMode: boolean;
}

export interface ChartInteractionConfig {
  enableZoom?: boolean;
  enablePan?: boolean;
  enableBrush?: boolean;
  enableMultiSelect?: boolean;
  enableCrosshair?: boolean;
  enableComparison?: boolean;
  zoomExtent?: [number, number];
  brushDirection?: "x" | "y" | "xy";
}

export interface ChartInteractionCallbacks {
  onDataPointClick?: (point: ChartData, index: number) => void;
  onDataPointHover?: (point: ChartData | null, index: number | null) => void;
  onSelectionChange?: (selectedPoints: ChartData[]) => void;
  onZoomChange?: (transform: { x: number; y: number; k: number }) => void;
  onBrushChange?: (selection: [number, number] | null) => void;
  onCrosshairMove?: (position: { x: number; y: number } | null) => void;
}

/**
 * Advanced chart interactions hook with zoom, pan, brush, and multi-select
 */
export function useChartInteractions(
  data: ChartData[],
  config: ChartInteractionConfig = {},
  callbacks: ChartInteractionCallbacks = {}
) {
  const {
    enableZoom = true,
    enablePan = true,
    enableBrush = false,
    enableMultiSelect = false,
    enableCrosshair = true,
    enableComparison = false,
    zoomExtent = [0.5, 5],
    brushDirection = "x"
  } = config;

  const { reducedMotion } = useMotionPreferences();
  
  const [state, setState] = useState<ChartInteractionState>({
    selectedPoints: [],
    highlightedPoint: null,
    zoomTransform: { x: 0, y: 0, k: 1 },
    brushSelection: null,
    crosshairPosition: null,
    hoveredIndex: null,
    comparisonMode: enableComparison
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const chartAreaRef = useRef<SVGGElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown>>();
  const brushBehaviorRef = useRef<BrushBehavior<SVGGElement>>();

  // Initialize D3 zoom behavior (only for compatible DOM elements)
  const initializeZoom = useCallback(() => {
    if (!svgRef.current || (!enableZoom && !enablePan)) return;
    
    // Check if the element has addEventListener method (real DOM element)
    if (typeof svgRef.current.addEventListener !== 'function') {
      console.debug('Skipping D3 zoom initialization - element not compatible');
      return;
    }

    try {
      const svg = select(svgRef.current);
      const zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent(zoomExtent)
        .on("zoom", (event) => {
          const transform = event.transform;
          setState(prev => ({
            ...prev,
            zoomTransform: { x: transform.x, y: transform.y, k: transform.k }
          }));
          
          callbacks.onZoomChange?.({ x: transform.x, y: transform.y, k: transform.k });
          
          if (chartAreaRef.current && typeof chartAreaRef.current.setAttribute === 'function') {
            select(chartAreaRef.current).attr("transform", transform);
          }
        });

      if (!enableZoom) zoomBehavior.scaleExtent([1, 1]);
      if (!enablePan) zoomBehavior.translateExtent([[0, 0], [0, 0]]);

      svg.call(zoomBehavior);
      zoomBehaviorRef.current = zoomBehavior;
    } catch (error) {
      console.debug('D3 zoom initialization failed:', error);
    }
  }, [enableZoom, enablePan, zoomExtent, callbacks]);

  // Initialize D3 brush behavior (only for compatible DOM elements)
  const initializeBrush = useCallback(() => {
    if (!chartAreaRef.current || !enableBrush) return;
    
    // Check if the element has setAttribute method (real DOM element)
    if (typeof chartAreaRef.current.setAttribute !== 'function') {
      console.debug('Skipping D3 brush initialization - element not compatible');
      return;
    }

    try {
      const chartArea = select(chartAreaRef.current);
      const brushBehavior = brush<SVGGElement>()
        .on("brush end", (event) => {
          const selection = event.selection;
          if (selection) {
            const [x0, x1] = brushDirection === "y" ? [selection[1], selection[3]] : [selection[0], selection[2]];
            setState(prev => ({
              ...prev,
              brushSelection: [x0, x1] as [number, number]
            }));
            callbacks.onBrushChange?.([x0, x1]);
          } else {
            setState(prev => ({ ...prev, brushSelection: null }));
            callbacks.onBrushChange?.(null);
          }
        });

      chartArea.append("g")
        .attr("class", "brush")
        .call(brushBehavior);

      brushBehaviorRef.current = brushBehavior;
    } catch (error) {
      console.debug('D3 brush initialization failed:', error);
    }
  }, [enableBrush, brushDirection, callbacks]);

  // Handle data point interactions
  const handleDataPointClick = useCallback((point: ChartData, index: number, event?: MouseEvent) => {
    if (enableMultiSelect && event?.ctrlKey) {
      setState(prev => {
        const isSelected = prev.selectedPoints.some(p => p.name === point.name);
        const newSelection = isSelected
          ? prev.selectedPoints.filter(p => p.name !== point.name)
          : [...prev.selectedPoints, point];
        
        callbacks.onSelectionChange?.(newSelection);
        return { ...prev, selectedPoints: newSelection };
      });
    } else {
      setState(prev => ({ 
        ...prev, 
        selectedPoints: [point],
        highlightedPoint: point
      }));
      callbacks.onSelectionChange?.([point]);
    }
    callbacks.onDataPointClick?.(point, index);
  }, [enableMultiSelect, callbacks]);

  const handleDataPointHover = useCallback((point: ChartData | null, index: number | null) => {
    setState(prev => ({ 
      ...prev, 
      highlightedPoint: point,
      hoveredIndex: index
    }));
    callbacks.onDataPointHover?.(point, index);
  }, [callbacks]);

  // Crosshair functionality (simplified for Recharts compatibility)
  const handleMouseMove = useCallback((event: any) => {
    if (!enableCrosshair) return;

    // For Recharts, we'll use the event data instead of DOM coordinates
    if (event && event.activeCoordinate) {
      const { x, y } = event.activeCoordinate;
      setState(prev => ({ 
        ...prev, 
        crosshairPosition: { x, y }
      }));
      callbacks.onCrosshairMove?.({ x, y });
    }
  }, [enableCrosshair, callbacks]);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      crosshairPosition: null,
      hoveredIndex: null,
      highlightedPoint: null
    }));
    callbacks.onCrosshairMove?.(null);
    callbacks.onDataPointHover?.(null, null);
  }, [callbacks]);

  // Reset zoom (simplified for Recharts compatibility)
  const resetZoom = useCallback(() => {
    if (!zoomBehaviorRef.current) {
      // Fallback for non-D3 zoom: just reset state
      setState(prev => ({ ...prev, zoomTransform: { x: 0, y: 0, k: 1 } }));
      return;
    }
    
    if (!svgRef.current || typeof svgRef.current.addEventListener !== 'function') {
      setState(prev => ({ ...prev, zoomTransform: { x: 0, y: 0, k: 1 } }));
      return;
    }
    
    try {
      const svg = select(svgRef.current);
      const duration = reducedMotion ? 0 : 500;
      
      svg.transition()
        .duration(duration)
        .call(zoomBehaviorRef.current.transform as any, zoomTransform.scale(1).translate(0, 0));
        
      setState(prev => ({ ...prev, zoomTransform: { x: 0, y: 0, k: 1 } }));
    } catch (error) {
      console.debug('Reset zoom failed:', error);
      setState(prev => ({ ...prev, zoomTransform: { x: 0, y: 0, k: 1 } }));
    }
  }, [reducedMotion]);

  // Clear brush selection
  const clearBrush = useCallback(() => {
    if (!chartAreaRef.current || !brushBehaviorRef.current) return;
    
    const chartArea = select(chartAreaRef.current);
    chartArea.select(".brush").call(brushBehaviorRef.current.clear);
    setState(prev => ({ ...prev, brushSelection: null }));
  }, []);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      selectedPoints: [],
      highlightedPoint: null
    }));
    callbacks.onSelectionChange?.([]);
  }, [callbacks]);

  // Toggle comparison mode
  const toggleComparisonMode = useCallback(() => {
    setState(prev => ({ ...prev, comparisonMode: !prev.comparisonMode }));
  }, []);

  // Zoom to data
  const zoomToData = useCallback((dataSubset?: ChartData[]) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    
    const targetData = dataSubset || data;
    if (targetData.length === 0) return;

    // Calculate bounds of target data
    const values = targetData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // This would need to be adjusted based on your chart's scale
    // For now, we'll just reset to fit all data
    resetZoom();
  }, [data, resetZoom]);

  // Initialize behaviors on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeZoom();
      initializeBrush();
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, [initializeZoom, initializeBrush]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (svgRef.current && svgRef.current instanceof Element) {
        try {
          select(svgRef.current).selectAll("*").remove();
        } catch (error) {
          // Silent cleanup failure to prevent crashes
          console.debug('D3 cleanup failed:', error);
        }
      }
    };
  }, []);

  // Memoized interaction handlers
  const interactionHandlers = useMemo(() => ({
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onDataPointClick: handleDataPointClick,
    onDataPointHover: handleDataPointHover,
  }), [handleMouseMove, handleMouseLeave, handleDataPointClick, handleDataPointHover]);

  // Memoized control functions
  const controls = useMemo(() => ({
    resetZoom,
    clearBrush,
    clearSelections,
    toggleComparisonMode,
    zoomToData
  }), [resetZoom, clearBrush, clearSelections, toggleComparisonMode, zoomToData]);

  return {
    state,
    refs: { svgRef, chartAreaRef },
    handlers: interactionHandlers,
    controls,
    config: { enableZoom, enablePan, enableBrush, enableMultiSelect, enableCrosshair, enableComparison }
  };
}

/**
 * Hook for chart export functionality
 */
export function useChartExport(chartRef: React.RefObject<HTMLDivElement>, title: string = "chart") {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = useCallback(async (data: ChartData[], filename?: string) => {
    try {
      setIsExporting(true);
      
      // Prepare CSV data
      const csvData = data.map(item => ({
        Name: item.name,
        Value: item.value,
        Date: item.date || '',
        Trend: item.trend || '',
        'Change %': item.changePercent || 0,
        Commits: item.details?.commits || 0,
        'Pull Requests': item.details?.pullRequests || 0,
        'Lines Added': item.details?.linesAdded || 0,
        'Lines Removed': item.details?.linesRemoved || 0
      }));

      // Dynamic import to avoid bundle issues
      const { CSVLink } = await import('react-csv');
      
      // Create temporary link element
      const csvContent = "data:text/csv;charset=utf-8," + 
        encodeURIComponent(
          Object.keys(csvData[0]).join(',') + '\n' +
          csvData.map(row => Object.values(row).join(',')).join('\n')
        );
      
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', filename || `${title}-data.csv`);
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('CSV export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [title]);

  const exportToPNG = useCallback(async (filename?: string) => {
    if (!chartRef.current) return;

    try {
      setIsExporting(true);
      
      // Dynamic import to avoid bundle issues
      const html2canvas = await import('html2canvas').then(mod => mod.default);
      const { saveAs } = await import('file-saver');
      
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, filename || `${title}-chart.png`);
        }
      }, 'image/png');
    } catch (error) {
      console.error('PNG export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [chartRef, title]);

  return {
    exportToCSV,
    exportToPNG,
    isExporting
  };
}

/**
 * Hook for chart linking and synchronization
 */
export function useChartLinking(chartId: string) {
  const [linkedCharts, setLinkedCharts] = useState<Set<string>>(new Set());
  const [sharedState, setSharedState] = useState<any>({});

  const linkCharts = useCallback((targetChartIds: string[]) => {
    setLinkedCharts(new Set([chartId, ...targetChartIds]));
  }, [chartId]);

  const unlinkCharts = useCallback(() => {
    setLinkedCharts(new Set([chartId]));
  }, [chartId]);

  const broadcastUpdate = useCallback((update: any) => {
    // In a real app, this would use a state manager or context
    // For now, we'll use a simple event system
    window.dispatchEvent(new CustomEvent('chartUpdate', {
      detail: { chartId, update, linkedCharts: Array.from(linkedCharts) }
    }));
  }, [chartId, linkedCharts]);

  const subscribeToUpdates = useCallback((handler: (update: any) => void) => {
    const handleUpdate = (event: CustomEvent) => {
      const { chartId: sourceChartId, update, linkedCharts: sourceLinkedCharts } = event.detail;
      
      if (sourceChartId !== chartId && sourceLinkedCharts.includes(chartId)) {
        handler(update);
      }
    };

    window.addEventListener('chartUpdate', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('chartUpdate', handleUpdate as EventListener);
    };
  }, [chartId]);

  return {
    linkedCharts: Array.from(linkedCharts),
    linkCharts,
    unlinkCharts,
    broadcastUpdate,
    subscribeToUpdates,
    sharedState,
    setSharedState
  };
}

/**
 * Hook for advanced chart animations
 */
export function useChartAnimations(reducedMotion: boolean = false) {
  const [animationQueue, setAnimationQueue] = useState<string[]>([]);
  
  const springConfig = useMemo(() => ({
    tension: 300,
    friction: 30,
    mass: 1
  }), []);

  const createEnterAnimation = useCallback((delay: number = 0) => {
    if (reducedMotion) return {};
    
    return {
      initial: { opacity: 0, scale: 0.8, y: 20 },
      animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: {
          type: "spring",
          ...springConfig,
          delay
        }
      }
    };
  }, [reducedMotion, springConfig]);

  const createExitAnimation = useCallback(() => {
    if (reducedMotion) return {};
    
    return {
      exit: {
        opacity: 0,
        scale: 0.9,
        y: -10,
        transition: {
          duration: 0.2,
          ease: "easeIn"
        }
      }
    };
  }, [reducedMotion]);

  const createHoverAnimation = useCallback(() => {
    if (reducedMotion) return {};
    
    return {
      whileHover: {
        scale: 1.05,
        transition: {
          type: "spring",
          ...springConfig,
          stiffness: 400
        }
      }
    };
  }, [reducedMotion, springConfig]);

  const createDataStreamAnimation = useCallback(() => {
    if (reducedMotion) return {};
    
    return {
      initial: { x: -100, opacity: 0 },
      animate: { 
        x: 0, 
        opacity: 1,
        transition: {
          type: "spring",
          ...springConfig,
          stiffness: 200
        }
      }
    };
  }, [reducedMotion, springConfig]);

  return {
    createEnterAnimation,
    createExitAnimation,
    createHoverAnimation,
    createDataStreamAnimation,
    springConfig
  };
}