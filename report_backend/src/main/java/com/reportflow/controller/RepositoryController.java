package com.reportflow.controller;

import com.reportflow.dto.AddRepositoryRequest;
import com.reportflow.dto.SyncResponse;
import com.reportflow.entity.Repository;
import com.reportflow.entity.SyncStatus;
import com.reportflow.service.RepositoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repositories")
@CrossOrigin(origins = {"http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173", "http://127.0.0.1:63339"})
@RequiredArgsConstructor
public class RepositoryController {
    
    private final RepositoryService repositoryService;
    
    @GetMapping
    @PreAuthorize("@organizationService.userBelongsToOrg(authentication.name, #organizationId)")
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
}
