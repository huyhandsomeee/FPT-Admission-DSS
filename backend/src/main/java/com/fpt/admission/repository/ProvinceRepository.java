package com.fpt.admission.repository;
import com.fpt.admission.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProvinceRepository extends JpaRepository<Province, Long> {
    List<Province> findAllByOrderByName();
}
