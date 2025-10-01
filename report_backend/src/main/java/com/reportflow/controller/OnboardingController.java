package com.reportflow.controller;

import com.reportflow.entity.Organization;
import com.reportflow.entity.Repository;
import com.reportflow.entity.User;
import com.reportflow.service.OrganizationService;
import com.reportflow.service.RepositoryService;
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
@RequestMapping("/api/onboarding")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:63339"})
@RequiredArgsConstructor
public class OnboardingController {
    
    private final UserService userService;
    private final OrganizationService organizationService;
    private final RepositoryService repositoryService;
    
    /**
     * Step 1: Get onboarding status and user profile
     */
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getOnboardingStatus(Authentication authentication) {
        Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
        if (currentUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = currentUser.get();
        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("isOnboarded", user.getIsOnboarded());
        response.put("currentStep", user.getIsOnboarded() ? "completed" : "welcome");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Step 2: Sync organizations from GitHub
     */
    @PostMapping("/sync-organizations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> syncOrganizations(Authentication authentication) {
        try {
            Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
            if (currentUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            List<Organization> syncedOrgs = organizationService.syncUserOrganizationsFromGitHub(currentUser.get());
            Organization personalOrg = organizationService.createPersonalOrganization(currentUser.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Organizations synced successfully");
            response.put("syncedOrganizations", syncedOrgs.size());
            response.put("personalOrganization", personalOrg);
            response.put("organizations", syncedOrgs);
            response.put("nextStep", "repositories");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to sync organizations");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Step 3: Sync repositories from GitHub
     */
    @PostMapping("/sync-repositories")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> syncRepositories(Authentication authentication) {
        try {
            Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
            if (currentUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> syncResult = repositoryService.syncAllUserRepositoriesFromGitHub(currentUser.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Repositories synced successfully");
            response.putAll(syncResult);
            response.put("nextStep", "preferences");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to sync repositories");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Step 4: Set user preferences and complete onboarding
     */
    @PostMapping("/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> completeOnboarding(
            @RequestBody Map<String, Object> preferences,
            Authentication authentication) {
        try {
            Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
            if (currentUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Mark user as onboarded
            User user = userService.updateUserProfile(
                currentUser.get().getId(),
                null, // name
                null, // email
                null, // avatar
                true  // isOnboarded
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Onboarding completed successfully");
            response.put("user", user);
            response.put("redirectTo", "/dashboard");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to complete onboarding");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    /**
     * Get onboarding progress summary
     */
    @GetMapping("/progress")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getOnboardingProgress(Authentication authentication) {
        try {
            Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
            if (currentUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = currentUser.get();
            List<Organization> userOrgs = organizationService.findByUserId(user.getId());
            
            int totalRepos = 0;
            for (Organization org : userOrgs) {
                totalRepos += repositoryService.findRepositoriesWithFilters(org.getId(), null, null).size();
            }
            
            Map<String, Object> progress = new HashMap<>();
            progress.put("user", user);
            progress.put("isOnboarded", user.getIsOnboarded());
            progress.put("organizationsCount", userOrgs.size());
            progress.put("repositoriesCount", totalRepos);
            progress.put("hasGitHubToken", user.getGithubAccessToken() != null && !user.getGithubAccessToken().isEmpty());
            
            // Determine current step
            String currentStep = "welcome";
            if (user.getIsOnboarded()) {
                currentStep = "completed";
            } else if (totalRepos > 0) {
                currentStep = "preferences";
            } else if (userOrgs.size() > 0) {
                currentStep = "repositories";
            } else if (user.getGithubAccessToken() != null) {
                currentStep = "organizations";
            }
            
            progress.put("currentStep", currentStep);
            
            return ResponseEntity.ok(progress);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to get onboarding progress");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
