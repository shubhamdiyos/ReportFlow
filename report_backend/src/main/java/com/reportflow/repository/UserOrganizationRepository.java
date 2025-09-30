package com.reportflow.repository;

import com.reportflow.entity.UserOrganization;
import com.reportflow.entity.UserOrganizationId;
import com.reportflow.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserOrganizationRepository extends JpaRepository<UserOrganization, UserOrganizationId> {
    
    List<UserOrganization> findByUserIdAndIsActive(String userId, Boolean isActive);
    
    List<UserOrganization> findByOrganizationIdAndIsActive(String organizationId, Boolean isActive);
    
    Optional<UserOrganization> findByUserIdAndOrganizationId(String userId, String organizationId);
    
    @Query("SELECT uo FROM UserOrganization uo WHERE uo.user.id = :userId AND uo.organization.id = :organizationId AND uo.isActive = true")
    Optional<UserOrganization> findActiveUserOrganization(@Param("userId") String userId, @Param("organizationId") String organizationId);
    
    @Query("SELECT COUNT(uo) FROM UserOrganization uo WHERE uo.organization.id = :organizationId AND uo.isActive = true")
    Long countActiveUsersByOrganizationId(@Param("organizationId") String organizationId);
    
    @Query("SELECT COUNT(uo) FROM UserOrganization uo WHERE uo.organization.id = :organizationId AND uo.role = :role AND uo.isActive = true")
    Long countActiveUsersByOrganizationIdAndRole(@Param("organizationId") String organizationId, @Param("role") UserRole role);
}
