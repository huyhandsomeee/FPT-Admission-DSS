package com.fpt.admission.repository;

import com.fpt.admission.entity.Application;
import com.fpt.admission.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentProfileId(Long studentProfileId);
    Page<Application> findByStatus(ApplicationStatus status, Pageable pageable);
    long countByStatus(ApplicationStatus status);
    long countByStatusAndReviewedAtBetween(ApplicationStatus status, LocalDateTime start, LocalDateTime end);
    long countByAdmissionYearId(Long yearId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.major.code = :majorCode AND a.admissionYear.year = :year")
    long countByMajorCodeAndYear(@Param("majorCode") String majorCode, @Param("year") int year);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.major.code IN :codes")
    long countByMajorCodes(@Param("codes") List<String> codes);

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

    // Daily trend: số hồ sơ nộp theo ngày trong N ngày gần nhất
    @Query(value = "SELECT DATE(submitted_at) as day, COUNT(*) as cnt " +
           "FROM applications WHERE submitted_at >= :since AND submitted_at IS NOT NULL " +
           "GROUP BY DATE(submitted_at) ORDER BY day ASC", nativeQuery = true)
    List<Object[]> countDailySubmissions(@Param("since") LocalDateTime since);

    // Tỷ lệ chuyển đổi: submitted -> approved/enrolled
    @Query("SELECT COUNT(a) FROM Application a WHERE a.status IN :statuses AND a.admissionYear.id = :yearId")
    long countByStatusesAndYear(@Param("statuses") List<ApplicationStatus> statuses, @Param("yearId") Long yearId);

    // Top hồ sơ tiềm năng cao (dựa trên GPA 10+11+12)
    @Query("SELECT a FROM Application a " +
           "JOIN FETCH a.studentProfile sp JOIN FETCH sp.user u " +
           "LEFT JOIN FETCH sp.academicBackground ab " +
           "WHERE a.admissionYear.id = :yearId AND a.status IN ('SUBMITTED','UNDER_REVIEW') " +
           "AND ab IS NOT NULL AND ab.gpa10 IS NOT NULL AND ab.gpa11 IS NOT NULL AND ab.gpa12 IS NOT NULL " +
           "ORDER BY (ab.gpa10 + ab.gpa11 + ab.gpa12) DESC")
    List<Application> findTopPotentialApplications(@Param("yearId") Long yearId, Pageable pageable);

    @Query(value = "SELECT a FROM Application a " +
           "JOIN FETCH a.studentProfile sp JOIN FETCH sp.user u " +
            "WHERE (:status IS NULL OR a.status = :status) AND " +
           "(:campusId IS NULL OR a.campus.id = :campusId) AND " +
           "(:majorId IS NULL OR a.major.id = :majorId) AND " +
           "(:methodId IS NULL OR a.admissionMethod.id = :methodId) AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.applicationCode) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.major.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.major.faculty) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.major.code) LIKE LOWER(CONCAT('%',:search,'%')))",
           countQuery = "SELECT COUNT(a) FROM Application a " +
           "JOIN a.studentProfile sp JOIN sp.user u " +
           "WHERE (:status IS NULL OR a.status = :status) AND " +
           "(:campusId IS NULL OR a.campus.id = :campusId) AND " +
           "(:majorId IS NULL OR a.major.id = :majorId) AND " +
           "(:methodId IS NULL OR a.admissionMethod.id = :methodId) AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.applicationCode) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.major.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.major.faculty) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(a.major.code) LIKE LOWER(CONCAT('%',:search,'%')))")
    Page<Application> findWithFilters(@Param("status") ApplicationStatus status,
                                      @Param("campusId") Long campusId,
                                      @Param("majorId") Long majorId,
                                      @Param("methodId") Long methodId,
                                      @Param("search") String search,
                                      Pageable pageable);
}
