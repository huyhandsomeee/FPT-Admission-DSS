package com.fpt.admission.repository;

import com.fpt.admission.entity.RecommendationModelConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecommendationModelConfigRepository extends JpaRepository<RecommendationModelConfig, Long> {
    Optional<RecommendationModelConfig> findFirstByOrderByIdAsc();
}
