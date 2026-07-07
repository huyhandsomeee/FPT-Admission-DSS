package com.fpt.admission.repository;

import com.fpt.admission.entity.ValidationResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ValidationResultRepository extends JpaRepository<ValidationResult, Long> {
    Optional<ValidationResult> findByApplicationId(Long applicationId);
}
