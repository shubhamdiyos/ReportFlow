package com.reportflow.service;

import com.reportflow.entity.Organization;
import com.reportflow.entity.OrganizationType;
import com.reportflow.entity.User;
import com.reportflow.entity.UserOrganization;
import com.reportflow.entity.UserOrganizationId;
import com.reportflow.entity.UserRole;
import com.reportflow.repository.OrganizationRepository;
import com.reportflow.repository.UserOrganizationRepository;
import com.reportflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class OrganizationService {
    
    private final OrganizationRepository organizationRepository;
    private final UserOrganizationRepository userOrganizationRepository;
    private final GitHubApiService gitHubApiService;
    private final UserRepository userRepository;
    
    public Optional<Organization> findById(String id) {
        return organizationRepository.findById(id);
    }
    
    public Optional<Organization> findByDomain(String domain) {
        return organizationRepository.findByDomain(domain);
    }
    
    public Organization save(Organization organization) {
        return organizationRepository.save(organization);
    }
    
    public List<Organization> findByUserId(String userId) {
        return organizationRepository.findActiveOrganizationsByUserId(userId);
    }
    
    public boolean userBelongsToOrg(String userId, String orgId) {
        Optional<UserOrganization> userOrg = userOrganizationRepository.findActiveUserOrganization(userId, orgId);
        return userOrg.isPresent();
    }
    
    public boolean userBelongsToOrgByUsername(String username, String orgId) {
        log.info("Checking if user '{}' belongs to org '{}'", username, orgId);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            log.warn("User not found by username: {}", username);
            return false;
        }
        log.info("Found user: {} (ID: {})", user.get().getUsername(), user.get().getId());
        boolean belongs = userBelongsToOrg(user.get().getId(), orgId);
        log.info("User belongs to org: {}", belongs);
        return belongs;
    }
    
    public boolean userHasRoleInOrg(String userId, String orgId, UserRole requiredRole) {
        Optional<UserOrganization> userOrg = userOrganizationRepository.findActiveUserOrganization(userId, orgId);
        if (userOrg.isEmpty()) {
            return false;
        }
        
        UserRole userRole = userOrg.get().getRole();
        
        // Role hierarchy: ADMIN > MANAGER > DEVELOPER
        switch (requiredRole) {
            case ADMIN:
                return userRole == UserRole.ADMIN;
            case MANAGER:
                return userRole == UserRole.ADMIN || userRole == UserRole.MANAGER;
            case DEVELOPER:
                return true; // All roles can access developer level
            default:
                return false;
        }
    }
    
    public UserOrganization addUserToOrganization(User user, Organization organization, UserRole role) {
        Optional<UserOrganization> existing = userOrganizationRepository.findByUserIdAndOrganizationId(
                user.getId(), organization.getId());
        
        if (existing.isPresent()) {
            UserOrganization userOrg = existing.get();
            userOrg.setRole(role);
            userOrg.setIsActive(true);
            return userOrganizationRepository.save(userOrg);
        } else {
            UserOrganization userOrg = new UserOrganization();
            userOrg.setUser(user);
            userOrg.setOrganization(organization);
            userOrg.setRole(role);
            userOrg.setId(new UserOrganizationId(user.getId(), organization.getId()));
            return userOrganizationRepository.save(userOrg);
        }
    }
    
    public void removeUserFromOrganization(String userId, String organizationId) {
        Optional<UserOrganization> userOrg = userOrganizationRepository.findByUserIdAndOrganizationId(userId, organizationId);
        if (userOrg.isPresent()) {
            UserOrganization uo = userOrg.get();
            uo.setIsActive(false);
            userOrganizationRepository.save(uo);
        }
    }
    
    public Long getActiveUserCount(String organizationId) {
        return userOrganizationRepository.countActiveUsersByOrganizationId(organizationId);
    }
    
    public Optional<Organization> findByGithubId(String githubId) {
        return organizationRepository.findByGithubId(githubId);
    }
    
    /**
     * Sync user's organizations from GitHub
     */
    public List<Organization> syncUserOrganizationsFromGitHub(User user) {
        if (user.getGithubAccessToken() == null || user.getGithubAccessToken().isEmpty()) {
            log.warn("User {} has no GitHub access token for organization sync", user.getUsername());
            return List.of();
        }
        
        try {
            List<Map<String, Object>> githubOrgs = gitHubApiService.fetchUserOrganizations(user.getGithubAccessToken());
            List<Organization> syncedOrgs = new java.util.ArrayList<>();
            
            for (Map<String, Object> githubOrg : githubOrgs) {
                Organization org = createOrUpdateOrganizationFromGitHub(githubOrg);
                if (org != null) {
                    // Add user to organization with DEVELOPER role by default
                    addUserToOrganization(user, org, UserRole.DEVELOPER);
                    syncedOrgs.add(org);
                }
            }
            
            log.info("Synced {} organizations for user {}", syncedOrgs.size(), user.getUsername());
            return syncedOrgs;
            
        } catch (Exception e) {
            log.error("Error syncing organizations for user {}: {}", user.getUsername(), e.getMessage());
            return List.of();
        }
    }
    
    /**
     * Create or update organization from GitHub data
     */
    private Organization createOrUpdateOrganizationFromGitHub(Map<String, Object> githubOrg) {
        try {
            String githubId = String.valueOf(githubOrg.get("id"));
            String name = (String) githubOrg.get("login");
            String displayName = (String) githubOrg.get("name");
            String description = (String) githubOrg.get("description");
            String avatarUrl = (String) githubOrg.get("avatar_url");
            String htmlUrl = (String) githubOrg.get("html_url");
            
            // Check if organization already exists
            Optional<Organization> existingOrg = findByGithubId(githubId);
            
            Organization org;
            if (existingOrg.isPresent()) {
                // Update existing organization
                org = existingOrg.get();
                org.setName(displayName != null ? displayName : name);
                org.setDescription(description);
                org.setLogo(avatarUrl);
                if (htmlUrl != null) {
                    // Extract domain from GitHub URL
                    String domain = htmlUrl.replace("https://github.com/", "");
                    org.setDomain(domain);
                }
            } else {
                // Create new organization
                org = new Organization();
                org.setName(displayName != null ? displayName : name);
                org.setDescription(description);
                org.setLogo(avatarUrl);
                org.setGithubId(githubId);
                org.setType(OrganizationType.ORGANIZATION);
                
                if (htmlUrl != null) {
                    // Extract domain from GitHub URL
                    String domain = htmlUrl.replace("https://github.com/", "");
                    org.setDomain(domain);
                }
            }
            
            return save(org);
            
        } catch (Exception e) {
            log.error("Error creating/updating organization from GitHub data: {}", e.getMessage());
            return null;
        }
    }
    
    /**
     * Create user's personal organization (for personal repositories)
     */
    public Organization createPersonalOrganization(User user) {
        // Check if personal organization already exists
        String personalOrgName = user.getUsername() + " (Personal)";
        Optional<Organization> existingPersonalOrg = organizationRepository.findByName(personalOrgName);
        
        if (existingPersonalOrg.isPresent()) {
            Organization org = existingPersonalOrg.get();
            // Ensure user is added to the organization (in case relationship is missing)
            addUserToOrganization(user, org, UserRole.ADMIN);
            return org;
        }
        
        Organization personalOrg = new Organization();
        personalOrg.setName(personalOrgName);
        personalOrg.setDomain(user.getUsername());
        personalOrg.setLogo(user.getAvatar());
        personalOrg.setType(OrganizationType.INDIVIDUAL);
        personalOrg.setDescription("Personal repositories for " + user.getName());
        personalOrg.setGithubId(user.getGithubId()); // Use user's GitHub ID for personal org
        
        Organization savedOrg = save(personalOrg);
        
        // Add user as admin of their personal organization
        addUserToOrganization(user, savedOrg, UserRole.ADMIN);
        
        return savedOrg;
    }
}
