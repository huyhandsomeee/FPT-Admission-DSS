package com.fpt.admission.mapper;

import com.fpt.admission.dto.response.ApplicationResponse;
import com.fpt.admission.entity.Application;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public ApplicationResponse toResponse(Application application) {
        if (application == null) return null;

        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setApplicationCode(application.getApplicationCode());
        response.setStatus(application.getStatus() != null ? application.getStatus().name() : null);
        response.setMajorName(application.getMajor() != null ? application.getMajor().getName() : null);
        response.setCampusName(application.getCampus() != null ? application.getCampus().getName() : null);
        response.setMethodName(application.getAdmissionMethod() != null ? application.getAdmissionMethod().getName() : null);
        response.setTotalScore(application.getTotalScore());
        response.setRejectionReason(application.getRejectionReason());
        response.setOfficerNotes(application.getOfficerNotes());
        response.setSubmittedAt(application.getSubmittedAt() != null ? application.getSubmittedAt().toString() : null);
        response.setCreatedAt(application.getCreatedAt() != null ? application.getCreatedAt().toString() : null);
        return response;
    }
}
