package com.reportflow.dto;

import com.reportflow.entity.OrganizationType;
import com.reportflow.entity.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOrganizationMembership {
    
    private String id;
    private String name;
    private String domain;
    private String logo;
    private OrganizationType type;
    private UserRole role;
    private LocalDateTime joinedAt;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
