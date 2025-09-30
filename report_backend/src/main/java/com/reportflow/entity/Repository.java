package com.reportflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "repositories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Repository {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String language;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private RepositoryVisibility visibility = RepositoryVisibility.PUBLIC;
    
    @Column(nullable = false)
    private Integer commits = 0;
    
    @Column(name = "last_sync")
    private LocalDateTime lastSync;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "sync_status", nullable = false)
    private SyncStatus syncStatus = SyncStatus.PENDING;
    
    @Column(nullable = false)
    private Boolean included = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    
    @Column(name = "github_url")
    private String githubUrl;
    
    @Column(name = "github_id")
    private String githubId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
