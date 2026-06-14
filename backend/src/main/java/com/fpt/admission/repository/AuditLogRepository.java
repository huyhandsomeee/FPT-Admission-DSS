package com.fpt.admission.repository;
import com.fpt.admission.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByOrderByCreatedAtDesc(Pageable pageable);
    Page<AuditLog> findByUserEmailContainingIgnoreCaseOrderByCreatedAtDesc(String email, Pageable pageable);
}
