package com.fpt.admission.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "moet_results")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class MoetResult {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "application_code")
    private String applicationCode;

    @Column(name = "full_name")
    private String fullName;

    private String major;

    private Integer choice;

    private String result; // PASS or FAIL

    @Column(name = "synced_at")
    private LocalDateTime syncedAt;
}
