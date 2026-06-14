package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "admission_methods")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AdmissionMethod {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "min_score", precision = 5, scale = 2)
    private BigDecimal minScore;
    @Column(name = "priority_order")
    private Integer priorityOrder = 0;
    @Column(name = "is_active")
    private Boolean isActive = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
