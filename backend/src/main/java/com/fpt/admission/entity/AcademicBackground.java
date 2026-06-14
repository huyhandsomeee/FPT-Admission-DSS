package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "academic_backgrounds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademicBackground {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @Column(name = "school_name")
    private String schoolName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_province_id")
    private Province schoolProvince;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "gpa_10", precision = 4, scale = 2)
    private BigDecimal gpa10;

    @Column(name = "gpa_11", precision = 4, scale = 2)
    private BigDecimal gpa11;

    @Column(name = "gpa_12", precision = 4, scale = 2)
    private BigDecimal gpa12;

    @Column(name = "math_score", precision = 4, scale = 2)
    private BigDecimal mathScore;

    @Column(name = "literature_score", precision = 4, scale = 2)
    private BigDecimal literatureScore;

    @Column(name = "english_score", precision = 4, scale = 2)
    private BigDecimal englishScore;

    @Column(name = "total_score", precision = 5, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "sat_score")
    private Integer satScore;

    @Column(name = "ielts_score", precision = 3, scale = 1)
    private BigDecimal ieltsScore;

    @Column(name = "toefl_score")
    private Integer toeflScore;

    @Column(name = "academic_achievement", columnDefinition = "TEXT")
    private String academicAchievement;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
