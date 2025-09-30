package com.reportflow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantSwitchResponse {
    
    private String organizationId;
    private String organizationName;
    private String message;
}
