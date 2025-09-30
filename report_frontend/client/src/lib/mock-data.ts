import { KPI, Team, Developer, Repository, Report, AdminStatus, ChartData, ReportDetails, ReportChartData, DeveloperContribution, RepoBreakdown, Achievement, ManagementUser, Notification, SubscriptionPlan, CurrentSubscription, PaymentMethod, Invoice, BillingData } from "./types";

// Role-based KPI data - different metrics for different roles
export const mockKPIsByRole = {
  admin: [
    {
      id: "1",
      title: "Total Commits",
      value: 1247,
      change: "+12%",
      changeType: "positive" as const,
      icon: "git-commit",
      color: "primary"
    },
    {
      id: "2",
      title: "Active Users",
      value: 24,
      change: "+3",
      changeType: "positive" as const,
      icon: "users",
      color: "blue-500"
    },
    {
      id: "3",
      title: "API Usage",
      value: "68%",
      change: "+5%",
      changeType: "positive" as const,
      icon: "activity",
      color: "green-500"
    },
    {
      id: "4",
      title: "Monthly Revenue",
      value: "$2,890",
      change: "+18%",
      changeType: "positive" as const,
      icon: "dollar-sign",
      color: "purple-500"
    }
  ],
  manager: [
    {
      id: "1",
      title: "Team Commits",
      value: 892,
      change: "+15%",
      changeType: "positive" as const,
      icon: "git-commit",
      color: "primary"
    },
    {
      id: "2",
      title: "Pull Requests",
      value: 156,
      change: "+8%",
      changeType: "positive" as const,
      icon: "git-pull-request",
      color: "blue-500"
    },
    {
      id: "3",
      title: "Code Reviews",
      value: 234,
      change: "+22%",
      changeType: "positive" as const,
      icon: "eye",
      color: "green-500"
    },
    {
      id: "4",
      title: "Team Reports",
      value: 8,
      change: "+2",
      changeType: "positive" as const,
      icon: "file-text",
      color: "purple-500"
    }
  ],
  developer: [
    {
      id: "1",
      title: "My Commits",
      value: 142,
      change: "+18%",
      changeType: "positive" as const,
      icon: "git-commit",
      color: "primary"
    },
    {
      id: "2",
      title: "PRs Created",
      value: 28,
      change: "+12%",
      changeType: "positive" as const,
      icon: "git-pull-request",
      color: "blue-500"
    },
    {
      id: "3",
      title: "Code Reviews",
      value: 45,
      change: "+8%",
      changeType: "positive" as const,
      icon: "eye",
      color: "green-500"
    },
    {
      id: "4",
      title: "Lines of Code",
      value: "+3.2k",
      change: "+25%",
      changeType: "positive" as const,
      icon: "code",
      color: "purple-500"
    }
  ]
};

// Fallback for compatibility
export const mockKPIs = mockKPIsByRole.admin;

export const mockTeams: Team[] = [
  {
    id: "1",
    name: "Frontend Team",
    status: "active",
    memberCount: 5,
    commits: 142,
    prs: 23,
    members: [
      { id: "1", name: "John Doe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32", role: "Senior Frontend" },
      { id: "2", name: "Jane Smith", avatar: "https://images.unsplash.com/photo-1494790108755-2616c67e2a01?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32", role: "Frontend Dev" }
    ]
  },
  {
    id: "2",
    name: "Backend Team",
    status: "active",
    memberCount: 3,
    commits: 89,
    prs: 15,
    members: [
      { id: "3", name: "Mike Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32", role: "Backend Lead" }
    ]
  },
  {
    id: "3",
    name: "DevOps Team",
    status: "planning",
    memberCount: 2,
    commits: 45,
    prs: 8,
    members: [
      { id: "4", name: "Sarah Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32", role: "DevOps Engineer" }
    ]
  }
];

export const mockDevelopers: Developer[] = [
  {
    id: "1",
    name: "John Doe",
    username: "johndoe",
    role: "Senior Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    commits: 89,
    reviews: 23,
    linesOfCode: "+2.1k",
    aiSummary: "Strong contributor with consistent commits and thorough code reviews. Shows excellent problem-solving skills."
  },
  {
    id: "2",
    name: "Sarah Wilson",
    username: "sarahw",
    role: "Backend Engineer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    commits: 67,
    reviews: 31,
    linesOfCode: "+1.8k",
    aiSummary: "Excellent problem-solving skills with focus on API development and testing. Consistently delivers high-quality code."
  },
  {
    id: "3",
    name: "Mike Chen",
    username: "mikechen",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    commits: 142,
    reviews: 18,
    linesOfCode: "+3.2k",
    aiSummary: "Highly productive developer with expertise across frontend and backend technologies. Great mentor to junior developers."
  }
];

export const mockRepositories: Repository[] = [
  {
    id: "1",
    name: "frontend-app",
    description: "React-based frontend application",
    language: "TypeScript",
    visibility: "private",
    commits: 45,
    lastSync: "2 hours ago",
    syncStatus: "success",
    included: true
  },
  {
    id: "2",
    name: "backend-api",
    description: "Node.js API server with Express",
    language: "JavaScript",
    visibility: "private",
    commits: 32,
    lastSync: "1 hour ago",
    syncStatus: "success",
    included: true
  },
  {
    id: "3",
    name: "mobile-app",
    description: "React Native mobile application",
    language: "TypeScript",
    visibility: "private",
    commits: 18,
    lastSync: "3 days ago",
    syncStatus: "failed",
    included: false
  },
  {
    id: "4",
    name: "data-pipeline",
    description: "ETL pipeline for data processing",
    language: "Python",
    visibility: "private",
    commits: 76,
    lastSync: "30 minutes ago",
    syncStatus: "success",
    included: true
  },
  {
    id: "5",
    name: "docs-website",
    description: "Documentation website built with Docusaurus",
    language: "JavaScript",
    visibility: "public",
    commits: 12,
    lastSync: "Never",
    syncStatus: "pending",
    included: false
  },
  {
    id: "6",
    name: "ci-cd-scripts",
    description: "Continuous integration and deployment scripts",
    language: "Shell",
    visibility: "private",
    commits: 8,
    lastSync: "5 hours ago",
    syncStatus: "failed",
    included: true
  },
  {
    id: "7",
    name: "design-system",
    description: "Component library and design tokens",
    language: "TypeScript",
    visibility: "public",
    commits: 24,
    lastSync: "Syncing...",
    syncStatus: "pending",
    included: true
  }
];

export const mockReports: Report[] = [
  {
    id: "1",
    title: "November 2024 Team Report",
    type: "team",
    dateRange: "Nov 1 - Nov 30, 2024",
    generatedAt: "Dec 1, 2024",
    status: "ready",
    summary: "Strong month with 15% increase in commits and improved collaboration metrics. Team efficiency up 12% with notable contributions across all repositories.",
    details: {
      developerContributions: [
        {
          id: "1",
          name: "John Doe",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
          commits: 89,
          prs: 23,
          reviews: 45,
          linesAdded: 3420,
          linesRemoved: 1250,
          efficiency: 94
        },
        {
          id: "2",
          name: "Sarah Wilson",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
          commits: 67,
          prs: 31,
          reviews: 52,
          linesAdded: 2890,
          linesRemoved: 980,
          efficiency: 91
        },
        {
          id: "3",
          name: "Mike Chen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
          commits: 142,
          prs: 18,
          reviews: 38,
          linesAdded: 4120,
          linesRemoved: 1560,
          efficiency: 96
        }
      ],
      repoBreakdown: [
        {
          id: "1",
          name: "frontend-app",
          commits: 156,
          prs: 34,
          contributors: 5,
          linesChanged: 8450,
          activity: "high"
        },
        {
          id: "2",
          name: "backend-api",
          commits: 89,
          prs: 28,
          contributors: 3,
          linesChanged: 5670,
          activity: "medium"
        },
        {
          id: "3",
          name: "mobile-app",
          commits: 45,
          prs: 12,
          contributors: 2,
          linesChanged: 2340,
          activity: "low"
        }
      ],
      topAchievements: [
        {
          id: "1",
          title: "Most Commits",
          description: "Highest number of commits this month",
          contributor: "Mike Chen",
          value: "142 commits",
          type: "commits"
        },
        {
          id: "2",
          title: "Code Review Champion",
          description: "Most helpful code reviews",
          contributor: "Sarah Wilson",
          value: "52 reviews",
          type: "reviews"
        },
        {
          id: "3",
          title: "Feature Delivery",
          description: "Successfully delivered 3 major features",
          contributor: "John Doe",
          value: "3 features",
          type: "features"
        },
        {
          id: "4",
          title: "Bug Hunter",
          description: "Fixed critical production issues",
          contributor: "Sarah Wilson",
          value: "12 bugs fixed",
          type: "fixes"
        },
        {
          id: "5",
          title: "Documentation Star",
          description: "Improved documentation coverage",
          contributor: "Mike Chen",
          value: "15 docs updated",
          type: "docs"
        }
      ]
    },
    chartData: {
      commitActivity: [
        { name: "Week 1", value: 42, date: "Nov 1-7" },
        { name: "Week 2", value: 58, date: "Nov 8-14" },
        { name: "Week 3", value: 72, date: "Nov 15-21" },
        { name: "Week 4", value: 89, date: "Nov 22-28" },
        { name: "Week 5", value: 37, date: "Nov 29-30" }
      ],
      prDistribution: [
        { name: "Merged", value: 65, color: "#22c55e", percentage: 72.2 },
        { name: "Open", value: 18, color: "#3b82f6", percentage: 20.0 },
        { name: "Closed", value: 7, color: "#ef4444", percentage: 7.8 }
      ],
      workloadDistribution: [
        { name: "John Doe", value: 89 },
        { name: "Sarah Wilson", value: 67 },
        { name: "Mike Chen", value: 142 },
        { name: "Alex Smith", value: 34 },
        { name: "Emma Davis", value: 56 }
      ],
      trendComparison: [
        { name: "Sep", value: 245 },
        { name: "Oct", value: 298 },
        { name: "Nov", value: 342 },
        { name: "Dec", value: 289 }
      ]
    }
  },
  {
    id: "2",
    title: "Q4 Developer Performance",
    type: "individual",
    dateRange: "Oct 1 - Dec 31, 2024",
    generatedAt: "Nov 28, 2024",
    status: "processing",
    summary: "Quarterly performance review showing consistent growth and strong collaboration skills."
  },
  {
    id: "3",
    title: "October Repository Analysis",
    type: "repository",
    dateRange: "Oct 1 - Oct 31, 2024",
    generatedAt: "Nov 15, 2024",
    status: "ready",
    summary: "Repository health metrics show strong activity with room for improvement in code review coverage."
  }
];

export const mockWizardRepositories = [
  { id: "1", name: "frontend-app", description: "React-based frontend application", included: true },
  { id: "2", name: "backend-api", description: "Node.js API server", included: true },
  { id: "3", name: "mobile-app", description: "React Native mobile app", included: false },
  { id: "4", name: "analytics-service", description: "Data analytics microservice", included: false },
  { id: "5", name: "auth-service", description: "Authentication service", included: true }
];

export const mockWizardContributors = [
  { id: "1", name: "John Doe", username: "johndoe", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" },
  { id: "2", name: "Sarah Wilson", username: "sarahw", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" },
  { id: "3", name: "Mike Chen", username: "mikechen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" },
  { id: "4", name: "Alex Smith", username: "alexsmith", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" },
  { id: "5", name: "Emma Davis", username: "emmad", avatar: "https://images.unsplash.com/photo-1494790108755-2616c67e2a01?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32" }
];

export const mockAdminStatus: AdminStatus = {
  githubApp: "connected",
  apiUsage: {
    current: 2847,
    limit: 5000
  },
  failedJobs: 3,
  aiTokenCost: 127.45
};

export const mockManagementUsers: ManagementUser[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    username: "johndoe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    role: "manager",
    status: "active",
    joinedOn: "2024-01-15",
    lastActive: "2 hours ago",
    invitedBy: "Admin"
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    username: "sarahw",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    role: "developer",
    status: "active",
    joinedOn: "2024-02-20",
    lastActive: "1 day ago",
    invitedBy: "John Doe"
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    username: "mikechen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    role: "developer",
    status: "active",
    joinedOn: "2024-03-10",
    lastActive: "30 minutes ago",
    invitedBy: "John Doe"
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    username: "emilyrod",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c67e2a01?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    role: "admin",
    status: "active",
    joinedOn: "2023-11-08",
    lastActive: "5 minutes ago",
    invitedBy: "System"
  },
  {
    id: "5",
    name: "David Kim",
    email: "david.kim@company.com",
    username: "davidkim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    role: "developer",
    status: "inactive",
    joinedOn: "2024-01-25",
    lastActive: "2 weeks ago",
    invitedBy: "John Doe"
  },
  {
    id: "6",
    name: "Lisa Zhang",
    email: "lisa.zhang@company.com",
    username: "lisazhang",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48",
    role: "manager",
    status: "pending",
    joinedOn: "2024-12-20",
    lastActive: "Never",
    invitedBy: "Emily Rodriguez"
  }
];

export const mockChartData: ChartData[] = [
  { 
    name: "Week 1", 
    value: 45, 
    date: "2024-12-01", 
    previousValue: 38,
    changePercent: 18.4,
    trend: "up",
    details: {
      commits: 32,
      pullRequests: 8,
      linesAdded: 2340,
      linesRemoved: 890,
      reviewComments: 15
    },
    drillDown: [
      { name: "Mon", value: 8, date: "2024-12-02" },
      { name: "Tue", value: 12, date: "2024-12-03" },
      { name: "Wed", value: 15, date: "2024-12-04" },
      { name: "Thu", value: 7, date: "2024-12-05" },
      { name: "Fri", value: 3, date: "2024-12-06" }
    ]
  },
  { 
    name: "Week 2", 
    value: 78, 
    date: "2024-12-08", 
    previousValue: 45,
    changePercent: 73.3,
    trend: "up",
    details: {
      commits: 58,
      pullRequests: 14,
      linesAdded: 4120,
      linesRemoved: 1230,
      reviewComments: 27
    },
    drillDown: [
      { name: "Mon", value: 18, date: "2024-12-09" },
      { name: "Tue", value: 22, date: "2024-12-10" },
      { name: "Wed", value: 19, date: "2024-12-11" },
      { name: "Thu", value: 12, date: "2024-12-12" },
      { name: "Fri", value: 7, date: "2024-12-13" }
    ]
  },
  { 
    name: "Week 3", 
    value: 92, 
    date: "2024-12-15", 
    previousValue: 78,
    changePercent: 17.9,
    trend: "up",
    details: {
      commits: 67,
      pullRequests: 18,
      linesAdded: 5890,
      linesRemoved: 2100,
      reviewComments: 34
    },
    drillDown: [
      { name: "Mon", value: 25, date: "2024-12-16" },
      { name: "Tue", value: 28, date: "2024-12-17" },
      { name: "Wed", value: 21, date: "2024-12-18" },
      { name: "Thu", value: 13, date: "2024-12-19" },
      { name: "Fri", value: 5, date: "2024-12-20" }
    ]
  },
  { 
    name: "Week 4", 
    value: 156, 
    date: "2024-12-22", 
    previousValue: 92,
    changePercent: 69.6,
    trend: "up",
    details: {
      commits: 89,
      pullRequests: 23,
      linesAdded: 8940,
      linesRemoved: 2890,
      reviewComments: 45
    },
    drillDown: [
      { name: "Mon", value: 45, date: "2024-12-23" },
      { name: "Tue", value: 52, date: "2024-12-24" },
      { name: "Wed", value: 38, date: "2024-12-25" },
      { name: "Thu", value: 15, date: "2024-12-26" },
      { name: "Fri", value: 6, date: "2024-12-27" }
    ]
  },
  { 
    name: "Week 5", 
    value: 134, 
    date: "2024-12-29", 
    previousValue: 156,
    changePercent: -14.1,
    trend: "down",
    details: {
      commits: 73,
      pullRequests: 19,
      linesAdded: 6780,
      linesRemoved: 3200,
      reviewComments: 38
    },
    drillDown: [
      { name: "Mon", value: 32, date: "2024-12-30" },
      { name: "Tue", value: 38, date: "2024-12-31" },
      { name: "Wed", value: 34, date: "2025-01-01" },
      { name: "Thu", value: 22, date: "2025-01-02" },
      { name: "Fri", value: 8, date: "2025-01-03" }
    ]
  }
];

export const mockTopContributors: ChartData[] = [
  { 
    name: "Mike Chen", 
    value: 142, 
    previousValue: 128,
    changePercent: 10.9,
    trend: "up",
    details: {
      commits: 89,
      pullRequests: 23,
      linesAdded: 12340,
      linesRemoved: 4560,
      reviewComments: 67
    },
    drillDown: [
      { name: "Frontend", value: 78, details: { commits: 45, pullRequests: 12 } },
      { name: "Backend", value: 52, details: { commits: 32, pullRequests: 8 } },
      { name: "DevOps", value: 12, details: { commits: 12, pullRequests: 3 } }
    ]
  },
  { 
    name: "John Doe", 
    value: 89, 
    previousValue: 95,
    changePercent: -6.3,
    trend: "down",
    details: {
      commits: 67,
      pullRequests: 18,
      linesAdded: 8940,
      linesRemoved: 2340,
      reviewComments: 45
    },
    drillDown: [
      { name: "Frontend", value: 45, details: { commits: 28, pullRequests: 9 } },
      { name: "Backend", value: 34, details: { commits: 25, pullRequests: 7 } },
      { name: "Testing", value: 10, details: { commits: 14, pullRequests: 2 } }
    ]
  },
  { 
    name: "Sarah Wilson", 
    value: 67, 
    previousValue: 62,
    changePercent: 8.1,
    trend: "up",
    details: {
      commits: 45,
      pullRequests: 15,
      linesAdded: 6780,
      linesRemoved: 1890,
      reviewComments: 32
    },
    drillDown: [
      { name: "Backend", value: 38, details: { commits: 25, pullRequests: 8 } },
      { name: "API", value: 21, details: { commits: 15, pullRequests: 5 } },
      { name: "Database", value: 8, details: { commits: 5, pullRequests: 2 } }
    ]
  },
  { 
    name: "Alex Park", 
    value: 54, 
    previousValue: 48,
    changePercent: 12.5,
    trend: "up",
    details: {
      commits: 34,
      pullRequests: 12,
      linesAdded: 4560,
      linesRemoved: 1230,
      reviewComments: 28
    },
    drillDown: [
      { name: "Mobile", value: 32, details: { commits: 22, pullRequests: 7 } },
      { name: "Web", value: 15, details: { commits: 8, pullRequests: 3 } },
      { name: "Testing", value: 7, details: { commits: 4, pullRequests: 2 } }
    ]
  },
  { 
    name: "Emma Davis", 
    value: 43, 
    previousValue: 39,
    changePercent: 10.3,
    trend: "up",
    details: {
      commits: 28,
      pullRequests: 9,
      linesAdded: 3240,
      linesRemoved: 890,
      reviewComments: 21
    },
    drillDown: [
      { name: "Frontend", value: 25, details: { commits: 18, pullRequests: 6 } },
      { name: "UI/UX", value: 12, details: { commits: 7, pullRequests: 2 } },
      { name: "Documentation", value: 6, details: { commits: 3, pullRequests: 1 } }
    ]
  }
];

// Live update simulation data
export const generateLiveChartUpdate = (): ChartData[] => {
  return mockChartData.map(item => ({
    ...item,
    value: item.value + Math.floor(Math.random() * 10) - 5, // ±5 random variation
    details: {
      ...item.details!,
      commits: item.details!.commits! + Math.floor(Math.random() * 5),
      pullRequests: item.details!.pullRequests! + Math.floor(Math.random() * 3)
    }
  }));
};

export const generateLiveContributorUpdate = (): ChartData[] => {
  return mockTopContributors.map(item => ({
    ...item,
    value: Math.max(0, item.value + Math.floor(Math.random() * 6) - 3), // ±3 random variation
    details: {
      ...item.details!,
      commits: item.details!.commits! + Math.floor(Math.random() * 3),
      reviewComments: item.details!.reviewComments! + Math.floor(Math.random() * 2)
    }
  }));
};

// Role-based notifications
export const mockNotificationsByRole = {
  admin: [
    {
      id: "1",
      title: "System Alert",
      message: "API rate limit reached 85%. Consider upgrading plan.",
      type: "warning" as const,
      isRead: false,
      timestamp: "2024-09-26T08:30:00Z",
      actionUrl: "/billing",
      actionText: "Upgrade Plan",
      source: {
        type: "system",
        name: "API Monitor"
      }
    },
    {
      id: "2",
      title: "New User Registration",
      message: "Alex Rodriguez has requested access as Manager",
      type: "info" as const,
      isRead: false,
      timestamp: "2024-09-26T07:00:00Z",
      actionUrl: "/admin",
      actionText: "Review Request",
      source: {
        type: "user",
        name: "Alex Rodriguez",
        id: "user-pending-1"
      }
    },
    {
      id: "3",
      title: "Security Alert",
      message: "Failed login attempts detected from unusual location",
      type: "security" as const,
      isRead: false,
      timestamp: "2024-09-26T06:15:00Z",
      actionUrl: "/admin",
      actionText: "Review Security",
      source: {
        type: "system",
        name: "Security Monitor"
      }
    }
  ],
  manager: [
    {
      id: "4",
      title: "Team Report Ready",
      message: "Weekly team productivity report has been generated",
      type: "success" as const,
      isRead: false,
      timestamp: "2024-09-26T08:00:00Z",
      actionUrl: "/reports",
      actionText: "View Report",
      source: {
        type: "report",
        name: "Team Weekly Report",
        id: "report-456"
      }
    },
    {
      id: "5",
      title: "New Team Member",
      message: "Sarah Wilson has joined the Frontend Team",
      type: "info" as const,
      isRead: false,
      timestamp: "2024-09-26T07:30:00Z",
      actionUrl: "/teams",
      actionText: "View Team",
      source: {
        type: "user",
        name: "Sarah Wilson",
        id: "user-2"
      }
    },
    {
      id: "6",
      title: "Repository Sync Issue",
      message: "Frontend-app repository sync failed - permissions needed",
      type: "error" as const,
      isRead: false,
      timestamp: "2024-09-26T06:45:00Z",
      actionUrl: "/repositories",
      actionText: "Fix Sync",
      source: {
        type: "repository",
        name: "frontend-app",
        id: "repo-1"
      }
    }
  ],
  developer: [
    {
      id: "7",
      title: "Code Review Request",
      message: "John Doe requested review for PR #234 in frontend-app",
      type: "info" as const,
      isRead: false,
      timestamp: "2024-09-26T08:30:00Z",
      actionUrl: "/repositories",
      actionText: "Review PR",
      source: {
        type: "repository",
        name: "frontend-app",
        id: "repo-1"
      }
    },
    {
      id: "8",
      title: "Your Report Ready",
      message: "Your individual performance report for November is ready",
      type: "success" as const,
      isRead: false,
      timestamp: "2024-09-26T07:00:00Z",
      actionUrl: "/reports",
      actionText: "View Report",
      source: {
        type: "report",
        name: "Individual Performance Report",
        id: "report-789"
      }
    },
    {
      id: "9",
      title: "Deployment Successful",
      message: "Your feature branch has been successfully deployed to staging",
      type: "success" as const,
      isRead: true,
      timestamp: "2024-09-26T06:00:00Z",
      actionUrl: "/repositories",
      actionText: "View Deployment",
      source: {
        type: "repository",
        name: "backend-api",
        id: "repo-2"
      }
    }
  ]
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Repository Added",
    message: "Frontend team has added 'react-dashboard' to tracked repositories",
    type: "info",
    isRead: false,
    timestamp: "2024-09-26T08:30:00Z",
    actionUrl: "/repositories",
    actionText: "View Repository",
    source: {
      type: "repository",
      name: "react-dashboard",
      id: "repo-123"
    }
  },
  {
    id: "2",
    title: "Weekly Report Ready",
    message: "Your weekly productivity report has been generated and is ready for review",
    type: "success",
    isRead: false,
    timestamp: "2024-09-26T07:00:00Z",
    actionUrl: "/reports",
    actionText: "View Report",
    source: {
      type: "report",
      name: "Weekly Productivity Report",
      id: "report-456"
    }
  },
  {
    id: "3",
    title: "Security Alert",
    message: "Unusual activity detected in repository 'api-gateway'. Please review recent commits.",
    type: "security",
    isRead: false,
    timestamp: "2024-09-26T06:15:00Z",
    actionUrl: "/repositories",
    actionText: "Review Repository",
    source: {
      type: "repository",
      name: "api-gateway",
      id: "repo-789"
    }
  },
  {
    id: "4",
    title: "User Invitation Sent",
    message: "Invitation sent to alex.rodriguez@acmecorp.com to join as Manager",
    type: "info",
    isRead: true,
    timestamp: "2024-09-25T16:45:00Z",
    actionUrl: "/admin",
    actionText: "Manage Users",
    source: {
      type: "user",
      name: "Alex Rodriguez",
      id: "user-5"
    }
  },
  {
    id: "5",
    title: "Repository Sync Failed",
    message: "Failed to sync 'legacy-system' repository. Check your GitHub permissions.",
    type: "error",
    isRead: true,
    timestamp: "2024-09-25T14:20:00Z",
    actionUrl: "/repositories",
    actionText: "Retry Sync",
    source: {
      type: "repository",
      name: "legacy-system",
      id: "repo-321"
    }
  },
  {
    id: "6",
    title: "API Rate Limit Warning",
    message: "GitHub API usage is at 85% of your monthly limit. Consider upgrading your plan.",
    type: "warning",
    isRead: true,
    timestamp: "2024-09-25T12:00:00Z",
    actionUrl: "/admin",
    actionText: "View Usage",
    source: {
      type: "system",
      name: "API Monitor"
    }
  },
  {
    id: "7",
    title: "New Team Member",
    message: "Mike Chen has joined the Backend Team and completed onboarding",
    type: "success",
    isRead: true,
    timestamp: "2024-09-25T09:30:00Z",
    actionUrl: "/teams",
    actionText: "View Team",
    source: {
      type: "user",
      name: "Mike Chen",
      id: "user-3"
    }
  },
  {
    id: "8",
    title: "System Maintenance",
    message: "Scheduled maintenance window completed successfully. All services are operational.",
    type: "system",
    isRead: true,
    timestamp: "2024-09-24T22:00:00Z",
    source: {
      type: "system",
      name: "System Administrator"
    }
  },
  {
    id: "9",
    title: "Report Generation Failed",
    message: "Failed to generate monthly report for Frontend Team. Retrying automatically.",
    type: "error",
    isRead: true,
    timestamp: "2024-09-24T15:30:00Z",
    actionUrl: "/reports",
    actionText: "Retry Generation",
    source: {
      type: "report",
      name: "Monthly Team Report",
      id: "report-789"
    }
  },
  {
    id: "10",
    title: "Integration Updated",
    message: "Slack integration has been successfully updated with new webhook URL",
    type: "success",
    isRead: true,
    timestamp: "2024-09-24T11:15:00Z",
    actionUrl: "/settings",
    actionText: "View Settings",
    source: {
      type: "system",
      name: "Integration Manager"
    }
  }
];

// Billing mock data
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "monthly",
    description: "Perfect for personal projects and small teams getting started",
    features: [
      "Up to 3 repositories",
      "Up to 3 team members",
      "3 reports per month",
      "Community support",
      "Basic analytics",
      "7-day data retention"
    ],
    maxReports: 3,
    maxRepositories: 3,
    maxUsers: 3,
    support: "community"
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    interval: "monthly",
    description: "For growing teams that need more advanced features and insights",
    features: [
      "Up to 25 repositories",
      "Up to 25 team members",
      "Unlimited reports",
      "Email support",
      "Advanced analytics",
      "Custom report templates",
      "90-day data retention",
      "API access",
      "Slack integration"
    ],
    maxReports: "unlimited",
    maxRepositories: 25,
    maxUsers: 25,
    support: "email",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    interval: "monthly",
    description: "For large organizations with advanced security and compliance needs",
    features: [
      "Unlimited repositories",
      "Unlimited team members",
      "Unlimited reports",
      "Priority support",
      "Advanced security features",
      "Custom integrations",
      "Unlimited data retention",
      "Single sign-on (SSO)",
      "Audit logs",
      "SLA guarantee",
      "Dedicated account manager"
    ],
    maxReports: "unlimited",
    maxRepositories: "unlimited",
    maxUsers: "unlimited",
    support: "priority"
  }
];

export const mockCurrentSubscription: CurrentSubscription = {
  id: "sub_1234567890",
  planId: "pro",
  planName: "Pro",
  status: "active",
  currentPeriodStart: "2024-12-01T00:00:00Z",
  currentPeriodEnd: "2025-01-01T00:00:00Z",
  cancelAtPeriodEnd: false,
  nextBillingDate: "2025-01-01T00:00:00Z",
  amount: 29,
  currency: "USD",
  interval: "monthly"
};

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1234567890",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2027,
    isDefault: true,
    holderName: "John Doe"
  },
  {
    id: "pm_0987654321",
    type: "card",
    brand: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    holderName: "John Doe"
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: "in_1234567890",
    number: "INV-2024-001",
    date: "2024-12-01T00:00:00Z",
    dueDate: "2024-12-01T00:00:00Z",
    status: "paid",
    amount: 29,
    currency: "USD",
    description: "Pro Plan - December 2024",
    downloadUrl: "/api/invoices/in_1234567890/download",
    paymentMethod: "**** 4242"
  },
  {
    id: "in_1234567889",
    number: "INV-2024-002",
    date: "2024-11-01T00:00:00Z",
    dueDate: "2024-11-01T00:00:00Z",
    status: "paid",
    amount: 29,
    currency: "USD",
    description: "Pro Plan - November 2024",
    downloadUrl: "/api/invoices/in_1234567889/download",
    paymentMethod: "**** 4242"
  },
  {
    id: "in_1234567888",
    number: "INV-2024-003",
    date: "2024-10-01T00:00:00Z",
    dueDate: "2024-10-01T00:00:00Z",
    status: "paid",
    amount: 29,
    currency: "USD",
    description: "Pro Plan - October 2024",
    downloadUrl: "/api/invoices/in_1234567888/download",
    paymentMethod: "**** 4242"
  },
  {
    id: "in_1234567887",
    number: "INV-2024-004",
    date: "2024-09-01T00:00:00Z",
    dueDate: "2024-09-01T00:00:00Z",
    status: "paid",
    amount: 29,
    currency: "USD",
    description: "Pro Plan - September 2024",
    downloadUrl: "/api/invoices/in_1234567887/download",
    paymentMethod: "**** 4242"
  },
  {
    id: "in_1234567886",
    number: "INV-2024-005",
    date: "2024-08-01T00:00:00Z",
    dueDate: "2024-08-01T00:00:00Z",
    status: "paid",
    amount: 29,
    currency: "USD",
    description: "Pro Plan - August 2024",
    downloadUrl: "/api/invoices/in_1234567886/download",
    paymentMethod: "**** 8888"
  }
];

export const mockBillingData: BillingData = {
  currentSubscription: mockCurrentSubscription,
  availablePlans: mockSubscriptionPlans,
  paymentMethods: mockPaymentMethods,
  invoices: mockInvoices
};
