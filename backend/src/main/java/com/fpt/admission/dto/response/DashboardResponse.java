package com.fpt.admission.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private int totalApplications;
    private List<Map<String, Object>> applications;
    private boolean hasProfile;
    private boolean allowNewApplication;
    private String newApplicationRequest;
    private long unreadNotifications;
}
