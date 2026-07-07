package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_preference_confirmations")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AdmissionPreferenceConfirmation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "confirmation_date")
    private LocalDateTime confirmationDate;

    @Column(name = "preference_order")
    private Integer preferenceOrder;

    @Column(name = "major_code")
    private String majorCode;

    @Column(name = "major_name")
    private String majorName;

    @Column(name = "evidence_image", columnDefinition = "TEXT")
    private String evidenceImage;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "status")
    private String status;

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
