package com.fpt.admission.service;

import java.util.Map;

public interface DssModelService {
    Map<String, Object> simulate(Map<String, Object> params);
    Map<String, Object> optimizeQuota(Map<String, Object> params);
    Map<String, Object> getLiveDwMetrics();
    Map<String, Object> runLiveQualityCheck();
    Map<String, Object> applySimulationScenario(Map<String, Object> params);
}
