package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "priority_scores")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PriorityScore {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    private Integer score;

    @Column(name = "gpa_component")
    private Double gpaComponent;

    @Column(name = "english_component")
    private Double englishComponent;

    @Column(name = "document_component")
    private Double documentComponent;

    @Column(name = "achievement_component")
    private Double achievementComponent;

    @Column(name = "date_component")
    private Double dateComponent;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;
}
