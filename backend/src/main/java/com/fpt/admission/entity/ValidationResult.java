package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "validation_results")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ValidationResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "status")
    private String status; // COMPLETE, WARNING, ERROR

    @Column(name = "required_docs_ok")
    private Boolean requiredDocsOk;

    @Column(name = "cccd_format_ok")
    private Boolean cccdFormatOk;

    @Column(name = "gpa_valid")
    private Boolean gpaValid;

    @Column(name = "cert_not_expired")
    private Boolean certNotExpired;

    @Column(name = "no_duplicate_cccd")
    private Boolean noDuplicateCccd;

    @Column(name = "no_duplicate_email")
    private Boolean noDuplicateEmail;

    @Column(name = "no_duplicate_phone")
    private Boolean noDuplicatePhone;

    @Column(name = "missing_info_details", columnDefinition = "TEXT")
    private String missingInfoDetails;

    @Column(name = "invalid_format_details", columnDefinition = "TEXT")
    private String invalidFormatDetails;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt;
}
