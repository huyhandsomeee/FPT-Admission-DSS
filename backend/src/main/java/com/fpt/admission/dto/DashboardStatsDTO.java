package com.fpt.admission.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalApplications;
    private Long submitted;
    private Long underReview;
    private Long approved;
    private Long rejected;
    private Long enrolled;
    private Integer activeYear;
    private Integer quota;
    private Double approvalRate;
    private Double enrollmentRate;
}
