package com.reportflow.repository;

import com.reportflow.entity.Team;
import com.reportflow.entity.TeamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {
    
    List<Team> findByOrganizationId(String organizationId);
    
    List<Team> findByOrganizationIdAndStatus(String organizationId, TeamStatus status);
    
    @Query("SELECT SUM(t.commits) FROM Team t WHERE t.organization.id = :organizationId")
    Long getTotalCommitsByOrganizationId(@Param("organizationId") String organizationId);
    
    @Query("SELECT SUM(t.prs) FROM Team t WHERE t.organization.id = :organizationId")
    Long getTotalPrsByOrganizationId(@Param("organizationId") String organizationId);
}
