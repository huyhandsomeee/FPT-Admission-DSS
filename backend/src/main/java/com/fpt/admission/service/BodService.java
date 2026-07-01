package com.fpt.admission.service;

import java.util.List;
import java.util.Map;

public interface BodService {
    Map<String, Object> getExecutiveDashboard();
    List<Map<String, Object>> getRiskAssessment();
    List<Map<String, Object>> getStrategicForecast();
    List<Map<String, Object>> getEnrollmentTrends();
    List<Map<String, Object>> getCompetitiveAnalysis();
    List<Map<String, Object>> getFinancialProjection();
    List<Map<String, Object>> getCampusPerformance();
    Map<String, Object> getRiskHeatmap();
    List<Map<String, Object>> getAdmissionMethodEffectiveness();
    List<Map<String, Object>> getProvinceRiskProfile();
}