package com.reportflow.repository;

import com.reportflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByGithubId(String githubId);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u JOIN u.userOrganizations uo WHERE uo.organization.id = :organizationId AND uo.isActive = true")
    java.util.List<User> findActiveUsersByOrganizationId(@Param("organizationId") String organizationId);
}
