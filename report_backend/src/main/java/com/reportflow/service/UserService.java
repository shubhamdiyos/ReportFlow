package com.reportflow.service;

import com.reportflow.dto.UserOrganizationMembership;
import com.reportflow.entity.User;
import com.reportflow.entity.UserOrganization;
import com.reportflow.repository.UserRepository;
import com.reportflow.repository.UserOrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final UserOrganizationRepository userOrganizationRepository;
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> findByGithubId(String githubId) {
        return userRepository.findByGithubId(githubId);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public Optional<User> getCurrentUser(String username) {
        return findByUsername(username);
    }
    
    public User updateUserProfile(String userId, String name, String email, String avatar, Boolean isOnboarded) {
        Optional<User> userOpt = findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        User user = userOpt.get();
        
        // Update fields if provided
        if (name != null && !name.trim().isEmpty()) {
            user.setName(name.trim());
        }
        
        if (email != null && !email.trim().isEmpty()) {
            // Check if email is already taken by another user
            Optional<User> existingUser = findByEmail(email);
            if (existingUser.isPresent() && !existingUser.get().getId().equals(userId)) {
                throw new RuntimeException("Email already exists: " + email);
            }
            user.setEmail(email.trim());
        }
        
        if (avatar != null) {
            user.setAvatar(avatar);
        }
        
        if (isOnboarded != null) {
            user.setIsOnboarded(isOnboarded);
        }
        
        return save(user);
    }
    
    public User createUser(String username, String name, String email) {
        // Check if user already exists
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("User already exists with username: " + username);
        }
        
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists with email: " + email);
        }
        
        User user = new User();
        user.setUsername(username);
        user.setName(name);
        user.setEmail(email);
        return userRepository.save(user);
    }
    
    public List<UserOrganizationMembership> getUserOrganizations(String userId) {
        List<UserOrganization> userOrganizations = userOrganizationRepository.findByUserIdAndIsActive(userId, true);
        return userOrganizations.stream()
                .map(this::mapToUserOrganizationMembership)
                .collect(Collectors.toList());
    }
    
    public boolean isSelfOrManager(String targetUserId, String currentUserName) {
        Optional<User> currentUser = findByUsername(currentUserName);
        if (currentUser.isEmpty()) {
            return false;
        }
        
        // User can access their own data
        if (currentUser.get().getId().equals(targetUserId)) {
            return true;
        }
        
        // Check if current user is a manager in any shared organization
        // This would require more complex logic to check shared organizations
        // For now, return false for simplicity
        return false;
    }
    
    private UserOrganizationMembership mapToUserOrganizationMembership(UserOrganization userOrg) {
        UserOrganizationMembership membership = new UserOrganizationMembership();
        membership.setId(userOrg.getOrganization().getId());
        membership.setName(userOrg.getOrganization().getName());
        membership.setDomain(userOrg.getOrganization().getDomain());
        membership.setLogo(userOrg.getOrganization().getLogo());
        membership.setType(userOrg.getOrganization().getType());
        membership.setRole(userOrg.getRole());
        membership.setJoinedAt(userOrg.getJoinedAt());
        membership.setIsActive(userOrg.getIsActive());
        membership.setCreatedAt(userOrg.getOrganization().getCreatedAt());
        return membership;
    }
}
