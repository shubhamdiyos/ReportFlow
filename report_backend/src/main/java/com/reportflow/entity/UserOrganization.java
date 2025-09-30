package com.reportflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_organizations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOrganization {
    
    @EmbeddedId
    private UserOrganizationId id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("organizationId")
    @JoinColumn(name = "organization_id")
    private Organization organization;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private UserRole role = UserRole.DEVELOPER;
    
    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
