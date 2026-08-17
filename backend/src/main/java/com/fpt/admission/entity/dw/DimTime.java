package com.fpt.admission.entity.dw;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Dimension Time - Bảng chiều thời gian cho Data Warehouse
 * Hỗ trợ phân tích theo năm, quý, tháng, tuần, ngày
 */
@Entity
@Table(name = "dw_dim_time")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DimTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_key", nullable = false, unique = true)
    private Integer dateKey; // YYYYMMDD format

    @Column(name = "full_date", nullable = false)
    private LocalDate fullDate;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek; // 1=Monday, 7=Sunday

    @Column(name = "day_name", length = 20)
    private String dayName;

    @Column(name = "day_of_month", nullable = false)
    private Integer dayOfMonth;

    @Column(name = "day_of_year", nullable = false)
    private Integer dayOfYear;

    @Column(name = "week_of_year", nullable = false)
    private Integer weekOfYear;

    @Column(name = "month_number", nullable = false)
    private Integer monthNumber;

    @Column(name = "month_name", length = 20)
    private String monthName;

    @Column(name = "month_name_short", length = 10)
    private String monthNameShort;

    @Column(name = "quarter_number", nullable = false)
    private Integer quarterNumber;

    @Column(name = "quarter_name", length = 10)
    private String quarterName;

    @Column(name = "year_number", nullable = false)
    private Integer yearNumber;

    @Column(name = "year_month", length = 10)
    private String yearMonth; // YYYY-MM

    @Column(name = "year_quarter", length = 10)
    private String yearQuarter; // YYYY-Q

    @Column(name = "is_weekend")
    private Boolean isWeekend = false;

    @Column(name = "is_holiday")
    private Boolean isHoliday = false;

    @Column(name = "holiday_name", length = 100)
    private String holidayName;

    @Column(name = "admission_season", length = 20)
    private String admissionSeason; // EARLY_BIRD, MAIN_ROUND, SUPPLEMENTARY

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}