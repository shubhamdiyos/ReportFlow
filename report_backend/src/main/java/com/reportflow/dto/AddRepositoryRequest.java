package com.reportflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddRepositoryRequest {
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String githubUrl;
    
    @NotBlank
    private String organizationId;
    
    private String description;
}
