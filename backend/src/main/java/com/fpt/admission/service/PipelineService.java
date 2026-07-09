package com.fpt.admission.service;

import com.fpt.admission.entity.*;
import java.util.List;
import java.util.Map;

public interface PipelineService {
    ValidationResult validateApplication(Long applicationId);
    PriorityScore calculatePriorityScore(Long applicationId);
    AISummary generateAISummary(Long applicationId);
    void processPipeline(Long applicationId);
    List<Map<String, Object>> getSmartReviewQueue();
    void approveApplication(Long applicationId, String officerEmail);
    void approveApplicationsBatch(List<Long> applicationIds, String officerEmail);
    void rejectApplication(Long applicationId, String reason, String officerEmail);
    void requestMoreDocuments(Long applicationId, String notes, String officerEmail);
    void seedDefaultRules();
    void processAllPipelines();
}
