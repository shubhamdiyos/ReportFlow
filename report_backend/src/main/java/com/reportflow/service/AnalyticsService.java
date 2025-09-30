package com.reportflow.service;

import com.reportflow.dto.ChartData;
import com.reportflow.dto.KPI;
import com.reportflow.entity.UserRole;
import com.reportflow.repository.DeveloperMetricsRepository;
import com.reportflow.repository.RepositoryRepository;
import com.reportflow.repository.TeamRepository;
import com.reportflow.repository.UserOrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    
    private final DeveloperMetricsRepository developerMetricsRepository;
    private final RepositoryRepository repositoryRepository;
    private final TeamRepository teamRepository;
    private final UserOrganizationRepository userOrganizationRepository;
    
    public List<KPI> calculateKPIs(String organizationId, UserRole role) {
        List<KPI> kpis = new ArrayList<>();
        
        // Total Commits
        Long totalCommits = developerMetricsRepository.getTotalCommitsByOrganizationId(organizationId);
        kpis.add(new KPI("total_commits", "Total Commits", totalCommits != null ? totalCommits : 0, 
                        "+12%", "positive", "git-commit", "#10b981"));
        
        // Total Developers
        Long totalDevelopers = userOrganizationRepository.countActiveUsersByOrganizationId(organizationId);
        kpis.add(new KPI("total_developers", "Active Developers", totalDevelopers != null ? totalDevelopers : 0,
                        "+3", "positive", "users", "#3b82f6"));
        
        // Total Reviews
        Long totalReviews = developerMetricsRepository.getTotalReviewsByOrganizationId(organizationId);
        kpis.add(new KPI("total_reviews", "Code Reviews", totalReviews != null ? totalReviews : 0,
                        "+8%", "positive", "eye", "#8b5cf6"));
        
        // Active Repositories
        Long activeRepos = (long) repositoryRepository.findByOrganizationIdAndIncluded(organizationId, true).size();
        kpis.add(new KPI("active_repos", "Active Repositories", activeRepos,
                        "+2", "positive", "folder", "#f59e0b"));
        
        // Role-specific KPIs
        if (role == UserRole.ADMIN || role == UserRole.MANAGER) {
            // Team Performance
            Long totalPRs = teamRepository.getTotalPrsByOrganizationId(organizationId);
            kpis.add(new KPI("total_prs", "Pull Requests", totalPRs != null ? totalPRs : 0,
                            "+15%", "positive", "git-pull-request", "#ef4444"));
        }
        
        return kpis;
    }
    
    public List<ChartData> generateChartData(String chartType, String organizationId) {
        List<ChartData> chartData = new ArrayList<>();
        
        switch (chartType.toLowerCase()) {
            case "commits":
                chartData.add(new ChartData("Week 1", 45, "up", "#10b981"));
                chartData.add(new ChartData("Week 2", 52, "up", "#10b981"));
                chartData.add(new ChartData("Week 3", 38, "down", "#ef4444"));
                chartData.add(new ChartData("Week 4", 61, "up", "#10b981"));
                break;
                
            case "prs":
                chartData.add(new ChartData("Open", 12, "stable", "#3b82f6"));
                chartData.add(new ChartData("Merged", 28, "up", "#10b981"));
                chartData.add(new ChartData("Closed", 5, "down", "#ef4444"));
                break;
                
            case "velocity":
                chartData.add(new ChartData("Sprint 1", 85, "up", "#8b5cf6"));
                chartData.add(new ChartData("Sprint 2", 92, "up", "#8b5cf6"));
                chartData.add(new ChartData("Sprint 3", 78, "down", "#ef4444"));
                chartData.add(new ChartData("Sprint 4", 96, "up", "#10b981"));
                break;
                
            default:
                // Default empty chart
                chartData.add(new ChartData("No Data", 0, "stable", "#6b7280"));
        }
        
        return chartData;
    }
}
