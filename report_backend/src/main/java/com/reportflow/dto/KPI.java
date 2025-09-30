package com.reportflow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KPI {
    
    private String id;
    private String title;
    private Object value; // Can be String or Number
    private String change;
    private String changeType; // "positive" | "negative" | "neutral"
    private String icon;
    private String color;
}
