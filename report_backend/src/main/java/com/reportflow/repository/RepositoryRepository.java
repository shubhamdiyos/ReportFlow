package com.reportflow.repository;

import com.reportflow.entity.Repository;
import com.reportflow.entity.SyncStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Repository
public interface RepositoryRepository extends JpaRepository<Repository, String> {
    
    List<Repository> findByOrganizationId(String organizationId);
    
    List<Repository> findByOrganizationIdAndIncluded(String organizationId, Boolean included);
    
    List<Repository> findByOrganizationIdAndSyncStatus(String organizationId, SyncStatus syncStatus);
    
    Optional<Repository> findByGithubId(String githubId);
    
    Optional<Repository> findByGithubUrl(String githubUrl);
    
    @Query("SELECT r FROM Repository r WHERE r.organization.id = :organizationId AND " +
           "(:status IS NULL OR r.syncStatus = :status) AND " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Repository> findRepositoriesWithFilters(@Param("organizationId") String organizationId,
                                               @Param("status") SyncStatus status,
                                               @Param("search") String search);
    
    @Query("SELECT SUM(r.commits) FROM Repository r WHERE r.organization.id = :organizationId AND r.included = true")
    Long getTotalCommitsByOrganizationId(@Param("organizationId") String organizationId);
}
