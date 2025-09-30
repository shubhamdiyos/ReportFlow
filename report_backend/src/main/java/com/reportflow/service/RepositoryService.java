package com.reportflow.service;

import com.reportflow.dto.AddRepositoryRequest;
import com.reportflow.dto.SyncResponse;
import com.reportflow.entity.Organization;
import com.reportflow.entity.Repository;
import com.reportflow.entity.SyncStatus;
import com.reportflow.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RepositoryService {
    
    private final RepositoryRepository repositoryRepository;
    private final OrganizationService organizationService;
    
    public List<Repository> findRepositoriesWithFilters(String organizationId, SyncStatus status, String search) {
        return repositoryRepository.findRepositoriesWithFilters(organizationId, status, search);
    }
    
    public Repository addRepository(AddRepositoryRequest request) {
        // Validate GitHub URL format
        if (!isValidGitHubUrl(request.getGithubUrl())) {
            throw new RuntimeException("Invalid GitHub repository URL");
        }
        
        // Check if repository already exists
        Optional<Repository> existing = repositoryRepository.findByGithubUrl(request.getGithubUrl());
        if (existing.isPresent()) {
            throw new RuntimeException("Repository already exists");
        }
        
        // Get organization
        Optional<Organization> org = organizationService.findById(request.getOrganizationId());
        if (org.isEmpty()) {
            throw new RuntimeException("Organization not found");
        }
        
        Repository repository = new Repository();
        repository.setName(request.getName());
        repository.setDescription(request.getDescription());
        repository.setGithubUrl(request.getGithubUrl());
        repository.setOrganization(org.get());
        repository.setSyncStatus(SyncStatus.PENDING);
        
        return repositoryRepository.save(repository);
    }
    
    public SyncResponse syncRepository(String repositoryId) {
        Optional<Repository> repoOptional = repositoryRepository.findById(repositoryId);
        if (repoOptional.isEmpty()) {
            throw new RuntimeException("Repository not found");
        }
        
        Repository repository = repoOptional.get();
        
        try {
            // Simulate GitHub API sync
            repository.setSyncStatus(SyncStatus.SUCCESS);
            repository.setLastSync(LocalDateTime.now());
            repository.setCommits(repository.getCommits() + (int)(Math.random() * 10) + 1);
            
            repositoryRepository.save(repository);
            
            return new SyncResponse(repositoryId, SyncStatus.SUCCESS, "Repository synced successfully");
            
        } catch (Exception e) {
            repository.setSyncStatus(SyncStatus.FAILED);
            repository.setLastSync(LocalDateTime.now());
            repositoryRepository.save(repository);
            
            return new SyncResponse(repositoryId, SyncStatus.FAILED, "Sync failed: " + e.getMessage());
        }
    }
    
    public Repository toggleRepository(String repositoryId) {
        Optional<Repository> repoOptional = repositoryRepository.findById(repositoryId);
        if (repoOptional.isEmpty()) {
            throw new RuntimeException("Repository not found");
        }
        
        Repository repository = repoOptional.get();
        repository.setIncluded(!repository.getIncluded());
        
        return repositoryRepository.save(repository);
    }
    
    public String getOrganizationId(String repositoryId) {
        Optional<Repository> repo = repositoryRepository.findById(repositoryId);
        return repo.map(r -> r.getOrganization().getId()).orElse(null);
    }
    
    private boolean isValidGitHubUrl(String url) {
        return url != null && (url.startsWith("https://github.com/") || url.startsWith("git@github.com:"));
    }
}
