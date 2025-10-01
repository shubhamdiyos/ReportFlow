package com.reportflow.service;

import com.reportflow.dto.AddRepositoryRequest;
import com.reportflow.dto.SyncResponse;
import com.reportflow.entity.Organization;
import com.reportflow.entity.Repository;
import com.reportflow.entity.RepositoryVisibility;
import com.reportflow.entity.SyncStatus;
import com.reportflow.entity.User;
import com.reportflow.repository.RepositoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RepositoryService {
    
    private final RepositoryRepository repositoryRepository;
    private final OrganizationService organizationService;
    private final GitHubApiService gitHubApiService;
    
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
    
    /**
     * Sync repositories for a specific organization from GitHub
     */
    public List<Repository> syncOrganizationRepositoriesFromGitHub(User user, Organization organization) {
        if (user.getGithubAccessToken() == null || user.getGithubAccessToken().isEmpty()) {
            log.warn("User {} has no GitHub access token for repository sync", user.getUsername());
            return List.of();
        }
        
        try {
            List<Map<String, Object>> githubRepos;
            
            // Fetch repositories based on organization type
            if (organization.getGithubId() != null && organization.getGithubId().equals(user.getGithubId())) {
                // Personal repositories
                githubRepos = gitHubApiService.fetchUserRepositories(user.getGithubAccessToken());
            } else {
                // Organization repositories
                String orgName = organization.getDomain();
                if (orgName == null || orgName.isEmpty()) {
                    log.warn("Organization {} has no domain for GitHub sync", organization.getName());
                    return List.of();
                }
                githubRepos = gitHubApiService.fetchOrganizationRepositories(user.getGithubAccessToken(), orgName);
            }
            
            List<Repository> syncedRepos = new java.util.ArrayList<>();
            
            for (Map<String, Object> githubRepo : githubRepos) {
                Repository repo = createOrUpdateRepositoryFromGitHub(githubRepo, organization);
                if (repo != null) {
                    syncedRepos.add(repo);
                }
            }
            
            log.info("Synced {} repositories for organization {}", syncedRepos.size(), organization.getName());
            return syncedRepos;
            
        } catch (Exception e) {
            log.error("Error syncing repositories for organization {}: {}", organization.getName(), e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Create or update repository from GitHub data
     */
    private Repository createOrUpdateRepositoryFromGitHub(Map<String, Object> githubRepo, Organization organization) {
        try {
            String githubId = String.valueOf(githubRepo.get("id"));
            String name = (String) githubRepo.get("name");
            String fullName = (String) githubRepo.get("full_name");
            String description = (String) githubRepo.get("description");
            String language = (String) githubRepo.get("language");
            String htmlUrl = (String) githubRepo.get("html_url");
            String defaultBranch = (String) githubRepo.get("default_branch");
            
            Boolean isPrivate = (Boolean) githubRepo.get("private");
            Boolean isFork = (Boolean) githubRepo.get("fork");
            Boolean isArchived = (Boolean) githubRepo.get("archived");
            
            Integer starsCount = (Integer) githubRepo.get("stargazers_count");
            Integer forksCount = (Integer) githubRepo.get("forks_count");
            Integer openIssuesCount = (Integer) githubRepo.get("open_issues_count");
            Integer size = (Integer) githubRepo.get("size");
            
            // Check if repository already exists
            Optional<Repository> existingRepo = repositoryRepository.findByGithubId(githubId);
            
            Repository repo;
            if (existingRepo.isPresent()) {
                // Update existing repository
                repo = existingRepo.get();
                repo.setName(name);
                repo.setDescription(description);
                repo.setLanguage(language);
                repo.setGithubUrl(htmlUrl);
                repo.setDefaultBranch(defaultBranch != null ? defaultBranch : "main");
                repo.setVisibility(isPrivate != null && isPrivate ? RepositoryVisibility.PRIVATE : RepositoryVisibility.PUBLIC);
                repo.setIsFork(isFork != null ? isFork : false);
                repo.setIsArchived(isArchived != null ? isArchived : false);
                repo.setStarsCount(starsCount != null ? starsCount : 0);
                repo.setForksCount(forksCount != null ? forksCount : 0);
                repo.setOpenIssuesCount(openIssuesCount != null ? openIssuesCount : 0);
                repo.setSizeKb(size != null ? size.longValue() : 0L);
                repo.setLastSync(LocalDateTime.now());
                repo.setSyncStatus(SyncStatus.SUCCESS);
            } else {
                // Create new repository
                repo = new Repository();
                repo.setName(name);
                repo.setDescription(description);
                repo.setLanguage(language);
                repo.setGithubUrl(htmlUrl);
                repo.setGithubId(githubId);
                repo.setDefaultBranch(defaultBranch != null ? defaultBranch : "main");
                repo.setVisibility(isPrivate != null && isPrivate ? RepositoryVisibility.PRIVATE : RepositoryVisibility.PUBLIC);
                repo.setIsFork(isFork != null ? isFork : false);
                repo.setIsArchived(isArchived != null ? isArchived : false);
                repo.setStarsCount(starsCount != null ? starsCount : 0);
                repo.setForksCount(forksCount != null ? forksCount : 0);
                repo.setOpenIssuesCount(openIssuesCount != null ? openIssuesCount : 0);
                repo.setSizeKb(size != null ? size.longValue() : 0L);
                repo.setOrganization(organization);
                repo.setLastSync(LocalDateTime.now());
                repo.setSyncStatus(SyncStatus.SUCCESS);
                repo.setIncluded(true);
            }
            
            return repositoryRepository.save(repo);
            
        } catch (Exception e) {
            log.error("Error creating/updating repository from GitHub data: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Sync all repositories for a user across all their organizations
     */
    public Map<String, Object> syncAllUserRepositoriesFromGitHub(User user) {
        List<Organization> userOrgs = organizationService.findByUserId(user.getId());
        int totalSynced = 0;
        Map<String, Integer> orgSyncCounts = new java.util.HashMap<>();
        
        for (Organization org : userOrgs) {
            List<Repository> syncedRepos = syncOrganizationRepositoriesFromGitHub(user, org);
            orgSyncCounts.put(org.getName(), syncedRepos.size());
            totalSynced += syncedRepos.size();
        }
        
        Map<String, Object> result = new java.util.HashMap<>();
        result.put("totalRepositories", totalSynced);
        result.put("organizationCounts", orgSyncCounts);
        result.put("organizations", userOrgs.size());
        
        return result;
    }
    
    public Optional<Repository> findByGithubId(String githubId) {
        return repositoryRepository.findByGithubId(githubId);
    }
    
    private boolean isValidGitHubUrl(String url) {
        return url != null && (url.startsWith("https://github.com/") || url.startsWith("git@github.com:"));
    }
}
