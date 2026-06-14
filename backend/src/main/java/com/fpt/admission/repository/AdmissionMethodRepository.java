package com.fpt.admission.repository;
import com.fpt.admission.entity.AdmissionMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AdmissionMethodRepository extends JpaRepository<AdmissionMethod, Long> {
    List<AdmissionMethod> findByIsActiveTrueOrderByPriorityOrder();
}
