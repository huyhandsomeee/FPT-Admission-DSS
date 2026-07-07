package com.fpt.admission.repository;

import com.fpt.admission.entity.MoetResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MoetResultRepository extends JpaRepository<MoetResult, Long> {
}
