package com.fpt.admission.repository;

import com.fpt.admission.entity.AdmissionPreferenceConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdmissionPreferenceConfirmationRepository extends JpaRepository<AdmissionPreferenceConfirmation, Long> {
    Optional<AdmissionPreferenceConfirmation> findByApplicationId(Long applicationId);
}
