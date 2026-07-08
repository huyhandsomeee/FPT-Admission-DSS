package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "strategic_recommendations")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class StrategicRecommendation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String impact;
    
    @Column(nullable = false)
    private String priority; // HIGH, MEDIUM, LOW
    
    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, ADJUST_REQUESTED
    
    @Column(nullable = false)
    private String category; // AI_QUOTA, REGION_MID, CONVERSION_RATE, PROCESS_OPT
    
    @Column(name = "current_value")
    private Integer currentValue;
    
    @Column(name = "target_value")
    private Integer targetValue;
    
    @Column(name = "action_plan", columnDefinition = "TEXT")
    private String actionPlan;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
