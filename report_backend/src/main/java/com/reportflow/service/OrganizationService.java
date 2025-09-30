package com.reportflow.service;

import com.reportflow.entity.Organization;
import com.reportflow.entity.User;
import com.reportflow.entity.UserOrganization;
import com.reportflow.entity.UserOrganizationId;
import com.reportflow.entity.UserRole;
import com.reportflow.repository.OrganizationRepository;
import com.reportflow.repository.UserOrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class OrganizationService {
    
    private final OrganizationRepository organizationRepository;
    private final UserOrganizationRepository userOrganizationRepository;
    
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
}
