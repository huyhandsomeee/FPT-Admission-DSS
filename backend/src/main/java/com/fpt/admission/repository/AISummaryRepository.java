package com.fpt.admission.repository;

import com.fpt.admission.entity.AISummary;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AISummaryRepository extends JpaRepository<AISummary, Long> {
    Optional<AISummary> findByApplicationId(Long applicationId);
}
