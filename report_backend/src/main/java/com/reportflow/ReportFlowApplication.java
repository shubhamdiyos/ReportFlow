package com.reportflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ReportFlowApplication {
    public static void main(String[] args) {
        SpringApplication.run(ReportFlowApplication.class, args);
    }
}
