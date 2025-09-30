package com.reportflow.controller;

import com.reportflow.dto.ChartData;
import com.reportflow.dto.KPI;
import com.reportflow.entity.UserRole;
import com.reportflow.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:63339"})
@RequiredArgsConstructor
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/kpis")
    @PreAuthorize("@organizationService.userBelongsToOrg(authentication.name, #organizationId)")
    public ResponseEntity<List<KPI>> getKPIs(
            @RequestParam String organizationId,
            @RequestParam String userRole) {
        
        try {
            UserRole role = UserRole.valueOf(userRole.toUpperCase());
            List<KPI> kpis = analyticsService.calculateKPIs(organizationId, role);
            return ResponseEntity.ok(kpis);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/charts/{chartType}")
    @PreAuthorize("@organizationService.userBelongsToOrg(authentication.name, #organizationId)")
    public ResponseEntity<List<ChartData>> getChartData(
            @PathVariable String chartType,
            @RequestParam String organizationId,
            @RequestParam(required = false) String dateRange) {
        
        List<ChartData> chartData = analyticsService.generateChartData(chartType, organizationId);
        return ResponseEntity.ok(chartData);
    }
}
