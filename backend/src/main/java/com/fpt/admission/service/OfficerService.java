package com.fpt.admission.service;

import com.fpt.admission.entity.Application;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.repository.ApplicationRepository;
import com.fpt.admission.repository.AdmissionYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfficerService {

    private final ApplicationRepository applicationRepository;
    private final AdmissionYearRepository admissionYearRepository;
    private final JdbcTemplate jdbcTemplate;

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

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
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

        // Compute funnel data
        long errorCount = 0;
        try {
            errorCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM validation_results WHERE status = 'ERROR'", Long.class);
        } catch (Exception e) {}
        long funnelValid = total - errorCount;

        long approvedCount = approved;
        long registeredCount = applicationRepository.countByStatus(ApplicationStatus.REGISTERED_MOET);
        long waitingCount = applicationRepository.countByStatus(ApplicationStatus.WAITING_MOET);
        long acceptedCount = applicationRepository.countByStatus(ApplicationStatus.ACCEPTED_MOET);
        long enrolledCount = enrolled;

        long funnelEligible = approvedCount + registeredCount + waitingCount + acceptedCount + enrolledCount;
        long funnelRegistered = registeredCount + waitingCount + acceptedCount + enrolledCount;
        long funnelWaiting = waitingCount + acceptedCount + enrolledCount;
        long funnelAccepted = acceptedCount + enrolledCount;

        Map<String, Object> funnel = new LinkedHashMap<>();
        funnel.put("total", total);
        funnel.put("valid", funnelValid);
        funnel.put("eligible", funnelEligible);
        funnel.put("registered", funnelRegistered);
        funnel.put("waiting", funnelWaiting);
        funnel.put("accepted", funnelAccepted);
        funnel.put("enrolled", enrolledCount);
        data.put("funnel", funnel);

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

    /**
     * Xu hướng hồ sơ theo ngày (N ngày gần nhất).
     * Trả về list [{date, count}] để vẽ chart thực tế từ DB.
     */
    public List<Map<String, Object>> getDailyTrend(int days) {
        LocalDateTime since = LocalDate.now().minusDays(days - 1).atStartOfDay();
        List<Object[]> rows = applicationRepository.countDailySubmissions(since);

        // Build map date -> count từ DB
        Map<String, Long> dbMap = new LinkedHashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (Object[] row : rows) {
            String day = row[0].toString().substring(0, 10);
            dbMap.put(day, ((Number) row[1]).longValue());
        }

        // Fill đủ N ngày (ngày không có hồ sơ = 0)
        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            String day = LocalDate.now().minusDays(i).format(fmt);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", day);
            entry.put("count", dbMap.getOrDefault(day, 0L));
            result.add(entry);
        }
        return result;
    }

    /**
     * Tỷ lệ chuyển đổi theo ngành: submitted -> approved+enrolled / total.
     * Dùng dữ liệu thực từ DB.
     */
    public Map<String, Object> getConversionRates() {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        Long yearId = activeYear != null ? activeYear.getId() : null;

        List<Application> apps = yearId != null
                ? applicationRepository.findAll().stream()
                    .filter(a -> a.getAdmissionYear() != null && a.getAdmissionYear().getId().equals(yearId))
                    .collect(Collectors.toList())
                : applicationRepository.findAll();

        // Group by major code
        Map<String, List<Application>> byMajor = apps.stream()
                .filter(a -> a.getMajor() != null)
                .collect(Collectors.groupingBy(a -> a.getMajor().getCode()));

        Map<String, Object> result = new LinkedHashMap<>();
        Map<String, String> majorNames = Map.of(
            "SE", "Kỹ thuật phần mềm", "AI", "Trí tuệ nhân tạo",
            "IS", "An toàn thông tin", "BA", "Quản trị kinh doanh",
            "GD", "Thiết kế đồ họa", "MC", "Truyền thông ĐPT",
            "FIN", "Tài chính", "HT", "Khách sạn & Du lịch", "MK", "Marketing"
        );

        List<Map<String, Object>> rates = byMajor.entrySet().stream()
            .map(e -> {
                long total = e.getValue().size();
                long converted = e.getValue().stream()
                    .filter(a -> a.getStatus() == ApplicationStatus.APPROVED
                              || a.getStatus() == ApplicationStatus.ENROLLED)
                    .count();
                double rate = total > 0 ? Math.round((double) converted / total * 1000.0) / 10.0 : 0.0;
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("code", e.getKey());
                m.put("name", majorNames.getOrDefault(e.getKey(), e.getKey()));
                m.put("total", total);
                m.put("converted", converted);
                m.put("rate", rate);
                return m;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("rate"), (Double) a.get("rate")))
            .collect(Collectors.toList());

        result.put("rates", rates);
        result.put("overallRate", apps.isEmpty() ? 0.0 :
            Math.round((double) apps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.APPROVED || a.getStatus() == ApplicationStatus.ENROLLED)
                .count() / apps.size() * 1000.0) / 10.0);
        return result;
    }

    /**
     * AI Prediction: dự báo tổng hồ sơ cuối kỳ dựa trên linear regression
     * từ dữ liệu daily trend 30 ngày gần nhất.
     * Model: y = a*x + b, dự báo thêm 30 ngày tới.
     */
    public Map<String, Object> getAIPrediction() {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        int quota = activeYear != null && activeYear.getQuotaTotal() != null ? activeYear.getQuotaTotal() : 18000;

        List<Map<String, Object>> trend30 = getDailyTrend(30);
        long totalNow = applicationRepository.count();

        // Calculate total submitted in last 30 days to establish historical baseline
        long totalIn30Days = 0;
        for (Map<String, Object> d : trend30) {
            totalIn30Days += ((Number) d.get("count")).longValue();
        }
        long baseTotal = totalNow - totalIn30Days;

        // Tính cumulative sum để linear regression
        List<Double> cumulative = new ArrayList<>();
        long cum = baseTotal;
        for (Map<String, Object> d : trend30) {
            cum += ((Number) d.get("count")).longValue();
            cumulative.add((double) cum);
        }

        // Linear regression: x = day index (1..30), y = cumulative
        int n = cumulative.size();
        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        for (int i = 0; i < n; i++) {
            double x = i + 1;
            double y = cumulative.get(i);
            sumX += x; sumY += y; sumXY += x * y; sumX2 += x * x;
        }
        double slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;
        double intercept = n > 0 ? (sumY - slope * sumX) / n : 0;

        // Dự báo 30 ngày tới (x = 31..60)
        double predictedAdditional = Math.max(0, slope * 30);
        long predictedTotal = totalNow + Math.round(predictedAdditional);
        double completionRate = quota > 0 ? Math.min(100.0, Math.round(predictedTotal * 100.0 / quota * 10) / 10.0) : 0;

        // Tính ngày dự kiến đạt 100% chỉ tiêu
        String targetDate = "Chưa xác định";
        if (slope > 0) {
            double daysNeeded = (quota - totalNow) / slope;
            if (daysNeeded > 0 && daysNeeded < 365) {
                targetDate = LocalDate.now().plusDays((long) daysNeeded)
                    .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            }
        }

        // Tính avg daily submissions (7 ngày gần nhất)
        List<Map<String, Object>> trend7 = getDailyTrend(7);
        double avgDaily7 = trend7.stream()
            .mapToLong(d -> ((Number) d.get("count")).longValue()).average().orElse(0);
        double avgDaily30 = trend30.stream()
            .mapToLong(d -> ((Number) d.get("count")).longValue()).average().orElse(0);
        double growthRate = avgDaily30 > 0 ? Math.round((avgDaily7 / avgDaily30 - 1) * 1000.0) / 10.0 : 0;

        // Calculate MSE and R-squared for model evaluation
        double ssRes = 0;
        double meanY = sumY / (n > 0 ? n : 1);
        double ssTot = 0;
        for (int i = 0; i < n; i++) {
            double x = i + 1;
            double y = cumulative.get(i);
            double predY = slope * x + intercept;
            ssRes += Math.pow(y - predY, 2);
            ssTot += Math.pow(y - meanY, 2);
        }
        double mse = n > 0 ? ssRes / n : 0;
        double r2 = ssTot > 0 ? 1 - (ssRes / ssTot) : 0;
        if (r2 < 0) r2 = 0;

        // Generate actual historical points
        List<Map<String, Object>> historicalPoints = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("day", i + 1);
            p.put("date", trend30.get(i).get("date"));
            p.put("actual", cumulative.get(i));
            p.put("predicted", Math.round(slope * (i + 1) + intercept));
            historicalPoints.add(p);
        }

        // Generate future predictions path (projected from current total)
        List<Map<String, Object>> forecastPoints = new ArrayList<>();
        double lastActual = cumulative.isEmpty() ? 0 : cumulative.get(n - 1);
        for (int i = 1; i <= 30; i++) {
            int futureDay = n + i;
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("day", futureDay);
            p.put("date", LocalDate.now().plusDays(i).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            p.put("predicted", Math.round(lastActual + slope * i));
            forecastPoints.add(p);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalNow", totalNow);
        result.put("predictedTotal", predictedTotal);
        result.put("quota", quota);
        result.put("completionRate", completionRate);
        result.put("targetDate", targetDate);
        result.put("avgDaily7", Math.round(avgDaily7 * 10.0) / 10.0);
        result.put("avgDaily30", Math.round(avgDaily30 * 10.0) / 10.0);
        result.put("growthRate", growthRate);
        result.put("slope", Math.round(slope * 100.0) / 100.0);
        result.put("mse", Math.round(mse * 100.0) / 100.0);
        result.put("r2", Math.round(r2 * 1000.0) / 1000.0);
        result.put("historicalPoints", historicalPoints);
        result.put("forecastPoints", forecastPoints);
        return result;
    }

    /**
     * Đánh giá tiềm năng: top hồ sơ có potential_score = gpa_10 + gpa_11 + gpa_12 cao nhất.
     * Chỉ lấy hồ sơ SUBMITTED hoặc UNDER_REVIEW.
     */
    public List<Map<String, Object>> getTopPotentialApplications(int limit) {
        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        Long yearId = activeYear != null ? activeYear.getId() : null;

        List<Application> candidates;
        try {
            candidates = yearId != null
                ? applicationRepository.findTopPotentialApplications(yearId, PageRequest.of(0, limit))
                : List.of();
        } catch (Exception e) {
            candidates = applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED
                          || a.getStatus() == ApplicationStatus.UNDER_REVIEW)
                .limit(limit)
                .collect(Collectors.toList());
        }

        return candidates.stream().map(app -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", app.getId());
            m.put("applicationCode", app.getApplicationCode());
            m.put("studentName", app.getStudentProfile() != null && app.getStudentProfile().getUser() != null
                ? app.getStudentProfile().getUser().getFullName() : "");
            m.put("majorName", app.getMajor() != null ? app.getMajor().getName() : "");
            m.put("majorCode", app.getMajor() != null ? app.getMajor().getCode() : "");
            m.put("status", app.getStatus().toString());
            m.put("totalScore", app.getTotalScore());

            var ab = app.getStudentProfile() != null ? app.getStudentProfile().getAcademicBackground() : null;
            double gpa10 = ab != null && ab.getGpa10() != null ? ab.getGpa10().doubleValue() : 0;
            double gpa11 = ab != null && ab.getGpa11() != null ? ab.getGpa11().doubleValue() : 0;
            double gpa12 = ab != null && ab.getGpa12() != null ? ab.getGpa12().doubleValue() : 0;
            double potentialScore = Math.round((gpa10 + gpa11 + gpa12) * 100.0) / 100.0;

            m.put("gpa10", gpa10);
            m.put("gpa11", gpa11);
            m.put("gpa12", gpa12);
            m.put("potentialScore", potentialScore);
            String level = potentialScore >= 27 ? "XUẤT SẮC" : potentialScore >= 24 ? "GIỎI" : potentialScore >= 21 ? "KHÁ" : "TRUNG BÌNH";
            m.put("potentialLevel", level);
            return m;
        }).collect(Collectors.toList());
    }

    /**
     * Gợi ý thông minh (AI Insights) dựa trên dữ liệu thực từ DB.
     * Phân tích xu hướng, cảnh báo, cơ hội.
     */
    public List<Map<String, Object>> getSmartSuggestions() {
        List<Map<String, Object>> suggestions = new ArrayList<>();

        // New Suggestion 1: Eligible but not confirmed MOET
        long eligibleButNoMoet = applicationRepository.countByStatus(ApplicationStatus.APPROVED);
        if (eligibleButNoMoet > 0) {
            suggestions.add(buildSuggestion(
                "warning",
                "Có " + eligibleButNoMoet + " sinh viên đủ điều kiện nhưng chưa xác nhận đăng ký nguyện vọng",
                "Cần đôn đốc thí sinh hoàn tất xác nhận đăng ký nguyện vọng trên Portal tuyển sinh FPT.",
                "Gửi Email nhắc nhở",
                "/officer/communication",
                "Nhiều thí sinh đã đạt điểm học bạ/chứng chỉ đủ điều kiện trúng tuyển nhưng chưa thực hiện thao tác xác nhận đã đăng ký nguyện vọng 1/2/3 trên Portal.",
                "Tác động: Đảm bảo tỷ lệ chuyển đổi từ trúng tuyển tạm thời sang chính thức đạt tối đa.",
                List.of(
                    "Gửi Email nhắc nhở tự động kèm hướng dẫn thao tác.",
                    "Gửi tin nhắn SMS tự động nhắc nhở thời hạn hoàn thành.",
                    "Gọi điện trực tiếp tư vấn/hỗ trợ đối với nhóm thí sinh tiềm năng cao."
                )
            ));
        }

        // New Suggestion 2: Confirmed MOET but not synced yet
        long moetConfirmedButNoSync = applicationRepository.countByStatus(ApplicationStatus.REGISTERED_MOET);
        if (moetConfirmedButNoSync > 0) {
            suggestions.add(buildSuggestion(
                "opportunity",
                "Có " + moetConfirmedButNoSync + " sinh viên đã xác nhận nhưng chưa được đồng bộ từ Bộ",
                "Tiến hành đồng bộ kết quả tuyển sinh từ Hệ thống Bộ GD&ĐT để công bố trúng tuyển chính thức.",
                "Đồng bộ Bộ GDĐT",
                "/officer/moet-results",
                "Hệ thống ghi nhận thí sinh đã chủ động xác nhận đăng ký nguyện vọng trên Portal, tuy nhiên dữ liệu tuyển sinh chính thức từ Bộ GD&ĐT chưa được đồng bộ vào hệ thống trường.",
                "Tác động: Chuyển đổi trạng thái hồ sơ sang Trúng tuyển chính thức.",
                List.of(
                    "Đồng bộ kết quả tự động qua API kết nối với Bộ GD&ĐT.",
                    "Import danh sách trúng tuyển từ file Excel kết quả lọc ảo của Bộ GD&ĐT.",
                    "Gửi email thông báo chờ kết quả cho nhóm thí sinh đã xác nhận."
                )
            ));
        }

        // New Suggestion 3: Admitted but not enrolled
        long admittedButNoEnroll = applicationRepository.countByStatus(ApplicationStatus.ACCEPTED_MOET);
        if (admittedButNoEnroll > 0) {
            suggestions.add(buildSuggestion(
                "action",
                "Có " + admittedButNoEnroll + " sinh viên đã trúng tuyển nhưng chưa xác nhận nhập học",
                "Hướng dẫn thí sinh thực hiện checklist nhập học trực tuyến và hoàn tất nghĩa vụ học phí.",
                "Gửi thông báo nhập học",
                "/officer/communication",
                "Thí sinh đã trúng tuyển chính thức sau lọc ảo nhưng chưa hoàn thành việc xác nhận nhập học trực tuyến hoặc nộp học phí.",
                "Tác động: Hoàn tất thủ tục hồ sơ nhập học, ổn định danh sách lớp.",
                List.of(
                    "Gửi Email thông báo trúng tuyển kèm giấy báo nhập học bản mềm.",
                    "Gửi SMS nhắc nhở hoàn thành nộp học phí trước hạn.",
                    "Gọi điện hướng dẫn quy trình xác nhận nhập học trực tuyến."
                )
            ));
        }

        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        int quota = activeYear != null && activeYear.getQuotaTotal() != null ? activeYear.getQuotaTotal() : 18000;

        long total = applicationRepository.count();
        long enrolled = applicationRepository.countByStatus(ApplicationStatus.ENROLLED);
        long underReview = applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW);
        long submitted = applicationRepository.countByStatus(ApplicationStatus.SUBMITTED);

        // Gợi ý 1: Tiến độ chỉ tiêu
        double progress = quota > 0 ? (double) enrolled / quota * 100 : 0;
        if (progress >= 90) {
            suggestions.add(buildSuggestion(
                "warning", 
                "⚠️ Gần đạt chỉ tiêu",
                String.format("Đã tuyển %.1f%% chỉ tiêu (%d/%d). Cân nhắc tạm dừng nhận hồ sơ mới.", progress, enrolled, quota),
                "Xem báo cáo chỉ tiêu", 
                "/officer/applicants?status=ENROLLED",
                "Hệ thống ghi nhận tỷ lệ nhập học đã đạt mức cao đột biến. Điều này phản ánh sức hút lớn của kỳ tuyển sinh nhưng cũng đặt ra bài toán về quá tải quy mô đào tạo và hạ tầng phòng học.",
                "Tác động: Đảm bảo kiểm soát chất lượng đầu vào, tối ưu hóa doanh thu học phí mà không vượt quá hạn mức tối đa của Bộ GD&ĐT.",
                List.of(
                    "Tạm thời khóa tính năng đăng ký mới cho các nhóm ngành đã quá tải (ví dụ: CNTT).",
                    "Nâng mức điểm xét tuyển học bạ tối thiểu lên 25.0 đối với các đợt bổ sung.",
                    "Gửi email thông báo khẩn cho các thí sinh đang ở trạng thái APPROVED nhanh chóng hoàn tất nộp học phí."
                )
            ));
        } else if (progress < 40) {
            suggestions.add(buildSuggestion(
                "opportunity", 
                "💡 Cần đẩy mạnh tuyển sinh",
                String.format("Mới đạt %.1f%% chỉ tiêu. Tăng cường chiến dịch marketing và tư vấn.", progress),
                "Xem hồ sơ đang chờ", 
                "/officer/applicants?status=SUBMITTED",
                "Tiến độ tuyển sinh năm nay đang chậm hơn so với cùng kỳ năm ngoái. Tỷ lệ chuyển đổi từ trạng thái Đã nộp sang Nhập học chỉ ở mức vừa phải.",
                "Tác động: Có thể cải thiện thêm lượng hồ sơ mới nộp và tăng tỷ lệ chuyển đổi trực tiếp lên 25%.",
                List.of(
                    "Tổ chức các buổi livestream tư vấn trực tuyến chuyên sâu theo từng nhóm ngành học trên Facebook/TikTok.",
                    "Gửi tin nhắn SMS/Zalo nhắc nhở các thí sinh ở trạng thái DRAFT hoàn thiện nộp học bạ lớp 12.",
                    "Mở rộng các gói học bổng khuyến học dành cho sinh viên hoàn tất hồ sơ và nhập học sớm."
                )
            ));
        }

        // Gợi ý 2: Hồ sơ tồn đọng
        if (underReview > 10) {
            suggestions.add(buildSuggestion(
                "action", 
                "🔍 Hồ sơ cần xét duyệt",
                String.format("%d hồ sơ đang chờ xét duyệt. Ưu tiên xử lý để tránh tồn đọng.", underReview),
                "Xét duyệt ngay", 
                "/officer/applicants?status=UNDER_REVIEW",
                "Số lượng hồ sơ ở trạng thái Đang xét duyệt đang tồn đọng. Việc chậm trễ xét duyệt tài liệu học bạ có thể làm giảm trải nghiệm của thí sinh, khiến họ chuyển sang nộp trường khác.",
                "Tác động: Phê duyệt nhanh chóng sẽ thúc đẩy tiến trình chuyển đổi sang trạng thái duyệt/nhập học.",
                List.of(
                    "Phân bổ thêm cán bộ rà soát tài liệu học bạ và thông tin căn cước công dân.",
                    "Ưu tiên phê duyệt các hồ sơ có tổng điểm GPA 10,11,12 đạt loại xuất sắc (>= 27.0).",
                    "Sử dụng công cụ thông báo tự động đối với các hồ sơ bị thiếu tài liệu hoặc sai lệch thông tin."
                )
            ));
        }
        if (submitted > 15) {
            suggestions.add(buildSuggestion(
                "action", 
                "📋 Hồ sơ mới chưa xem xét",
                String.format("%d hồ sơ vừa nộp chưa được xem xét. Phân công officer xử lý.", submitted),
                "Xem hồ sơ mới", 
                "/officer/applicants?status=SUBMITTED",
                "Có nhiều hồ sơ mới nộp chưa được cán bộ tuyển sinh mở ra xem xét lần đầu.",
                "Tác động: Giảm thời gian phản hồi ban đầu xuống dưới 24h, tăng tỷ lệ hài lòng của thí sinh.",
                List.of(
                    "Liên hệ cán bộ phụ trách khu vực để tiến hành bước thẩm định hồ sơ ban đầu.",
                    "Kiểm tra tính hợp lệ của các file tài liệu đính kèm (ảnh chụp học bạ, CCCD).",
                    "Chuyển trạng thái hồ sơ sang Đang xét duyệt (UNDER_REVIEW) và ghi chú các phần thiếu sót."
                )
            ));
        }

        // Gợi ý 3: Xu hướng tăng/giảm (so sánh 7 ngày vs 7 ngày trước)
        List<Map<String, Object>> trend14 = getDailyTrend(14);
        long week1 = trend14.subList(0, 7).stream().mapToLong(d -> ((Number) d.get("count")).longValue()).sum();
        long week2 = trend14.subList(7, 14).stream().mapToLong(d -> ((Number) d.get("count")).longValue()).sum();
        if (week2 > 0) {
            double change = (double)(week1 - week2) / week2 * 100;
            if (change > 15) {
                suggestions.add(buildSuggestion(
                    "trend", 
                    "📈 Xu hướng tăng mạnh",
                    String.format("Hồ sơ tuần này tăng %.0f%% so với tuần trước (%d vs %d). Chuẩn bị nhân lực xét duyệt.", change, week1, week2),
                    "Xem xu hướng", 
                    "/officer/dashboard",
                    "Lượng hồ sơ gửi lên tăng trưởng mạnh mẽ trong tuần này. Điều này phản ánh hiệu quả tích cực từ ngày hội tư vấn tuyển sinh vừa diễn ra.",
                    "Tác động: Dự báo sẽ tiếp tục tăng trưởng trong 5 ngày tới, cần tăng ca làm việc để tránh quá tải.",
                    List.of(
                        "Tăng ca trực hỗ trợ và giải đáp thắc mắc trực tuyến ngoài giờ hành chính.",
                        "Cập nhật báo cáo nhanh tiến độ nộp hồ sơ gửi Ban tuyển sinh vào mỗi buổi tối.",
                        "Bảo trì và giám sát hiệu năng hệ thống server đăng ký trực tuyến tránh sự cố nghẽn mạng."
                    )
                ));
            } else if (change < -15) {
                suggestions.add(buildSuggestion(
                    "warning", 
                    "📉 Xu hướng giảm",
                    String.format("Hồ sơ tuần này giảm %.0f%% so với tuần trước (%d vs %d). Cần tăng cường quảng bá.", Math.abs(change), week1, week2),
                    "Phân tích nguyên nhân", 
                    "/officer/dashboard",
                    "Lượng hồ sơ nộp mới ghi nhận sự sụt giảm đáng kể. Có thể do đợt thi thử THPT quốc gia đang diễn ra khiến thí sinh tập trung ôn thi.",
                    "Tác động: Ảnh hưởng trực tiếp đến chỉ tiêu tuyển sinh tuần tiếp theo.",
                    List.of(
                        "Lên kế hoạch gửi email bản tin tuyển sinh hữu ích, mẹo ôn thi THPT để duy trì tương tác.",
                        "Liên kết với các trường THPT đối tác để phát tờ rơi và giới thiệu trực tiếp.",
                        "Tối ưu lại các bài viết quảng cáo, hướng đúng tập đối tượng học sinh lớp 12."
                    )
                ));
            }
        }

        // Gợi ý 4: Ngành có tiềm năng cao
        Map<String, Long> byMajor = getStatsByMajor();
        if (!byMajor.isEmpty()) {
            byMajor.entrySet().stream()
                .filter(e -> e.getValue() > total * 0.25)
                .findFirst()
                .ifPresent(e -> suggestions.add(buildSuggestion(
                    "insight", 
                    "🎯 Ngành hot thu hút thí sinh",
                    String.format("Ngành %s chiếm %.0f%% tổng hồ sơ. Xem xét tăng chỉ tiêu hoặc điều kiện xét tuyển.",
                        e.getKey(), (double) e.getValue() / total * 100),
                    "Xem chi tiết ngành", 
                    "/officer/applicants?search=" + e.getKey(),
                    "Hệ thống ghi nhận sự tập trung hồ sơ cực lớn vào một số ngành học nhất định. Sự mất cân đối này có thể gây áp lực lên đội ngũ giảng viên chuyên ngành.",
                    "Tác động: Nâng cao chất lượng đầu vào của ngành mũi nhọn và điều phối nguồn lực giảng dạy hợp lý.",
                    List.of(
                        "Đề xuất Ban Giám hiệu nâng nhẹ tiêu chí học bạ hoặc ưu tiên tuyển chứng chỉ ngoại ngữ.",
                        "Tư vấn hướng thí sinh nộp nguyện vọng phụ sang các ngành học cận kề còn chỉ tiêu.",
                        "Làm việc với các doanh nghiệp đối tác để chuẩn bị các chương trình thực tập/đầu ra sớm."
                    )
                )));
        }

        if (suggestions.isEmpty()) {
            suggestions.add(buildSuggestion(
                "info", 
                "✅ Hệ thống hoạt động tốt",
                String.format("Tổng %d hồ sơ. Không có cảnh báo đặc biệt.", total),
                null, 
                null,
                "Mọi chỉ số tuyển sinh hiện tại đều nằm trong giới hạn kiểm soát an toàn. Tốc độ nộp hồ sơ ổn định.",
                "Tác động: Đảm bảo tiến độ hoàn thành chỉ tiêu kỳ tuyển sinh 2026.",
                List.of(
                    "Tiếp tục quy trình xét duyệt hồ sơ theo đúng tiến độ đề ra.",
                    "Duy trì kênh trực tuyến hỗ trợ giải đáp thắc mắc cho thí sinh 24/7.",
                    "Cập nhật định kỳ số liệu thống kê vào cuối mỗi tuần."
                )
            ));
        }

        // New Suggestion 1: Thí sinh chưa đăng ký nguyện vọng Bộ
        long eligibleNotRegistered = applicationRepository.countByStatus(ApplicationStatus.APPROVED);
        if (eligibleNotRegistered > 0) {
            suggestions.add(buildSuggestion(
                "opportunity",
                "📢 Thí sinh chưa đăng ký nguyện vọng Bộ",
                String.format("Có %d thí sinh đủ điều kiện nhưng chưa xác nhận đăng ký nguyện vọng trên cổng của Bộ GD&ĐT.", eligibleNotRegistered),
                "Gửi Email nhắc nhở",
                "/officer/communication?action=remind_moet",
                "Hệ thống ghi nhận số lượng lớn thí sinh đã được Đại học FPT phê duyệt đủ điều kiện trúng tuyển sơ bộ nhưng chưa thực hiện thao tác xác nhận đã đăng ký nguyện vọng trên cổng thông tin tuyển sinh của Bộ GD&ĐT.",
                "Tác động: Thúc đẩy thí sinh hoàn thành đúng thời hạn quy định, tránh việc thí sinh bị loại đáng tiếc do quên đăng ký nguyện vọng.",
                List.of(
                    "Gửi Email/SMS nhắc nhở tự động kèm hướng dẫn chi tiết các bước đăng ký nguyện vọng 1 mã trường FPT.",
                    "Tập trung nhân sự tư vấn viên liên hệ trực tiếp qua điện thoại để hỗ trợ thí sinh thao tác nhanh chóng.",
                    "Đăng tải thông tin lưu ý quan trọng về thời hạn đăng ký trên các kênh truyền thông chính thức."
                )
            ));
        }

        // New Suggestion 2: Thí sinh trúng tuyển nguyện vọng phụ nhưng điểm cực cao
        long highGpaMoetN2 = 0;
        try {
            highGpaMoetN2 = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM moet_results WHERE choice > 1 AND result = 'PASS'", Long.class);
        } catch (Exception ignored) {}

        if (highGpaMoetN2 > 0) {
            suggestions.add(buildSuggestion(
                "opportunity",
                "💡 Tối ưu hóa nguyện vọng trúng tuyển",
                String.format("Có %d thí sinh đủ điểm xét tuyển NV1 nhưng đang đặt FPT ở Nguyện vọng 2 hoặc thấp hơn.", highGpaMoetN2),
                "Liên hệ tư vấn",
                "/officer/communication",
                "Có một nhóm thí sinh có kết quả học tập xuất sắc (đủ điều kiện trúng tuyển các ngành hot) nhưng hiện tại đang đặt Đại học FPT ở thứ tự ưu tiên sau (Nguyện vọng 2 trở đi) trên cổng của Bộ GD&ĐT.",
                "Tác động: Tư vấn kịp thời có thể giúp thí sinh hiểu rõ cơ hội nghề nghiệp để chuyển đổi sang Nguyện vọng 1 trước ngày khóa cổng Bộ.",
                List.of(
                    "Phân công tư vấn viên gọi điện hỏi thăm và tìm hiểu nguyện vọng thực tế của thí sinh.",
                    "Tư vấn về các chính sách học bổng, ưu đãi nhập học sớm nếu thí sinh đặt nguyện vọng 1 vào FPT.",
                    "Gửi tài liệu giới thiệu môi trường học tập và cơ hội việc làm sau tốt nghiệp cho phụ huynh."
                )
            ));
        }

        return suggestions;
    }

    private Map<String, Object> buildSuggestion(
            String type, String title, String message, String actionLabel, String actionUrl,
            String details, String impact, List<String> recommendations) {
        Map<String, Object> s = new LinkedHashMap<>();
        s.put("type", type);
        s.put("title", title);
        s.put("message", message);
        s.put("actionLabel", actionLabel);
        s.put("actionUrl", actionUrl);
        s.put("details", details);
        s.put("impact", impact);
        s.put("recommendations", recommendations);
        return s;
    }
}
