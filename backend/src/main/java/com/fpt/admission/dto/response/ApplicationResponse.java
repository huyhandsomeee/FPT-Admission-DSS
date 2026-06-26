package com.fpt.admission.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private String applicationCode;
    private String status;
    private String majorName;
    private String campusName;
    private String methodName;
    private Object totalScore;
    private String rejectionReason;
    private String officerNotes;
    private String submittedAt;
    private String createdAt;
    private String fullName;
    private String dob;
    private String gender;
    private String phone;
    private String cccd;
    private String permanentAddress;
    private Object provinceId;
    private String parentName;
    private String parentPhone;
    private Map<String, Object> academicBackground;
    private List<Map<String, Object>> documents;
}
