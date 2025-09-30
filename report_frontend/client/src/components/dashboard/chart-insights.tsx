import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Zap,
  Target,
  Award
} from "lucide-react";
import { ChartData } from "@/lib/types";
import { motion } from "framer-motion";

interface ChartInsightsProps {
  title: string;
  data: ChartData[];
  dataKey: string;
}

export default function ChartInsights({ title, data, dataKey }: ChartInsightsProps) {
  // Calculate insights from chart data
  const calculateInsights = () => {
    const values = data.map(item => item.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    const average = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Find trends
    const upTrends = data.filter(item => item.trend === "up").length;
    const downTrends = data.filter(item => item.trend === "down").length;
    const stableTrends = data.filter(item => item.trend === "stable").length;
    
    // Calculate growth rate
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const growthRate = firstValue ? ((lastValue - firstValue) / firstValue) * 100 : 0;
    
    // Find best performer
    const bestPerformer = data.find(item => item.value === max);
    
    // Calculate consistency (lower variance = more consistent)
    const variance = values.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / values.length;
    const consistency = variance < average * 0.2 ? "High" : variance < average * 0.5 ? "Medium" : "Low";
    
    return {
      total,
      average: Math.round(average),
      max,
      min,
      upTrends,
      downTrends,
      stableTrends,
      growthRate,
      bestPerformer,
      consistency
    };
  };

  const insights = calculateInsights();

  const getGrowthColor = (rate: number) => {
    if (rate > 10) return "text-green-600";
    if (rate < -10) return "text-red-600";
    return "text-yellow-600";
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 10) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (rate < -10) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <BarChart3 className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card data-testid={`insights-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            {title} Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-semibold" data-testid="metric-total">{insights.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="text-lg font-semibold" data-testid="metric-average">{insights.average}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Peak</p>
              <p className="text-lg font-semibold text-green-600" data-testid="metric-peak">{insights.max}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Low</p>
              <p className="text-lg font-semibold text-orange-600" data-testid="metric-low">{insights.min}</p>
            </div>
          </div>

          {/* Growth Rate */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              {getGrowthIcon(insights.growthRate)}
              <span className="text-sm font-medium">Growth Rate</span>
            </div>
            <span className={`text-sm font-semibold ${getGrowthColor(insights.growthRate)}`} data-testid="metric-growth">
              {insights.growthRate > 0 ? '+' : ''}{insights.growthRate.toFixed(1)}%
            </span>
          </div>

          {/* Trend Analysis */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Trend Analysis</p>
            <div className="flex flex-wrap gap-2">
              {insights.upTrends > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  {insights.upTrends} Up
                </Badge>
              )}
              {insights.downTrends > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
                  {insights.downTrends} Down
                </Badge>
              )}
              {insights.stableTrends > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <BarChart3 className="w-3 h-3 mr-1 text-gray-500" />
                  {insights.stableTrends} Stable
                </Badge>
              )}
            </div>
          </div>

          {/* Best Performer */}
          {insights.bestPerformer && (
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Top Performer</span>
              </div>
              <span className="text-sm font-semibold text-green-600" data-testid="metric-top-performer">
                {insights.bestPerformer.name}
              </span>
            </div>
          )}

          {/* Consistency Score */}
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Consistency</span>
            </div>
            <Badge 
              variant={insights.consistency === "High" ? "default" : 
                       insights.consistency === "Medium" ? "secondary" : "destructive"}
              className="text-xs"
              data-testid="metric-consistency"
            >
              {insights.consistency}
            </Badge>
          </div>

          {/* Performance Indicator */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-muted-foreground">Performance Status</span>
            </div>
            <div className="space-y-1">
              {insights.growthRate > 15 && (
                <p className="text-xs text-green-600 font-medium">🚀 Excellent growth momentum</p>
              )}
              {insights.growthRate > 5 && insights.growthRate <= 15 && (
                <p className="text-xs text-blue-600 font-medium">📈 Steady positive growth</p>
              )}
              {insights.growthRate >= -5 && insights.growthRate <= 5 && (
                <p className="text-xs text-yellow-600 font-medium">📊 Stable performance</p>
              )}
              {insights.growthRate < -5 && (
                <p className="text-xs text-red-600 font-medium">📉 Needs attention</p>
              )}
              
              {insights.upTrends > insights.downTrends && (
                <p className="text-xs text-green-600">✅ More positive trends detected</p>
              )}
              
              {insights.consistency === "High" && (
                <p className="text-xs text-blue-600">🎯 Highly consistent performance</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}