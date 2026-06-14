package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "campuses")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Campus {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String code;
    @Column(nullable = false)
    private String name;
    private String city;
    @Column(columnDefinition = "TEXT")
    private String address;
    private String phone;
    private String email;
    @Column(name = "is_active")
    private Boolean isActive = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
