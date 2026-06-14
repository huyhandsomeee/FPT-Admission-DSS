package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "majors")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Major {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(name = "name_en")
    private String nameEn;
    private String faculty;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id")
    private Campus campus;
    private Integer quota = 0;
    @Column(name = "tuition_fee")
    private Long tuitionFee = 0L;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(name = "is_active")
    private Boolean isActive = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
