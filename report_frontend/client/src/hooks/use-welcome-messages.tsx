import { useMemo } from "react";
import { useAuth } from "./use-auth";
import { useLocation } from "wouter";

interface WelcomeMessageVariant {
  greeting: string;
  message: string;
  tip?: string;
  suggestion?: string;
  motivation?: string;
  achievement?: string;
}

interface ContextMessages {
  dashboard: WelcomeMessageVariant[];
  reports: WelcomeMessageVariant[];
  teams: WelcomeMessageVariant[];
  developers: WelcomeMessageVariant[];
  repositories: WelcomeMessageVariant[];
  billing: WelcomeMessageVariant[];
  admin: WelcomeMessageVariant[];
  settings: WelcomeMessageVariant[];
  default: WelcomeMessageVariant[];
}

interface RoleContextMessages {
  admin: ContextMessages;
  manager: ContextMessages;
  developer: ContextMessages;
}

export function useWelcomeMessages() {
  const { user } = useAuth();
  const [location] = useLocation();

  // Get time-based greeting
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get current page context
  const getCurrentContext = (): keyof ContextMessages => {
    if (location.includes("/dashboard")) return "dashboard";
    if (location.includes("/reports")) return "reports";
    if (location.includes("/teams")) return "teams";
    if (location.includes("/developers")) return "developers";
    if (location.includes("/repositories")) return "repositories";
    if (location.includes("/billing")) return "billing";
    if (location.includes("/admin")) return "admin";
    if (location.includes("/settings")) return "settings";
    return "default";
  };

  // Define role-specific messages for different contexts
  const roleMessages: RoleContextMessages = {
    admin: {
      dashboard: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your organization is performing excellently across all metrics.",
          tip: "Consider reviewing team allocations to optimize productivity further.",
          motivation: "Great leadership drives exceptional results! 🚀"
        },
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "System health is optimal and all services are running smoothly.",
          suggestion: "Check the latest API usage trends to plan for scaling.",
          achievement: "Your platform uptime this month: 99.9%! 🎯"
        },
        {
          greeting: `Welcome back, ${user?.name}!`,
          message: "24 active users are currently contributing to your projects.",
          tip: "Review user permissions and access controls periodically.",
          motivation: "Your platform enables amazing collaboration! ✨"
        }
      ],
      reports: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your organization has generated 12 comprehensive reports this month.",
          suggestion: "Share key insights with team leads to drive strategic decisions.",
          motivation: "Data-driven leadership creates lasting impact! 📊"
        },
        {
          greeting: `Welcome to Reports, ${user?.name}!`,
          message: "Cross-team collaboration metrics show a 23% improvement.",
          tip: "Export trending reports to share with stakeholders.",
          achievement: "Most insightful admin this quarter! 🏆"
        }
      ],
      teams: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "All teams are actively contributing with balanced workloads.",
          suggestion: "Consider creating cross-functional project groups.",
          tip: "Use team performance data to identify mentorship opportunities."
        }
      ],
      developers: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your developer community is thriving with consistent contributions.",
          suggestion: "Recognize top contributors to boost team morale.",
          achievement: "Developer satisfaction score: 4.8/5.0! ⭐"
        }
      ],
      repositories: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Repository health is excellent with automated backups active.",
          tip: "Review access permissions for sensitive repositories.",
          motivation: "Secure, organized code leads to successful products! 🔒"
        }
      ],
      billing: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your subscription is active with optimal resource usage.",
          suggestion: "Review usage analytics to plan for growth.",
          tip: "Set up billing alerts to track spending efficiently."
        }
      ],
      admin: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "System administration panel showing all green metrics.",
          tip: "Schedule regular system maintenance for peak performance.",
          motivation: "Your vigilant oversight keeps everything running smoothly! 🛡️"
        }
      ],
      settings: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Customize your platform to match your organization's workflow.",
          tip: "Enable two-factor authentication for enhanced security.",
          suggestion: "Configure automated notifications for critical events."
        }
      ],
      default: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your platform is running at optimal performance.",
          motivation: "Exceptional administration creates exceptional outcomes! 💪"
        }
      ]
    },
    manager: {
      dashboard: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your team delivered 156 pull requests this month with 98% quality score.",
          tip: "Schedule one-on-ones to discuss individual developer goals.",
          achievement: "Team velocity increased 18% this quarter! 🎯"
        },
        {
          greeting: `Welcome back, ${user?.name}!`,
          message: "Code review turnaround time improved by 22% this week.",
          suggestion: "Consider pairing junior developers with senior mentors.",
          motivation: "Great managers build great teams! 🌟"
        },
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Team collaboration metrics show excellent cross-project alignment.",
          tip: "Review sprint retrospectives for continuous improvement opportunities.",
          achievement: "Highest team satisfaction score this month! 🏆"
        }
      ],
      reports: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your team reports reveal impressive productivity trends.",
          suggestion: "Share performance highlights with individual contributors.",
          motivation: "Data-driven management drives exceptional results! 📈"
        },
        {
          greeting: `Reports Dashboard, ${user?.name}!`,
          message: "Generate team performance insights to guide strategic planning.",
          tip: "Use historical data to set realistic sprint goals.",
          achievement: "Most comprehensive reports generated this quarter! 📊"
        }
      ],
      teams: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Team dynamics are balanced with strong collaboration patterns.",
          suggestion: "Facilitate knowledge sharing sessions between teams.",
          tip: "Monitor workload distribution to prevent burnout."
        }
      ],
      developers: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your developers are consistently delivering quality code.",
          suggestion: "Recognize individual achievements to boost team morale.",
          motivation: "Investing in people creates lasting success! 👥"
        }
      ],
      repositories: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Repository management shows excellent organization and security.",
          tip: "Ensure all team members have appropriate access levels.",
          suggestion: "Review branch protection rules for critical repositories."
        }
      ],
      billing: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Team resource usage is within optimal ranges.",
          tip: "Plan for team growth with usage forecasting.",
          suggestion: "Discuss budget planning with the admin team."
        }
      ],
      admin: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Team administration settings optimized for collaboration.",
          tip: "Review team permissions and access controls regularly.",
          motivation: "Thoughtful administration enables team excellence! ⚡"
        }
      ],
      settings: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Configure team settings to enhance collaboration workflows.",
          suggestion: "Set up automated notifications for team milestones.",
          tip: "Customize dashboards to track team-specific metrics."
        }
      ],
      default: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your team management approach is driving excellent results.",
          motivation: "Great leadership creates opportunities for everyone! 🚀"
        }
      ]
    },
    developer: {
      dashboard: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "You've contributed 142 commits this month with excellent code quality.",
          tip: "Consider documenting your recent refactoring work for the team.",
          achievement: "Streak achievement: 7 consecutive days of contributions! 🔥"
        },
        {
          greeting: `Welcome back, ${user?.name}!`,
          message: "Your pull requests have a 95% approval rate on first review.",
          suggestion: "Share your code review insights in the next team meeting.",
          motivation: "Consistent quality work makes you a valued team member! ⭐"
        },
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "You've helped review 45 pull requests, supporting team velocity.",
          tip: "Your thorough reviews help maintain code quality standards.",
          achievement: "Most helpful reviewer this month! 🤝"
        }
      ],
      reports: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your contribution reports show impressive growth trends.",
          suggestion: "Use your performance data for upcoming career discussions.",
          motivation: "Your dedication to improvement shows true professionalism! 📈"
        },
        {
          greeting: `Reports for you, ${user?.name}!`,
          message: "Generate personal performance reports to track your growth.",
          tip: "Compare your metrics with team averages for perspective.",
          achievement: "Most comprehensive self-analysis this quarter! 🎯"
        }
      ],
      teams: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your team collaboration score is outstanding this month.",
          suggestion: "Share knowledge about your recent technical discoveries.",
          tip: "Participate in cross-team code reviews for broader impact."
        }
      ],
      developers: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Connect with fellow developers to share experiences and learn.",
          suggestion: "Consider mentoring junior developers on recent projects.",
          motivation: "Learning together makes everyone stronger! 🌱"
        }
      ],
      repositories: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your repository contributions span multiple technologies impressively.",
          tip: "Document architectural decisions for future reference.",
          achievement: "Polyglot programmer: Active in 4 different languages! 💻"
        }
      ],
      billing: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Resource usage tracking helps you understand development patterns.",
          tip: "Optimize your workflow to make the most of available resources.",
          suggestion: "Discuss resource needs with your team lead."
        }
      ],
      admin: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Personal settings optimized for your development workflow.",
          tip: "Customize notifications to match your working style.",
          suggestion: "Update your profile to reflect recent skill developments."
        }
      ],
      settings: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Personalize your development environment for maximum productivity.",
          suggestion: "Set up IDE integrations for seamless workflow.",
          tip: "Configure notification preferences for better focus."
        }
      ],
      default: [
        {
          greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
          message: "Your development journey continues to impress the team.",
          motivation: "Every line of code you write makes a difference! 💫"
        }
      ]
    }
  };

  // Get personalized message based on current context
  const getPersonalizedMessage = (): WelcomeMessageVariant => {
    const userRole = user?.role || "developer";
    const context = getCurrentContext();
    const messages = roleMessages[userRole]?.[context] || roleMessages[userRole]?.default || [];
    
    if (messages.length === 0) {
      return {
        greeting: `${getTimeBasedGreeting()}, ${user?.name}!`,
        message: "Welcome to your development workspace.",
        motivation: "Let's build something amazing today! 🚀"
      };
    }

    // Select a random message variant to avoid repetition
    const messageIndex = Math.floor(Math.random() * messages.length);
    return messages[messageIndex];
  };

  // Generate contextual tips based on current page and user behavior
  const getContextualTips = (): string[] => {
    const context = getCurrentContext();
    const userRole = user?.role || "developer";
    
    const tipsByContext: Record<string, Record<string, string[]>> = {
      dashboard: {
        admin: [
          "Monitor system health metrics for proactive maintenance",
          "Review user activity patterns for capacity planning",
          "Set up automated alerts for critical system events"
        ],
        manager: [
          "Track team velocity trends for sprint planning",
          "Review code review turnaround times",
          "Monitor team workload distribution for balance"
        ],
        developer: [
          "Check your commit streak and maintain consistency",
          "Review recent pull request feedback for improvement",
          "Update your status to reflect current project focus"
        ]
      },
      reports: {
        admin: [
          "Export key metrics for executive reporting",
          "Schedule automated report generation",
          "Share insights with team leads for strategic decisions"
        ],
        manager: [
          "Compare team performance across different time periods",
          "Identify top performers for recognition",
          "Use data to guide resource allocation decisions"
        ],
        developer: [
          "Track your personal growth metrics over time",
          "Compare your performance with team averages",
          "Use insights for career development conversations"
        ]
      }
    };

    return tipsByContext[context]?.[userRole] || [
      "Explore different sections to discover new features",
      "Customize your workspace for better productivity"
    ];
  };

  // Get achievement-based messages
  const getAchievementMessage = (): string | null => {
    const userRole = user?.role || "developer";
    
    // Simulate achievements based on user role and mock data
    const achievements: Record<string, string[]> = {
      admin: [
        "🏆 Platform uptime champion: 99.9% this month!",
        "⚡ Performance optimizer: 15% faster response times!",
        "🛡️ Security guardian: Zero incidents this quarter!",
        "📈 Growth enabler: 25% user increase this month!"
      ],
      manager: [
        "🎯 Team velocity leader: 18% improvement this quarter!",
        "🤝 Collaboration champion: Highest team satisfaction!",
        "📊 Data-driven decisions: Most insights generated!",
        "🌟 Mentorship excellence: 3 developers promoted!"
      ],
      developer: [
        "🔥 Commit streak: 7 consecutive days!",
        "⭐ Code quality star: 95% approval rate!",
        "🤝 Review helper: Most helpful reviewer this month!",
        "💻 Polyglot programmer: Active in 4 languages!"
      ]
    };

    const roleAchievements = achievements[userRole] || [];
    if (roleAchievements.length === 0) return null;
    
    // Return a random achievement
    return roleAchievements[Math.floor(Math.random() * roleAchievements.length)];
  };

  const personalizedMessage = useMemo(() => getPersonalizedMessage(), [user, location]);
  const contextualTips = useMemo(() => getContextualTips(), [user, location]);
  const achievementMessage = useMemo(() => getAchievementMessage(), [user]);

  return {
    personalizedMessage,
    contextualTips,
    achievementMessage,
    timeBasedGreeting: getTimeBasedGreeting(),
    currentContext: getCurrentContext(),
    userName: user?.name || "User",
    userRole: user?.role || "developer"
  };
}