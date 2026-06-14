package com.fpt.admission.repository;
import com.fpt.admission.entity.AdmissionYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AdmissionYearRepository extends JpaRepository<AdmissionYear, Long> {
    Optional<AdmissionYear> findByStatus(String status);
    Optional<AdmissionYear> findTopByOrderByYearDesc();
}
