package com.fpt.admission.repository;

import com.fpt.admission.entity.ReviewRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRuleRepository extends JpaRepository<ReviewRule, Long> {
    List<ReviewRule> findByIsActiveOrderByPriorityAsc(Boolean isActive);
}
