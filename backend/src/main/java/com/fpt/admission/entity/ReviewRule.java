package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_rules")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ReviewRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(name = "min_gpa")
    private Double minGpa;

    @Column(name = "require_complete_docs")
    private Boolean requireCompleteDocs;

    @Column(name = "allow_duplicates")
    private Boolean allowDuplicates;

    private String action; // READY_FOR_APPROVAL, NEED_MORE_DOCUMENT, REJECT_RECOMMENDED, MANUAL_REVIEW

    @Column(name = "is_active")
    private Boolean isActive;

    private Integer priority;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
