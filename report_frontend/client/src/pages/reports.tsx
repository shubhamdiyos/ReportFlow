import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
// Enhanced chart imports
import ChartContainer from "@/components/dashboard/chart-container";
import ChartInsights from "@/components/dashboard/chart-insights";
// Keep chart components for any remaining static charts
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  Plus,
  Share,
  Download,
  RefreshCw,
  ChevronDown,
  FileText,
  Mail,
  MessageSquare,
  Link2,
  Trophy,
  TrendingUp,
  GitCommit,
  Code,
  Users,
  BarChart3,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockReports } from "@/lib/mock-data";
import ReportGenerationWizard from "@/components/shared/report-generation-wizard";
import WelcomeMessage from "@/components/shared/welcome-message";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);
  const [showWizard, setShowWizard] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { toast } = useToast();

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Report Regenerated",
        description: "Your report has been successfully regenerated with the latest data.",
      });
    } catch (error) {
      toast({
        title: "Regeneration Failed",
        description: "There was an error regenerating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Your report is being exported as ${format.toUpperCase()}. Download will start shortly.`,
    });
  };

  const handleShare = async (method: string) => {
    if (method === "link") {
      try {
        // Check if clipboard API is available (requires secure context)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link Copied",
            description: "Report link has been copied to your clipboard.",
          });
        } else {
          // Fallback for non-secure contexts or when clipboard API is not available
          const textArea = document.createElement("textarea");
          textArea.value = window.location.href;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
            toast({
              title: "Link Copied",
              description: "Report link has been copied to your clipboard.",
            });
          } catch (fallbackError) {
            toast({
              title: "Copy Failed",
              description: "Unable to copy link to clipboard. Please copy the URL manually.",
              variant: "destructive",
            });
          } finally {
            document.body.removeChild(textArea);
          }
        }
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Unable to copy link to clipboard. Please copy the URL manually.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Share Initiated",
        description: `Opening ${method} to share your report.`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6"
      data-testid="reports-page"
    >
      {/* Personalized Welcome Message Header for Reports */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Main Welcome Message for Reports */}
        <div className="xl:col-span-3">
          <WelcomeMessage
            variant="banner"
            showTips={true}
            showAchievement={true}
            showMotivation={false}
            autoRotate={false}
            className="h-full"
          />
        </div>
        
        {/* Report Actions Panel */}
        <div className="xl:col-span-1">
          <div className="bg-gradient-to-r from-background via-background/95 to-background rounded-lg border border-border/50 p-4 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Report Actions</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="report-type-select" className="text-xs font-medium text-muted-foreground">
                  Filter:
                </Label>
                <Select>
                  <SelectTrigger className="h-8 text-xs border-2 hover:border-primary/20 transition-colors" data-testid="select-report-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="team">Team Reports</SelectItem>
                    <SelectItem value="individual">Individual Reports</SelectItem>
                    <SelectItem value="repository">Repository Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => setShowWizard(true)} 
                size="sm"
                className="w-full justify-start h-8 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 text-xs" 
                data-testid="button-generate-report"
              >
                <Plus className="w-3 h-3 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Viewer */}
      <Card data-testid="card-report-viewer">
        {/* Enhanced Report Header */}
        <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-muted/20 to-transparent">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                  <BarChart3 className="w-3 h-3 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  {selectedReport.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-medium">{selectedReport.dateRange}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Enhanced Share Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-4 border-2 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200" data-testid="button-share-report">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                    <ChevronDown className="w-3 h-3 ml-2 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleShare("email")} data-testid="share-email">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("slack")} data-testid="share-slack">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Slack
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleShare("link")} data-testid="share-link">
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-4 border-2 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200" data-testid="button-export-report">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDown className="w-3 h-3 ml-2 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("pdf")} data-testid="export-pdf">
                    <FileText className="w-4 h-4 mr-2" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("docx")} data-testid="export-docx">
                    <FileText className="w-4 h-4 mr-2" />
                    DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport("html")} data-testid="export-html">
                    <FileText className="w-4 h-4 mr-2" />
                    HTML
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Regenerate with Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    disabled={isRegenerating} 
                    className="h-9 px-4 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 font-medium" 
                    data-testid="button-regenerate-report"
                  >
                    <RefreshCw className={cn("w-4 h-4 mr-2", isRegenerating && "animate-spin")} />
                    {isRegenerating ? "Regenerating..." : "Regenerate"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent data-testid="dialog-regenerate-confirm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Regenerate Report?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will regenerate the report with the most current data. The process may take a few minutes to complete.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel data-testid="button-regenerate-cancel">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRegenerate} data-testid="button-regenerate-confirm">
                      Regenerate
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="summary" className="w-full">
          <div className="border-b border-border">
            <TabsList className="h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="summary" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                data-testid="tab-summary"
              >
                Summary
              </TabsTrigger>
              <TabsTrigger 
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                data-testid="tab-details"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="charts"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                data-testid="tab-charts"
              >
                Charts
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="summary" className="space-y-6 mt-0">
              {/* AI Generated Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">Executive Summary</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
                  <p>
                    November showed strong team performance with 247 commits across all repositories. 
                    The frontend team led contributions with 142 commits, while the backend team 
                    delivered 89 commits focused on API improvements. Code quality remained high 
                    with an average review approval rate of 94%.
                  </p>
                  <p>
                    Key achievements include the completion of the user authentication system, 
                    implementation of the new dashboard interface, and significant performance 
                    optimizations resulting in 23% faster load times.
                  </p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-foreground mb-2">Code Contributions</h4>
                    <p className="text-2xl font-bold text-green-600">247</p>
                    <p className="text-sm text-muted-foreground">Total commits</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-foreground mb-2">Pull Requests</h4>
                    <p className="text-2xl font-bold text-blue-600">42</p>
                    <p className="text-sm text-muted-foreground">Merged this month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-foreground mb-2">Code Reviews</h4>
                    <p className="text-2xl font-bold text-purple-600">94%</p>
                    <p className="text-sm text-muted-foreground">Approval rate</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-0">
              {selectedReport.details ? (
                <>
                  {/* Developer Contributions Table */}
                  <Card data-testid="card-developer-contributions">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Developer Contributions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Developer</TableHead>
                            <TableHead className="text-center">Commits</TableHead>
                            <TableHead className="text-center">PRs</TableHead>
                            <TableHead className="text-center">Reviews</TableHead>
                            <TableHead className="text-center">Lines Added</TableHead>
                            <TableHead className="text-center">Lines Removed</TableHead>
                            <TableHead className="text-center">Efficiency</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedReport.details.developerContributions.map((contributor) => (
                            <TableRow key={contributor.id} data-testid={`contributor-row-${contributor.id}`}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={contributor.avatar} alt={contributor.name} />
                                    <AvatarFallback className="text-xs">
                                      {contributor.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{contributor.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-medium">{contributor.commits}</TableCell>
                              <TableCell className="text-center">{contributor.prs}</TableCell>
                              <TableCell className="text-center">{contributor.reviews}</TableCell>
                              <TableCell className="text-center text-green-600">+{contributor.linesAdded.toLocaleString()}</TableCell>
                              <TableCell className="text-center text-red-600">-{contributor.linesRemoved.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                <div className="flex items-center gap-2">
                                  <Progress value={contributor.efficiency} className="w-12 h-2" />
                                  <span className="text-sm font-medium">{contributor.efficiency}%</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Repository Breakdown Table */}
                  <Card data-testid="card-repo-breakdown">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitCommit className="w-5 h-5 text-primary" />
                        Repository Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Repository</TableHead>
                            <TableHead className="text-center">Commits</TableHead>
                            <TableHead className="text-center">Pull Requests</TableHead>
                            <TableHead className="text-center">Contributors</TableHead>
                            <TableHead className="text-center">Lines Changed</TableHead>
                            <TableHead className="text-center">Activity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedReport.details.repoBreakdown.map((repo) => (
                            <TableRow key={repo.id} data-testid={`repo-row-${repo.id}`}>
                              <TableCell className="font-medium">{repo.name}</TableCell>
                              <TableCell className="text-center">{repo.commits}</TableCell>
                              <TableCell className="text-center">{repo.prs}</TableCell>
                              <TableCell className="text-center">{repo.contributors}</TableCell>
                              <TableCell className="text-center">{repo.linesChanged.toLocaleString()}</TableCell>
                              <TableCell className="text-center">
                                <Badge 
                                  variant={repo.activity === "high" ? "default" : 
                                          repo.activity === "medium" ? "secondary" : "outline"}
                                  className={cn(
                                    repo.activity === "high" && "bg-green-500",
                                    repo.activity === "medium" && "bg-yellow-500",
                                    repo.activity === "low" && "bg-gray-500"
                                  )}
                                >
                                  {repo.activity.charAt(0).toUpperCase() + repo.activity.slice(1)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Top 5 Achievements */}
                  <Card data-testid="card-top-achievements">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-primary" />
                        Top 5 Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedReport.details.topAchievements.map((achievement, index) => (
                          <div 
                            key={achievement.id}
                            className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30"
                            data-testid={`achievement-${achievement.id}`}
                          >
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">#{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {achievement.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{achievement.contributor}</span>
                                <span className="text-sm font-bold text-primary">{achievement.value}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No detailed data available for this report.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="charts" className="space-y-6 mt-0">
              {selectedReport.chartData && selectedReport.chartData ? (
                <>
                  {/* Commit Activity Line Chart */}
                  <Card data-testid="card-commit-activity-chart">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Commit Activity Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedReport.chartData.commitActivity}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="name" 
                              className="text-muted-foreground"
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                              className="text-muted-foreground"
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PR Distribution Pie Chart */}
                    <Card data-testid="card-pr-distribution-chart">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <GitCommit className="w-5 h-5 text-primary" />
                          Pull Request Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={selectedReport.chartData.prDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percentage }) => `${name} ${percentage?.toFixed(1)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {selectedReport.chartData.prDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Workload Distribution Bar Chart */}
                    <Card data-testid="card-workload-distribution-chart">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          Workload Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={selectedReport.chartData.workloadDistribution}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="name" 
                                className="text-muted-foreground"
                                tick={{ fontSize: 10 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                              />
                              <YAxis 
                                className="text-muted-foreground"
                                tick={{ fontSize: 12 }}
                              />
                              <Tooltip 
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--background))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '6px'
                                }}
                              />
                              <Bar 
                                dataKey="value" 
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trend Comparison Chart */}
                  <Card data-testid="card-trend-comparison-chart">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        Monthly Trend Comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={selectedReport.chartData.trendComparison}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis 
                              dataKey="name" 
                              className="text-muted-foreground"
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                              className="text-muted-foreground"
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px'
                              }}
                            />
                            <Bar 
                              dataKey="value" 
                              fill="hsl(var(--primary))"
                              radius={[4, 4, 0, 0]}
                            >
                              {selectedReport.chartData?.trendComparison?.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={index === (selectedReport.chartData?.trendComparison?.length || 0) - 1 ? 
                                    "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No chart data available for this report.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {/* Reports List */}
      <Card data-testid="card-reports-list">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">All Reports</h3>
          <div className="space-y-3">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedReport.id === report.id ? "bg-accent" : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedReport(report)}
                data-testid={`report-item-${report.id}`}
              >
                <div>
                  <h4 className="font-medium text-foreground">{report.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Generated on {report.generatedAt}
                  </p>
                </div>
                <Badge 
                  variant={report.status === "ready" ? "default" : 
                          report.status === "processing" ? "secondary" : "destructive"}
                >
                  {report.status === "ready" ? "Ready" : 
                   report.status === "processing" ? "Processing" : "Failed"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Generation Wizard */}
      <ReportGenerationWizard
        open={showWizard}
        onOpenChange={setShowWizard}
        onComplete={(data) => {
          console.log("Report generation completed:", data);
          // Here you would typically update the reports list or navigate to the new report
        }}
      />
    </motion.div>
  );
}
