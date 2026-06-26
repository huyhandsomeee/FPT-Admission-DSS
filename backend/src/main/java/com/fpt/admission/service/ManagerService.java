package com.fpt.admission.service;

import java.util.List;
import java.util.Map;

public interface ManagerService {
    Map<String, Object> getDashboard();
    List<Map<String, Object>> getAnalyticsByMajor();
    List<Map<String, Object>> getAnalyticsByProvince();
    List<Map<String, Object>> getAnalyticsByCampus();
    List<Map<String, Object>> getTrends();
    List<Map<String, Object>> getForecast();
}
