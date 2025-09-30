import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  FileText,
  Users,
  Building2,
  Clock,
  GitBranch,
  User,
  Check,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportWizardData } from "@/lib/types";
import { mockWizardRepositories, mockWizardContributors } from "@/lib/mock-data";

interface ReportGenerationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: (data: ReportWizardData) => void;
}

const STEPS = [
  { id: 1, title: "Report Type", description: "Choose what type of report to generate" },
  { id: 2, title: "Time Period", description: "Select the reporting time frame" },
  { id: 3, title: "Scope", description: "Choose repositories and contributors" },
  { id: 4, title: "Confirmation", description: "Review and generate report" }
];

const REPORT_TYPES = [
  {
    id: "developer",
    title: "Developer Report",
    description: "Individual developer performance and contribution analysis",
    icon: User,
    features: ["Individual metrics", "Code quality analysis", "Productivity insights"]
  },
  {
    id: "team",
    title: "Team Report",
    description: "Team collaboration metrics and performance overview",
    icon: Users,
    features: ["Team collaboration", "Sprint analysis", "Workload distribution"]
  },
  {
    id: "organization",
    title: "Organization Report",
    description: "Company-wide development metrics and trends",
    icon: Building2,
    features: ["Cross-team insights", "Technology trends", "Resource allocation"]
  }
];

const TIME_PERIODS = [
  { id: "thisMonth", label: "This Month", description: "Current month data" },
  { id: "lastMonth", label: "Last Month", description: "Previous month data" },
  { id: "custom", label: "Custom Range", description: "Choose specific dates" }
];

export default function ReportGenerationWizard({
  open,
  onOpenChange,
  onComplete
}: ReportGenerationWizardProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [wizardData, setWizardData] = useState<ReportWizardData>({
    step: 1,
    reportType: "",
    timePeriod: "",
    customDateRange: undefined,
    selectedRepositories: [],
    selectedContributors: []
  });

  const currentStep = STEPS.find(step => step.id === wizardData.step);
  const progress = (wizardData.step / STEPS.length) * 100;

  const handleNext = () => {
    if (wizardData.step < STEPS.length) {
      setWizardData(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handlePrev = () => {
    if (wizardData.step > 1) {
      setWizardData(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleClose = () => {
    setWizardData({
      step: 1,
      reportType: "",
      timePeriod: "",
      customDateRange: undefined,
      selectedRepositories: [],
      selectedContributors: []
    });
    onOpenChange(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report Generation Started",
        description: "Your report is being generated and will be available shortly.",
      });

      onComplete?.(wizardData);
      handleClose();
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceed = () => {
    switch (wizardData.step) {
      case 1:
        return wizardData.reportType !== "";
      case 2:
        return wizardData.timePeriod !== "" && 
               (wizardData.timePeriod !== "custom" || wizardData.customDateRange);
      case 3:
        return wizardData.selectedRepositories.length > 0 || 
               wizardData.selectedContributors.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleRepositoryToggle = (repoId: string) => {
    setWizardData(prev => ({
      ...prev,
      selectedRepositories: prev.selectedRepositories.includes(repoId)
        ? prev.selectedRepositories.filter(id => id !== repoId)
        : [...prev.selectedRepositories, repoId]
    }));
  };

  const handleContributorToggle = (contributorId: string) => {
    setWizardData(prev => ({
      ...prev,
      selectedContributors: prev.selectedContributors.includes(contributorId)
        ? prev.selectedContributors.filter(id => id !== contributorId)
        : [...prev.selectedContributors, contributorId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="dialog-report-wizard">
        <DialogHeader className="relative pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-8 w-8 flex items-center justify-center"
            onClick={handleClose}
            data-testid="button-close-wizard"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-2xl pr-10">Generate Report</DialogTitle>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {wizardData.step} of {STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" data-testid="progress-wizard" />
            <div className="flex items-center justify-between sm:justify-start sm:space-x-6">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-colors",
                      step.id <= wizardData.step 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    )}
                    data-testid={`step-indicator-${step.id}`}
                  >
                    {step.id < wizardData.step ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block min-w-0">
                    <div className="text-sm font-medium leading-tight">{step.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="w-12 h-px bg-border ml-6 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Report Type */}
            {wizardData.step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                data-testid="step-report-type"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Select Report Type</h3>
                    <p className="text-muted-foreground">Choose the type of report you want to generate</p>
                  </div>
                  
                  <RadioGroup
                    value={wizardData.reportType}
                    onValueChange={(value) => setWizardData(prev => ({ ...prev, reportType: value as ReportWizardData["reportType"] }))}
                    className="space-y-4"
                    data-testid="radio-group-report-type"
                  >
                    {REPORT_TYPES.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <div key={type.id} className="relative">
                          <RadioGroupItem
                            value={type.id}
                            id={type.id}
                            className="peer sr-only"
                            data-testid={`radio-report-type-${type.id}`}
                          />
                          <Label
                            htmlFor={type.id}
                            className="flex items-start space-x-4 p-5 rounded-lg border-2 border-muted cursor-pointer hover:border-muted-foreground/20 peer-checked:border-primary peer-checked:bg-primary/5 transition-all duration-200"
                          >
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground mb-1">{type.title}</div>
                              <div className="text-sm text-muted-foreground mb-3">{type.description}</div>
                              <div className="flex flex-wrap gap-2">
                                {type.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 2: Time Period */}
            {wizardData.step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                data-testid="step-time-period"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Select Time Period</h3>
                    <p className="text-muted-foreground">Choose the time frame for your report</p>
                  </div>

                  <RadioGroup
                    value={wizardData.timePeriod}
                    onValueChange={(value) => setWizardData(prev => ({ ...prev, timePeriod: value as ReportWizardData["timePeriod"] }))}
                    className="space-y-3"
                    data-testid="radio-group-time-period"
                  >
                    {TIME_PERIODS.map((period) => (
                      <div key={period.id} className="relative">
                        <RadioGroupItem
                          value={period.id}
                          id={period.id}
                          className="peer sr-only"
                          data-testid={`radio-time-period-${period.id}`}
                        />
                        <Label
                          htmlFor={period.id}
                          className="flex items-center space-x-3 p-4 rounded-lg border-2 border-muted cursor-pointer hover:border-muted-foreground/20 peer-checked:border-primary peer-checked:bg-primary/5 transition-all duration-200"
                        >
                          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-foreground leading-tight">{period.label}</div>
                            <div className="text-sm text-muted-foreground mt-1">{period.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {wizardData.timePeriod === "custom" && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">Custom Date Range</Label>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full sm:w-48 justify-start text-left font-normal h-10",
                                    !wizardData.customDateRange?.from && "text-muted-foreground"
                                  )}
                                  data-testid="button-date-from"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">
                                    {wizardData.customDateRange?.from ? (
                                      format(wizardData.customDateRange.from, "PPP")
                                    ) : (
                                      "From date"
                                    )}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={wizardData.customDateRange?.from}
                                  onSelect={(date) => 
                                    setWizardData(prev => ({
                                      ...prev,
                                      customDateRange: {
                                        ...prev.customDateRange,
                                        from: date || new Date(),
                                        to: prev.customDateRange?.to || new Date()
                                      }
                                    }))
                                  }
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            
                            <span className="text-muted-foreground self-center hidden sm:block">to</span>
                            <span className="text-muted-foreground text-sm sm:hidden">To</span>
                            
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full sm:w-48 justify-start text-left font-normal h-10",
                                    !wizardData.customDateRange?.to && "text-muted-foreground"
                                  )}
                                  data-testid="button-date-to"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">
                                    {wizardData.customDateRange?.to ? (
                                      format(wizardData.customDateRange.to, "PPP")
                                    ) : (
                                      "To date"
                                    )}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={wizardData.customDateRange?.to}
                                  onSelect={(date) => 
                                    setWizardData(prev => ({
                                      ...prev,
                                      customDateRange: {
                                        ...prev.customDateRange,
                                        from: prev.customDateRange?.from || new Date(),
                                        to: date || new Date()
                                      }
                                    }))
                                  }
                                  disabled={(date) => {
                                    const today = new Date();
                                    const fromDate = wizardData.customDateRange?.from;
                                    return date > today || (fromDate ? date < fromDate : false);
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Repositories & Contributors */}
            {wizardData.step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                data-testid="step-scope"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Select Scope</h3>
                    <p className="text-muted-foreground">Choose repositories and contributors to include</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Repositories */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 mb-1">
                            <GitBranch className="w-5 h-5 text-primary flex-shrink-0" />
                            <Label className="text-sm font-medium">Repositories</Label>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {mockWizardRepositories.map((repo) => (
                              <div key={repo.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  id={`repo-${repo.id}`}
                                  checked={wizardData.selectedRepositories.includes(repo.id)}
                                  onCheckedChange={() => handleRepositoryToggle(repo.id)}
                                  className="mt-0.5 flex-shrink-0"
                                  data-testid={`checkbox-repo-${repo.id}`}
                                />
                                <Label htmlFor={`repo-${repo.id}`} className="flex-1 cursor-pointer min-w-0">
                                  <div className="font-medium text-sm leading-tight">{repo.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1 truncate">{repo.description}</div>
                                </Label>
                              </div>
                            ))}
                          </div>
                          {wizardData.selectedRepositories.length > 0 && (
                            <div className="pt-2 border-t">
                              <div className="text-xs text-muted-foreground mb-2">Selected:</div>
                              <div className="flex flex-wrap gap-1">
                                {wizardData.selectedRepositories.map((repoId) => {
                                  const repo = mockWizardRepositories.find(r => r.id === repoId);
                                  return repo ? (
                                    <Badge key={repoId} variant="secondary" className="text-xs">
                                      {repo.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contributors */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 mb-1">
                            <Users className="w-5 h-5 text-primary flex-shrink-0" />
                            <Label className="text-sm font-medium">Contributors</Label>
                          </div>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {mockWizardContributors.map((contributor) => (
                              <div key={contributor.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                <Checkbox
                                  id={`contributor-${contributor.id}`}
                                  checked={wizardData.selectedContributors.includes(contributor.id)}
                                  onCheckedChange={() => handleContributorToggle(contributor.id)}
                                  className="flex-shrink-0"
                                  data-testid={`checkbox-contributor-${contributor.id}`}
                                />
                                <Avatar className="w-8 h-8 flex-shrink-0">
                                  <AvatarImage src={contributor.avatar} alt={contributor.name} />
                                  <AvatarFallback className="text-xs font-medium">
                                    {contributor.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <Label htmlFor={`contributor-${contributor.id}`} className="flex-1 cursor-pointer min-w-0">
                                  <div className="font-medium text-sm leading-tight">{contributor.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">@{contributor.username}</div>
                                </Label>
                              </div>
                            ))}
                          </div>
                          {wizardData.selectedContributors.length > 0 && (
                            <div className="pt-2 border-t">
                              <div className="text-xs text-muted-foreground mb-2">Selected:</div>
                              <div className="flex flex-wrap gap-1">
                                {wizardData.selectedContributors.map((contributorId) => {
                                  const contributor = mockWizardContributors.find(c => c.id === contributorId);
                                  return contributor ? (
                                    <Badge key={contributorId} variant="secondary" className="text-xs">
                                      {contributor.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {wizardData.step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                data-testid="step-confirmation"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Review & Generate</h3>
                    <p className="text-muted-foreground">Review your selections and generate the report</p>
                  </div>

                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Report Type</Label>
                          <div className="text-foreground">
                            {REPORT_TYPES.find(t => t.id === wizardData.reportType)?.title}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Time Period</Label>
                          <div className="text-foreground">
                            {wizardData.timePeriod === "custom" && wizardData.customDateRange ? (
                              `${format(wizardData.customDateRange.from, "MMM d, yyyy")} - ${format(wizardData.customDateRange.to, "MMM d, yyyy")}`
                            ) : (
                              TIME_PERIODS.find(p => p.id === wizardData.timePeriod)?.label
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Selected Repositories ({wizardData.selectedRepositories.length})
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {wizardData.selectedRepositories.length > 0 ? (
                            wizardData.selectedRepositories.map((repoId) => {
                              const repo = mockWizardRepositories.find(r => r.id === repoId);
                              return repo ? (
                                <Badge key={repoId} variant="outline" className="px-2 py-1">
                                  {repo.name}
                                </Badge>
                              ) : null;
                            })
                          ) : (
                            <span className="text-muted-foreground text-sm">All repositories</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">
                          Selected Contributors ({wizardData.selectedContributors.length})
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {wizardData.selectedContributors.length > 0 ? (
                            wizardData.selectedContributors.map((contributorId) => {
                              const contributor = mockWizardContributors.find(c => c.id === contributorId);
                              return contributor ? (
                                <Badge key={contributorId} variant="outline" className="px-2 py-1">
                                  {contributor.name}
                                </Badge>
                              ) : null;
                            })
                          ) : (
                            <span className="text-muted-foreground text-sm">All contributors</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={wizardData.step === 1}
            className="h-10 px-4 flex items-center justify-center gap-2"
            data-testid="button-wizard-prev"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="flex items-center space-x-3">
            {wizardData.step < STEPS.length ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-10 px-4 flex items-center justify-center gap-2"
                data-testid="button-wizard-next"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={!canProceed() || isGenerating}
                className="h-10 px-4 flex items-center justify-center gap-2"
                data-testid="button-generate-final"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Generate Report</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}