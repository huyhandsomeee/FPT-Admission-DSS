package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_years")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AdmissionYear {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Integer year;
    private String name;
    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Column(name = "quota_total")
    private Integer quotaTotal = 0;
    @Column(columnDefinition = "ENUM('UPCOMING','ACTIVE','CLOSED')")
    private String status = "UPCOMING";
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
