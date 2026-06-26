package com.fpt.admission.service;

import java.util.List;
import java.util.Map;

public interface OfficerService {
    Map<String, Object> getDashboard(Long userId);
    List<Map<String, Object>> getApplications(String status, String search, int size);
    List<Map<String, Object>> getStudents(String search, int size);
    Map<String, Object> getApplicationDetail(Long id);
    Map<String, Object> updateApplicationStatus(Long id, String status, String notes, String reason, String score);
    List<Map<String, Object>> getNewRequests();
    Map<String, Object> allowNewApplication(Long userId, boolean allow);
}
