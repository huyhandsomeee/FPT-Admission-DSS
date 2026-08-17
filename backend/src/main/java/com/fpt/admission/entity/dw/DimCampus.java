package com.fpt.admission.entity.dw;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Dimension Campus - Bảng chiều cơ sở/địa điểm đào tạo
 */
@Entity
@Table(name = "dw_dim_campus")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DimCampus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campus_nk", nullable = false, length = 50)
    private String campusNK;

    @Column(name = "code", length = 20)
    private String code;

    @Column(name = "name", length = 200)
    private String name;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "email", length = 200)
    private String email;

    @Column(name = "region", length = 20)
    private String region;

    @Column(name = "is_active")
    private Boolean isActive = true;

    // SCD Type 2
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