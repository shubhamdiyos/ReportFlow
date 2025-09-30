package com.reportflow.dto;

import com.reportflow.entity.SyncStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SyncResponse {
    
    private String repositoryId;
    private SyncStatus status;
    private String message;
    private LocalDateTime syncTime;
    
    public SyncResponse(String repositoryId, SyncStatus status, String message) {
        this.repositoryId = repositoryId;
        this.status = status;
        this.message = message;
        this.syncTime = LocalDateTime.now();
    }
}
