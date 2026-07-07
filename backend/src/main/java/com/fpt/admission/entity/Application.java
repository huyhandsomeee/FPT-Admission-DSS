package com.fpt.admission.entity;

import com.fpt.admission.entity.enums.ApplicationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Application {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_code", unique = true)
    private String applicationCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_year_id", nullable = false)
    private AdmissionYear admissionYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id", nullable = false)
    private Campus campus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id", nullable = false)
    private Major major;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_method_id", nullable = false)
    private AdmissionMethod admissionMethod;

    @Column(name = "priority_number")
    private Integer priorityNumber = 1;

    @Column(name = "total_score", precision = 5, scale = 2)
    private BigDecimal totalScore;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.DRAFT;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "officer_notes", columnDefinition = "TEXT")
    private String officerNotes;

    @Column(name = "moet_registered_at")
    private LocalDateTime moetRegisteredAt;

    @Column(name = "moet_released_at")
    private LocalDateTime moetReleasedAt;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;

    @Column(name = "fee_paid_at")
    private LocalDateTime feePaidAt;

    @Column(name = "chk_confirm_enrollment")
    private Boolean chkConfirmEnrollment = false;

    @Column(name = "chk_pay_fee")
    private Boolean chkPayFee = false;

    @Column(name = "chk_declare_info")
    private Boolean chkDeclareInfo = false;

    @Column(name = "chk_upload_cccd")
    private Boolean chkUploadCccd = false;

    @Column(name = "chk_upload_photo")
    private Boolean chkUploadPhoto = false;

    @Column(name = "chk_register_dorm")
    private Boolean chkRegisterDorm = false;

    @Column(name = "chk_print_letter")
    private Boolean chkPrintLetter = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
