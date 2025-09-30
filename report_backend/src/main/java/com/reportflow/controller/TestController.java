package com.reportflow.controller;

import com.reportflow.dto.ChartData;
import com.reportflow.dto.KPI;
import com.reportflow.dto.UserOrganizationMembership;
import com.reportflow.entity.OrganizationType;
import com.reportflow.entity.User;
import com.reportflow.entity.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:63339"})
@RequiredArgsConstructor
public class TestController {
    
    @GetMapping("/user-format")
    public ResponseEntity<User> testUserFormat() {
        User user = new User();
        user.setId("test-user-id");
        user.setName("John Doe");
        user.setUsername("johndoe");
        user.setEmail("john@example.com");
        user.setAvatar("https://github.com/johndoe.png");
        user.setRole(UserRole.DEVELOPER);
        user.setGithubId("github123");
        user.setIsOnboarded(true);
        user.setCreatedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/organization-membership-format")
    public ResponseEntity<List<UserOrganizationMembership>> testOrganizationMembershipFormat() {
        UserOrganizationMembership membership = new UserOrganizationMembership();
        membership.setId("org-123");
        membership.setName("Test Organization");
        membership.setDomain("testorg.com");
        membership.setLogo("https://example.com/logo.png");
        membership.setType(OrganizationType.ORGANIZATION);
        membership.setRole(UserRole.DEVELOPER);
        membership.setJoinedAt(LocalDateTime.now());
        membership.setIsActive(true);
        membership.setCreatedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(Arrays.asList(membership));
    }
    
    @GetMapping("/kpi-format")
    public ResponseEntity<List<KPI>> testKPIFormat() {
        List<KPI> kpis = Arrays.asList(
            new KPI("total_commits", "Total Commits", 1250, "+12%", "positive", "git-commit", "#10b981"),
            new KPI("total_developers", "Active Developers", 8, "+3", "positive", "users", "#3b82f6"),
            new KPI("total_reviews", "Code Reviews", 342, "+8%", "positive", "eye", "#8b5cf6")
        );
        
        return ResponseEntity.ok(kpis);
    }
    
    @GetMapping("/chart-format")
    public ResponseEntity<List<ChartData>> testChartFormat() {
        List<ChartData> chartData = Arrays.asList(
            new ChartData("Week 1", 45, "up", "#10b981"),
            new ChartData("Week 2", 52, "up", "#10b981"),
            new ChartData("Week 3", 38, "down", "#ef4444"),
            new ChartData("Week 4", 61, "up", "#10b981")
        );
        
        return ResponseEntity.ok(chartData);
    }
    
    @GetMapping("/enum-values")
    public ResponseEntity<Map<String, Object>> testEnumValues() {
        return ResponseEntity.ok(Map.of(
            "userRoles", UserRole.values(),
            "organizationTypes", OrganizationType.values()
        ));
    }
}
