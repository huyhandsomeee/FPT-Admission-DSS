package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "strategic_risks")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class StrategicRisk {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String level; // HIGH, MEDIUM, LOW
    
    @Column(name = "level_label", nullable = false)
    private String levelLabel;
    
    @Column(name = "level_bg")
    private String levelBg;
    
    @Column(name = "level_color")
    private String levelColor;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String suggestion;
    
    @Column(name = "suggestion_color")
    private String suggestionColor;
    
    @Column(name = "icon_type")
    private String iconType; // ALERT, TREND, SHARE, USERS
    
    @Column(nullable = false)
    private String status; // ACTIVE, MITIGATED, RESOLVED
    
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
