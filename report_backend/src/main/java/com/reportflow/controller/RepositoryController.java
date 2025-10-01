package com.reportflow.controller;

import com.reportflow.dto.AddRepositoryRequest;
import com.reportflow.dto.SyncResponse;
import com.reportflow.entity.Repository;
import com.reportflow.entity.SyncStatus;
import com.reportflow.entity.User;
import com.reportflow.service.RepositoryService;
import com.reportflow.service.UserService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/repositories")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:63339"})
@RequiredArgsConstructor
public class RepositoryController {
    
    private final RepositoryService repositoryService;
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("@organizationService.userBelongsToOrgByUsername(authentication.name, #organizationId)")
    public ResponseEntity<List<Repository>> getRepositories(
            @RequestParam String organizationId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        SyncStatus syncStatus = null;
        if (status != null) {
            try {
                syncStatus = SyncStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        List<Repository> repositories = repositoryService.findRepositoriesWithFilters(organizationId, syncStatus, search);
        return ResponseEntity.ok(repositories);
    }
    
    @PostMapping
    @PreAuthorize("@organizationService.userHasRoleInOrg(authentication.name, #request.organizationId, T(com.reportflow.entity.UserRole).MANAGER)")
    public ResponseEntity<Repository> addRepository(@Valid @RequestBody AddRepositoryRequest request) {
        try {
            Repository repository = repositoryService.addRepository(request);
            return ResponseEntity.ok(repository);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/sync")
    @PreAuthorize("@organizationService.userHasRoleInOrg(authentication.name, @repositoryService.getOrganizationId(#id), T(com.reportflow.entity.UserRole).MANAGER)")
    public ResponseEntity<SyncResponse> syncRepository(@PathVariable String id) {
        try {
            SyncResponse response = repositoryService.syncRepository(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("@organizationService.userHasRoleInOrg(authentication.name, @repositoryService.getOrganizationId(#id), T(com.reportflow.entity.UserRole).MANAGER)")
    public ResponseEntity<Repository> toggleRepository(@PathVariable String id) {
        try {
            Repository repository = repositoryService.toggleRepository(id);
            return ResponseEntity.ok(repository);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/sync/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> syncAllRepositoriesFromGitHub(Authentication authentication) {
        try {
            Optional<User> currentUser = userService.getCurrentUser(authentication.getName());
            if (currentUser.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Map<String, Object> syncResult = repositoryService.syncAllUserRepositoriesFromGitHub(currentUser.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "All repositories synced successfully");
            response.putAll(syncResult);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to sync repositories");
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
