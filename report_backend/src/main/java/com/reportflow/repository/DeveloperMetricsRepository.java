package com.reportflow.repository;

import com.reportflow.entity.DeveloperMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeveloperMetricsRepository extends JpaRepository<DeveloperMetrics, String> {
    
    Optional<DeveloperMetrics> findByUserIdAndOrganizationId(String userId, String organizationId);
    
    List<DeveloperMetrics> findByOrganizationId(String organizationId);
    
    List<DeveloperMetrics> findByUserId(String userId);
    
    @Query("SELECT dm FROM DeveloperMetrics dm WHERE dm.organization.id = :organizationId ORDER BY dm.commits DESC")
    List<DeveloperMetrics> findTopDevelopersByCommits(@Param("organizationId") String organizationId);
    
    @Query("SELECT SUM(dm.commits) FROM DeveloperMetrics dm WHERE dm.organization.id = :organizationId")
    Long getTotalCommitsByOrganizationId(@Param("organizationId") String organizationId);
    
    @Query("SELECT SUM(dm.reviews) FROM DeveloperMetrics dm WHERE dm.organization.id = :organizationId")
    Long getTotalReviewsByOrganizationId(@Param("organizationId") String organizationId);
}
