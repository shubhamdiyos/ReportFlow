export interface KPI {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: string;
  color: string;
}

export interface Team {
  id: string;
  name: string;
  status: "active" | "planning" | "inactive";
  memberCount: number;
  commits: number;
  prs: number;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Developer {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string;
  commits: number;
  reviews: number;
  linesOfCode: string;
  aiSummary: string;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  visibility: "public" | "private";
  commits: number;
  lastSync: string;
  syncStatus: "success" | "failed" | "pending";
  included: boolean;
}

export interface Report {
  id: string;
  title: string;
  type: "team" | "individual" | "repository";
  dateRange: string;
  generatedAt: string;
  status: "ready" | "processing" | "failed";
  summary?: string;
  details?: ReportDetails;
  chartData?: ReportChartData;
}

export interface ChartDrillDownData {
  title: string;
  data: ChartData[];
  type: "line" | "bar" | "area";
  description: string;
}

export interface LiveChartUpdate {
  timestamp: string;
  data: ChartData[];
  changeType: "incremental" | "full";
}

export interface ReportDetails {
  developerContributions: DeveloperContribution[];
  repoBreakdown: RepoBreakdown[];
  topAchievements: Achievement[];
}

export interface DeveloperContribution {
  id: string;
  name: string;
  avatar: string;
  commits: number;
  prs: number;
  reviews: number;
  linesAdded: number;
  linesRemoved: number;
  efficiency: number;
}

export interface RepoBreakdown {
  id: string;
  name: string;
  commits: number;
  prs: number;
  contributors: number;
  linesChanged: number;
  activity: "high" | "medium" | "low";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  contributor: string;
  value: string;
  type: "commits" | "reviews" | "features" | "fixes" | "docs";
}

export interface ReportChartData {
  commitActivity: ChartData[];
  prDistribution: ChartData[];
  workloadDistribution: ChartData[];
  trendComparison: ChartData[];
}

export interface ReportWizardData {
  step: number;
  reportType: "developer" | "team" | "organization" | "";
  timePeriod: "thisMonth" | "lastMonth" | "custom" | "";
  customDateRange?: {
    from: Date;
    to: Date;
  };
  selectedRepositories: string[];
  selectedContributors: string[];
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  color?: string;
  percentage?: number;
  // Enhanced data for interactivity
  trend?: "up" | "down" | "stable";
  previousValue?: number;
  changePercent?: number;
  details?: {
    commits?: number;
    pullRequests?: number;
    linesAdded?: number;
    linesRemoved?: number;
    reviewComments?: number;
    [key: string]: any;
  };
  drillDown?: ChartData[];
}

export interface AdminStatus {
  githubApp: "connected" | "disconnected" | "error";
  apiUsage: {
    current: number;
    limit: number;
  };
  failedJobs: number;
  aiTokenCost: number;
}

export interface ManagementUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  role: "developer" | "manager" | "admin";
  status: "active" | "inactive" | "pending";
  joinedOn: string;
  lastActive: string;
  invitedBy?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "security" | "system";
  isRead: boolean;
  timestamp: string;
  actionUrl?: string;
  actionText?: string;
  source?: {
    type: "repository" | "user" | "system" | "report";
    name: string;
    id?: string;
  };
}

// Billing-related types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly";
  features: string[];
  popular?: boolean;
  description: string;
  maxReports: number | "unlimited";
  maxRepositories: number | "unlimited";
  maxUsers: number | "unlimited";
  support: "community" | "email" | "priority";
}

export interface CurrentSubscription {
  id: string;
  planId: string;
  planName: string;
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  interval: "monthly" | "yearly";
}

export interface PaymentMethod {
  id: string;
  type: "card";
  brand: "visa" | "mastercard" | "amex" | "discover";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "failed";
  amount: number;
  currency: string;
  description: string;
  downloadUrl?: string;
  paymentMethod?: string;
}

export interface BillingData {
  currentSubscription: CurrentSubscription;
  availablePlans: SubscriptionPlan[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
}

// Alias for backward compatibility
export type ChartDataPoint = ChartData;
