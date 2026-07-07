package com.fpt.admission.repository;

import com.fpt.admission.entity.PriorityScore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PriorityScoreRepository extends JpaRepository<PriorityScore, Long> {
    Optional<PriorityScore> findByApplicationId(Long applicationId);
}
