package com.fpt.admission.repository;
import com.fpt.admission.entity.Major;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MajorRepository extends JpaRepository<Major, Long> {
    List<Major> findByIsActiveTrue();
    List<Major> findByCampusIdAndIsActiveTrue(Long campusId);
}
