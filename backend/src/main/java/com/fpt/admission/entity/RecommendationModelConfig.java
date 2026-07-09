package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_model_configs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RecommendationModelConfig {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quota_threshold_weight")
    private Double quotaThresholdWeight; // Weight for Major/AI Quota threshold

    @Column(name = "region_threshold_weight")
    private Double regionThresholdWeight; // Weight for Region Mid marketing suggestion

    @Column(name = "conversion_threshold_weight")
    private Double conversionThresholdWeight; // Weight for conversion rate threshold

    @Column(name = "process_opt_weight")
    private Double processOptWeight; // Weight for process optimization suggestions

    @Column(name = "learning_rate")
    private Double learningRate;

    @Column(name = "training_epochs")
    private Integer trainingEpochs;

    @Column(name = "model_accuracy")
    private Double modelAccuracy;

    @Column(name = "last_trained_at")
    private LocalDateTime lastTrainedAt;
    
    @Column(name = "total_runs")
    private Integer totalRuns;
}
