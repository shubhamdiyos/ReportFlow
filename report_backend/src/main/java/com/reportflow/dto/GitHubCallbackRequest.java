package com.reportflow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GitHubCallbackRequest {
    
    @NotBlank
    private String code;
    
    private String state;
}
