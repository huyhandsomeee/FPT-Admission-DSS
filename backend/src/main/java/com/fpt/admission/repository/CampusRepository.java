package com.fpt.admission.repository;
import com.fpt.admission.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CampusRepository extends JpaRepository<Campus, Long> {
    List<Campus> findByIsActiveTrue();
}
