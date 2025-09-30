package com.reportflow.repository;

import com.reportflow.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {
    
    Optional<Organization> findByDomain(String domain);
    
    boolean existsByDomain(String domain);
    
    List<Organization> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT o FROM Organization o JOIN o.userOrganizations uo WHERE uo.user.id = :userId AND uo.isActive = true")
    List<Organization> findActiveOrganizationsByUserId(@Param("userId") String userId);
}
