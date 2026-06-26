package com.fpt.admission.service.impl;

import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.repository.*;
import com.fpt.admission.service.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ManagerServiceImpl implements ManagerService {

    private final ApplicationRepository applicationRepository;
    private final AdmissionYearRepository admissionYearRepository;

    @Override
    public Map<String, Object> getDashboard() {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalApplications", applicationRepository.count());
        data.put("approved", applicationRepository.countByStatus(ApplicationStatus.APPROVED));
        data.put("enrolled", applicationRepository.countByStatus(ApplicationStatus.ENROLLED));
        data.put("underReview", applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW));
        data.put("rejected", applicationRepository.countByStatus(ApplicationStatus.REJECTED));

        if (activeYear != null) {
            data.put("activeYear", activeYear.getYear());
            data.put("quota", activeYear.getQuotaTotal());
            long enrolledCount = applicationRepository.countByStatus(ApplicationStatus.ENROLLED);
            data.put("enrollmentRate", activeYear.getQuotaTotal() > 0
                    ? Math.round((double) enrolledCount / activeYear.getQuotaTotal() * 100) : 0);
        }

        var statusStats = new ArrayList<Map<String, Object>>();
        for (ApplicationStatus s : ApplicationStatus.values()) {
            statusStats.add(Map.of("status", s.name(), "count", applicationRepository.countByStatus(s)));
        }
        data.put("statusBreakdown", statusStats);

        return data;
    }

    @Override
    public List<Map<String, Object>> getAnalyticsByMajor() {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        if (activeYear == null) return List.of();

        var raw = applicationRepository.countByMajor(activeYear.getId());
        return raw.stream().map(row -> Map.<String, Object>of(
                "name", row[0].toString(),
                "count", ((Number) row[1]).longValue()
        )).toList();
    }

    @Override
    public List<Map<String, Object>> getAnalyticsByProvince() {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        if (activeYear == null) return List.of();

        var raw = applicationRepository.countByProvince(activeYear.getId());
        return raw.stream().map(row -> Map.<String, Object>of(
                "province", row[0].toString(),
                "count", ((Number) row[1]).longValue()
        )).toList();
    }

    @Override
    public List<Map<String, Object>> getAnalyticsByCampus() {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        if (activeYear == null) return List.of();

        var raw = applicationRepository.countByCampus(activeYear.getId());
        return raw.stream().map(row -> Map.<String, Object>of(
                "campus", row[0].toString(),
                "count", ((Number) row[1]).longValue()
        )).toList();
    }

    @Override
    public List<Map<String, Object>> getTrends() {
        return List.of(
                Map.of("year", 2022, "applications", 14500, "enrolled", 11200),
                Map.of("year", 2023, "applications", 15000, "enrolled", 12500),
                Map.of("year", 2024, "applications", 17000, "enrolled", 14200),
                Map.of("year", 2025, "applications", 20000, "enrolled", 16800),
                Map.of("year", 2026, "applications", applicationRepository.count(), "enrolled",
                        applicationRepository.countByStatus(ApplicationStatus.ENROLLED))
        );
    }

    @Override
    public List<Map<String, Object>> getForecast() {
        return List.of(
                Map.of("year", 2026, "actual", applicationRepository.count(), "predicted", applicationRepository.count()),
                Map.of("year", 2027, "actual", null, "predicted", 22500),
                Map.of("year", 2028, "actual", null, "predicted", 25200),
                Map.of("year", 2029, "actual", null, "predicted", 28200)
        );
    }
}
