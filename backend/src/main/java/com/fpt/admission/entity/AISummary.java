package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_summaries")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AISummary {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    private String recommendation;

    private Integer confidence;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}
