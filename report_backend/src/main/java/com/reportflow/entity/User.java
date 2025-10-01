package com.reportflow.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank
    @Column(nullable = false)
    private String name;
    
    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;
    
    private String avatar;
    
    @Column(name = "github_id", unique = true)
    private String githubId;
    
    @Column(name = "github_access_token")
    private String githubAccessToken;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private UserRole role = UserRole.DEVELOPER;
    
    @Column(name = "is_onboarded", nullable = false)
    private Boolean isOnboarded = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<UserOrganization> userOrganizations = new HashSet<>();
}
