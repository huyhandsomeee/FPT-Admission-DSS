package com.fpt.admission.service;

import com.fpt.admission.entity.Application;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.repository.ApplicationRepository;
import com.fpt.admission.repository.AdmissionYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final ApplicationRepository applicationRepository;
    private final AdmissionYearRepository admissionYearRepository;

    public Map<String, Object> getDashboardStats() {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));

        long total = applicationRepository.count();
        long submitted = applicationRepository.countByStatus(ApplicationStatus.SUBMITTED);
        long underReview = applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW);
        long approved = applicationRepository.countByStatus(ApplicationStatus.APPROVED);
        long rejected = applicationRepository.countByStatus(ApplicationStatus.REJECTED);
        long enrolled = applicationRepository.countByStatus(ApplicationStatus.ENROLLED);
        long itTotal = applicationRepository.countByMajorCodes(List.of("SE", "AI", "IS"));

        java.time.LocalDateTime startOfDay = java.time.LocalDate.now().atStartOfDay();
        java.time.LocalDateTime endOfDay = startOfDay.plusDays(1);
        long approvedToday = applicationRepository.countByStatusAndReviewedAtBetween(
                ApplicationStatus.APPROVED, startOfDay, endOfDay);

        int year = activeYear != null ? activeYear.getYear() : 2026;
        int quota = activeYear != null ? (activeYear.getQuotaTotal() != null ? activeYear.getQuotaTotal() : 18000) : 18000;
        double enrollmentRate = quota > 0 ? Math.round((double) enrolled / quota * 10000.0) / 100.0 : 0.0;
        double approvalRate = total > 0 ? Math.round((double) approved / total * 10000.0) / 100.0 : 0.0;

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalApplications", total);
        data.put("itTotal", itTotal);
        data.put("submitted", submitted);
        data.put("underReview", underReview);
        data.put("approved", approved);
        data.put("approvedToday", approvedToday);
        data.put("rejected", rejected);
        data.put("enrolled", enrolled);
        data.put("activeYear", year);
        data.put("quota", quota);
        data.put("approvalRate", approvalRate);
        data.put("enrollmentRate", enrollmentRate);
        return data;
    }

    public Map<String, Long> getStatsByMajor() {
        List<Application> apps = applicationRepository.findAll();
        return apps.stream()
                .filter(a -> a.getMajor() != null)
                .collect(Collectors.groupingBy(a -> a.getMajor().getCode(), Collectors.counting()))
                .entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    public Map<String, Long> getStatsByStatus() {
        List<Application> apps = applicationRepository.findAll();
        return apps.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus().toString(), Collectors.counting()));
    }

    public Map<String, Long> getStatsByMethod() {
        List<Application> apps = applicationRepository.findAll();
        return apps.stream()
                .filter(a -> a.getAdmissionMethod() != null)
                .collect(Collectors.groupingBy(a -> a.getAdmissionMethod().getName(), Collectors.counting()))
                .entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    public Map<String, Long> getStatsByCampus() {
        List<Application> apps = applicationRepository.findAll();
        return apps.stream()
                .filter(a -> a.getCampus() != null)
                .collect(Collectors.groupingBy(a -> a.getCampus().getName(), Collectors.counting()))
                .entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }
}
