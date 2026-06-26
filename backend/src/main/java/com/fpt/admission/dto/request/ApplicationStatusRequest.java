package com.fpt.admission.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationStatusRequest {
    private String status;
    private String notes;
    private String reason;
    private String score;
}
