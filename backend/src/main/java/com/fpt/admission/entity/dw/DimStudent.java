package com.fpt.admission.entity.dw;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Dimension Student - Bảng chiều sinh viên/thí sinh cho Data Warehouse
 * SCD Type 2: Theo dõi lịch sử thay đổi thông tin sinh viên
 */
@Entity
@Table(name = "dw_dim_student")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DimStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Natural key từ hệ thống nguồn
    @Column(name = "student_nk", nullable = false, length = 50)
    private String studentNK; // student_code hoặc user_id từ hệ thống OLTP

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "student_code", length = 30)
    private String studentCode;

    @Column(name = "full_name", length = 200)
    private String fullName;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "ethnicity", length = 50)
    private String ethnicity;

    @Column(name = "permanent_address", columnDefinition = "TEXT")
    private String permanentAddress;

    @Column(name = "current_address", columnDefinition = "TEXT")
    private String currentAddress;

    @Column(name = "province_id")
    private Long provinceId;

    @Column(name = "province_name", length = 100)
    private String provinceName;

    @Column(name = "region", length = 20)
    private String region; // NORTH, CENTRAL, SOUTH

    @Column(name = "cccd_number", length = 20)
    private String cccdNumber;

    @Column(name = "parent_name", length = 200)
    private String parentName;

    @Column(name = "parent_phone", length = 20)
    private String parentPhone;

    @Column(name = "father_name", length = 200)
    private String fatherName;

    @Column(name = "father_phone", length = 20)
    private String fatherPhone;

    @Column(name = "mother_name", length = 200)
    private String motherName;

    @Column(name = "mother_phone", length = 20)
    private String motherPhone;

    // SCD Type 2 fields
    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;

    @Column(name = "valid_to")
    private LocalDateTime validTo;

    @Column(name = "is_current")
    private Boolean isCurrent = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (validFrom == null) {
            validFrom = LocalDateTime.now();
        }
    }
}