package com.reportflow.controller;

import com.reportflow.dto.TenantSwitchResponse;
import com.reportflow.dto.UserOrganizationMembership;
import com.reportflow.entity.Organization;
import com.reportflow.entity.User;
import com.reportflow.service.OrganizationService;
import com.reportflow.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:63339"})
@RequiredArgsConstructor
public class OrganizationController {
    
    private final OrganizationService organizationService;
    private final UserService userService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserOrganizationMembership>> getUserOrganizations(@PathVariable String userId) {
        List<UserOrganizationMembership> organizations = userService.getUserOrganizations(userId);
        return ResponseEntity.ok(organizations);
    }
    
    @PostMapping("/{organizationId}/switch")
    @PreAuthorize("@organizationService.userBelongsToOrg(authentication.name, #organizationId)")
    public ResponseEntity<TenantSwitchResponse> switchTenant(@PathVariable String organizationId) {
        Optional<Organization> org = organizationService.findById(organizationId);
        if (org.isPresent()) {
            TenantSwitchResponse response = new TenantSwitchResponse();
            response.setOrganizationId(organizationId);
            response.setOrganizationName(org.get().getName());
            response.setMessage("Tenant switched successfully");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("@organizationService.userBelongsToOrg(authentication.name, #id)")
    public ResponseEntity<Organization> getOrganization(@PathVariable String id) {
        Optional<Organization> organization = organizationService.findById(id);
        return organization.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/sync")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> syncOrganizationsFromGitHub(Authentication authentication) {
        try {
            Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
            if (currentUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            List<Organization> syncedOrgs = organizationService.syncUserOrganizationsFromGitHub(currentUser.get());
            
            // Also create personal organization if it doesn't exist
            Organization personalOrg = organizationService.createPersonalOrganization(currentUser.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Organizations synced successfully");
            response.put("syncedOrganizations", syncedOrgs.size());
            response.put("personalOrganization", personalOrg.getName());
            response.put("organizations", syncedOrgs);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to sync organizations");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
