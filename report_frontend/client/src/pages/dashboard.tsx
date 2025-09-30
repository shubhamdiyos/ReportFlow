import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import KPICard from "@/components/dashboard/kpi-card";
import ChartContainer from "@/components/dashboard/chart-container";
import ChartInsights from "@/components/dashboard/chart-insights";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AnimatedSection, AnimatedItem } from "@/components/ui/animated-section";
import { KPICardSkeleton, ChartSkeleton } from "@/components/ui/skeleton-loader";
import { 
  Calendar, 
  ChevronDown, 
  Plus, 
  Eye, 
  Settings, 
  FileText,
  Download,
  Clock,
  GitCommit,
  GitPullRequest,
  CheckCircle,
  Users,
  Activity,
  DollarSign,
  Code,
  Link,
  Layers,
  BarChart3,
  LineChart,
  PieChart,
  Filter
} from "lucide-react";
import { mockKPIsByRole, mockChartData, mockTopContributors, mockReports } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";
import ReportGenerationWizard from "@/components/shared/report-generation-wizard";
import WelcomeMessage from "@/components/shared/welcome-message";
import { ReportWizardData, ChartDataPoint } from "@/lib/types";

const iconMap = {
  "git-commit": GitCommit,
  "git-pull-request": GitPullRequest,
  "check-circle": CheckCircle,
  "file-text": FileText,
  "users": Users,
  "activity": Activity,
  "dollar-sign": DollarSign,
  "eye": Eye,
  "code": Code,
};

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Advanced Chart States
  const [chartLinkingEnabled, setChartLinkingEnabled] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<[number, number] | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [linkedSelections, setLinkedSelections] = useState<ChartDataPoint[]>([]);
  
  // Chart refs for linking
  const contributionsChartRef = useRef<any>(null);
  const contributorsChartRef = useRef<any>(null);
  
  // Chart annotations
  const [annotations, setAnnotations] = useState([
    { x: "Dec 15", y: 45, label: "Release Sprint", color: "#10b981" },
    { x: "Dec 25", y: 20, label: "Holiday Period", color: "#f59e0b" }
  ]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);
  
  // Get role-based KPIs
  const userRole = user?.role || "developer";
  const kpiData = mockKPIsByRole[userRole as keyof typeof mockKPIsByRole] || mockKPIsByRole.developer;
  
  // Handle chart linking and synchronization
  const handleChartSelection = (chartId: string, selectedData: ChartDataPoint[]) => {
    if (!chartLinkingEnabled) return;
    
    setLinkedSelections(selectedData);
    
    // Apply selection to other charts
    if (chartId !== "contributions" && contributionsChartRef.current) {
      contributionsChartRef.current.updateSelection?.(selectedData);
    }
    
    if (chartId !== "contributors" && contributorsChartRef.current) {
      contributorsChartRef.current.updateSelection?.(selectedData);
    }
    
    // Show toast with selection info
    if (selectedData.length > 0) {
      toast({
        title: "Charts Synchronized",
        description: `${selectedData.length} data points selected across all charts.`,
      });
    }
  };
  
  // Handle time range brush selection
  const handleTimeRangeBrush = (range: [number, number] | null) => {
    setSelectedTimeRange(range);
    
    if (range && chartLinkingEnabled) {
      toast({
        title: "Time Range Selected",
        description: `Filtering data from ${range[0]} to ${range[1]}.`,
      });
    }
  };
  
  // Handle global filtering
  const handleGlobalFilter = (filterValue: string | null) => {
    setGlobalFilter(filterValue);
    
    if (filterValue) {
      toast({
        title: "Global Filter Applied",
        description: `Filtering charts by: ${filterValue}`,
      });
    } else {
      toast({
        title: "Filter Cleared",
        description: "All chart filters have been removed.",
      });
    }
  };
  
  // Generate comparison data for comparison mode
  const generateComparisonData = (originalData: ChartDataPoint[]) => {
    return originalData.map((point, index) => ({
      ...point,
      value: point.value * (0.8 + Math.random() * 0.4), // Simulate comparison data
      name: point.name,
    }));
  };

  const handleGenerateReport = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = (data: ReportWizardData) => {
    toast({
      title: "Report Generation Started",
      description: "Your report is being generated and will be available shortly.",
    });
    // Navigate to reports page to show the generation process
    setLocation("/reports");
  };

  const handleViewReports = () => {
    setLocation("/reports");
  };

  const handleManageRepos = () => {
    setLocation("/repositories");
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6" data-testid="dashboard-page">
      {/* Personalized Welcome Message Header */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Main Welcome Message */}
          <div className="lg:col-span-2">
            <WelcomeMessage
              variant="card"
              showTips={true}
              showAchievement={true}
              showMotivation={true}
              autoRotate={true}
              rotateInterval={10000}
              className="h-full"
            />
          </div>
          
          {/* Quick Action Panel */}
          <div className="flex flex-col gap-3">
            <div className="bg-gradient-to-r from-background via-background/95 to-background rounded-lg border border-border/50 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start h-9 border-2 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200" 
                  data-testid="button-date-range"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Dec 1 - Dec 31, 2024</span>
                  <ChevronDown className="w-3 h-3 ml-auto opacity-60" />
                </Button>
                <Button 
                  onClick={handleGenerateReport} 
                  size="sm"
                  className="w-full justify-start h-9 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200" 
                  data-testid="button-generate-report"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
            
            {/* Live Status Indicator */}
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700 dark:text-green-300">Live data stream active</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Last updated: just now</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Chart Interaction Controls */}
        <Card className="p-5 shadow-sm border-2 bg-gradient-to-r from-muted/10 to-transparent">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Chart Controls</h3>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              {/* Enhanced Chart Linking Toggle */}
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                <Switch 
                  id="chart-linking" 
                  checked={chartLinkingEnabled}
                  onCheckedChange={setChartLinkingEnabled}
                  data-testid="switch-chart-linking"
                />
                <Label htmlFor="chart-linking" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Link className="w-4 h-4 text-blue-500" />
                  Chart Linking
                </Label>
              </div>
              
              {/* Enhanced Comparison Mode Toggle */}
              <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/20 transition-colors">
                <Switch 
                  id="comparison-mode" 
                  checked={comparisonMode}
                  onCheckedChange={setComparisonMode}
                  data-testid="switch-comparison-mode"
                />
                <Label htmlFor="comparison-mode" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <Layers className="w-4 h-4 text-green-500" />
                  Comparison Mode
                </Label>
              </div>
              
              {/* Enhanced Clear Filters Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGlobalFilter(null);
                  setSelectedTimeRange(null);
                  setLinkedSelections([]);
                }}
                className="flex items-center gap-2 h-9 px-4 border-2 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200"
                data-testid="button-clear-filters"
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
              
              {/* Enhanced Selection Summary */}
              {linkedSelections.length > 0 && (
                <div className="flex items-center gap-2 text-sm bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">{linkedSelections.length} points selected</span>
                  <button
                    onClick={() => setLinkedSelections([])}
                    className="ml-2 w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 text-primary hover:text-foreground transition-colors"
                    title="Clear selection"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards with Stagger Animation & Loading States */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <KPICardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <AnimatedSection 
          stagger={true} 
          staggerDelay={0.1} 
          childDelay={0.2}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {kpiData.map((kpi, index) => {
            const IconComponent = iconMap[kpi.icon as keyof typeof iconMap];
            return (
              <AnimatedItem key={kpi.id}>
                <KPICard
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeType={kpi.changeType}
                  icon={IconComponent}
                  iconColor={kpi.color}
                  index={index}
                />
              </AnimatedItem>
            );
          })}
        </AnimatedSection>
      )}

      {/* Charts Section with Stagger Animation & Loading States */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-1 xl:col-span-2">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-1 xl:col-span-1">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-1 xl:col-span-2">
            <ChartSkeleton />
          </div>
          <div className="lg:col-span-1 xl:col-span-1">
            <ChartSkeleton />
          </div>
        </div>
      ) : (
        <AnimatedSection 
          stagger={true} 
          staggerDelay={0.15} 
          childDelay={0.4}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"
        >
        <AnimatedItem className="lg:col-span-1 xl:col-span-2">
          <ChartContainer
            ref={contributionsChartRef}
            title="Contributions Over Time"
            description="Interactive timeline with zoom, pan, and brush selection capabilities"
            data={mockChartData}
            type="line"
            dataKey="value"
            enableLiveUpdates={true}
            liveUpdateInterval={15000}
            // Enhanced Interactive Features
            enableZoom={true}
            enablePan={true}
            enableBrush={true}
            enableCrosshair={true}
            enableMultiSelect={true}
            comparisonMode={comparisonMode}
            comparisonData={comparisonMode ? generateComparisonData(mockChartData) : undefined}
            // Chart Linking
            onSelectionChange={(selectedData) => handleChartSelection("contributions", selectedData)}
            onBrushChange={handleTimeRangeBrush}
            linkedSelections={linkedSelections}
            // Annotations
            annotations={annotations}
            onAddAnnotation={(annotation: any) => setAnnotations(prev => [...prev, annotation])}
            // Styling
            height={320}
            selectedColors={["#3b82f6", "#10b981", "#f59e0b"]}
            showLegend={true}
            // Export capabilities
            exportFileName="contributions-over-time"
            data-testid="chart-contributions-time"
          />
        </AnimatedItem>
        <AnimatedItem className="lg:col-span-1 xl:col-span-1">
          <ChartInsights
            title="Contributions"
            data={mockChartData}
            dataKey="value"
          />
        </AnimatedItem>
        <AnimatedItem className="lg:col-span-1 xl:col-span-2">
          <ChartContainer
            ref={contributorsChartRef}
            title="Top Contributors"
            description="Interactive contributor analysis with drill-down and comparison features"
            data={mockTopContributors}
            type="bar"
            dataKey="value"
            color="hsl(var(--chart-2))"
            enableLiveUpdates={true}
            liveUpdateInterval={20000}
            // Enhanced Interactive Features
            enableZoom={false} // Disabled for bar charts to prevent confusion
            enablePan={false}
            enableBrush={false}
            enableCrosshair={true}
            enableMultiSelect={true}
            comparisonMode={comparisonMode}
            comparisonData={comparisonMode ? generateComparisonData(mockTopContributors) : undefined}
            // Chart Linking
            onSelectionChange={(selectedData) => handleChartSelection("contributors", selectedData)}
            linkedSelections={linkedSelections}
            // Drill-down capabilities
            enableDrillDown={true}
            // Styling
            height={320}
            selectedColors={["#8b5cf6", "#06b6d4", "#84cc16"]}
            showLegend={comparisonMode}
            // Export capabilities
            exportFileName="top-contributors"
            data-testid="chart-top-contributors"
          />
        </AnimatedItem>
        <AnimatedItem className="lg:col-span-1 xl:col-span-1">
          <ChartInsights
            title="Contributors"
            data={mockTopContributors}
            dataKey="value"
          />
        </AnimatedItem>
      </AnimatedSection>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Quick Actions */}
        <Card data-testid="card-quick-actions">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-3 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={handleGenerateReport}
                data-testid="button-quick-generate-report"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm sm:text-base leading-tight">Generate Report</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Create new monthly report</p>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-3 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={handleViewReports}
                data-testid="button-quick-view-reports"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm sm:text-base leading-tight">View Reports</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Browse all generated reports</p>
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-3 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={handleManageRepos}
                data-testid="button-quick-manage-repos"
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm sm:text-base leading-tight">Manage Repos</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Configure repository settings</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="lg:col-span-2" data-testid="card-recent-reports">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Reports</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 text-sm" 
                data-testid="link-view-all-reports"
              >
                <span className="hidden sm:inline">View all</span>
                <span className="sm:hidden">All</span>
              </Button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {mockReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border"
                  data-testid={`report-${report.id}`}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm sm:text-base truncate leading-tight">{report.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate mt-1">
                      Generated on {report.generatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge 
                      variant={report.status === "ready" ? "default" : 
                              report.status === "processing" ? "secondary" : "destructive"}
                      className="text-xs px-2 py-1"
                    >
                      {report.status === "ready" ? "Ready" : 
                       report.status === "processing" ? "Processing" : "Failed"}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      data-testid={`button-download-report-${report.id}`}
                    >
                      {report.status === "ready" ? 
                        <Download className="w-4 h-4" /> : 
                        <Clock className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Wizard */}
      <ReportGenerationWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={handleWizardComplete}
      />
    </div>
  );
}
