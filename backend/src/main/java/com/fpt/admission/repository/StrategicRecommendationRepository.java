package com.fpt.admission.repository;

import com.fpt.admission.entity.StrategicRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StrategicRecommendationRepository extends JpaRepository<StrategicRecommendation, Long> {
    Optional<StrategicRecommendation> findByCategory(String category);
}
