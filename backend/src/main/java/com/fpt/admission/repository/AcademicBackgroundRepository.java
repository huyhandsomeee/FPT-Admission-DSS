package com.fpt.admission.repository;

import com.fpt.admission.entity.AcademicBackground;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AcademicBackgroundRepository extends JpaRepository<AcademicBackground, Long> {
    Optional<AcademicBackground> findByStudentProfileId(Long studentProfileId);
}
