package com.fpt.admission.repository;

import com.fpt.admission.entity.Application;
import com.fpt.admission.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentProfileId(Long studentProfileId);
    Page<Application> findByStatus(ApplicationStatus status, Pageable pageable);
    long countByStatus(ApplicationStatus status);
    long countByAdmissionYearId(Long yearId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.admissionYear.year = :year")
    long countByYear(@Param("year") int year);

    @Query("SELECT a.campus.name, COUNT(a) FROM Application a WHERE a.admissionYear.id = :yearId GROUP BY a.campus.name")
    List<Object[]> countByCampus(@Param("yearId") Long yearId);

    @Query("SELECT a.major.name, COUNT(a) FROM Application a WHERE a.admissionYear.id = :yearId GROUP BY a.major.name ORDER BY COUNT(a) DESC")
    List<Object[]> countByMajor(@Param("yearId") Long yearId);

    @Query("SELECT a.studentProfile.province.name, COUNT(a) FROM Application a WHERE a.admissionYear.id = :yearId AND a.studentProfile.province IS NOT NULL GROUP BY a.studentProfile.province.name ORDER BY COUNT(a) DESC")
    List<Object[]> countByProvince(@Param("yearId") Long yearId);

    @Query("SELECT a.status, COUNT(a) FROM Application a WHERE a.admissionYear.id = :yearId GROUP BY a.status")
    List<Object[]> countByStatusForYear(@Param("yearId") Long yearId);

    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.studentProfile sp JOIN FETCH sp.user u " +
           "WHERE (:status IS NULL OR a.status = :status) AND " +
           "(:campusId IS NULL OR a.campus.id = :campusId) AND " +
           "(:majorId IS NULL OR a.major.id = :majorId) AND " +
           "(:methodId IS NULL OR a.admissionMethod.id = :methodId) AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.applicationCode) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Application> findWithFilters(@Param("status") ApplicationStatus status,
                                      @Param("campusId") Long campusId,
                                      @Param("majorId") Long majorId,
                                      @Param("methodId") Long methodId,
                                      @Param("search") String search,
                                      Pageable pageable);
}
