package com.reportflow.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequest {
    
    private String name;
    
    @Email
    private String email;
    
    private String avatar;
    
    private Boolean isOnboarded;
}
