package com.reportflow.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartData {
    
    private String name;
    private Integer value;
    private String trend; // "up" | "down" | "stable"
    private String color;
}
