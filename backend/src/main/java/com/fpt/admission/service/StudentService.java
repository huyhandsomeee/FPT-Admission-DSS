package com.fpt.admission.service;

import com.fpt.admission.dto.response.DashboardResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface StudentService {
    DashboardResponse getDashboard(Long userId);
    List<Map<String, Object>> getMyApplications(Long userId);
    Map<String, Object> createApplication(
            Long userId, String fullName, String dob, String gender,
            String phone, String cccd, String permanentAddress, Long provinceId,
            String parentName, String parentPhone, String schoolName, int graduationYear,
            double mathScore, double literatureScore, double englishScore,
            double gpa10, double gpa11, double gpa12,
            Long campusId, Long majorId, Long methodId,
            MultipartFile cccdFile, MultipartFile hocBaFile, MultipartFile bangTNFile,
            MultipartFile anhTheFile, MultipartFile giayKhaiSinhFile,
            MultipartFile chungChiFile, MultipartFile hoKhauFile);
    Map<String, Object> getApplicationDetails(Long id, Long userId);
    Map<String, Object> submitApplication(Long id);
    Map<String, Object> requestNewApplication(Long userId);
    Map<String, Object> markNotificationAsRead(Long id);
    Map<String, Object> markAllNotificationsAsRead(Long userId);
    Map<String, Object> getNotifications(Long userId, int page, int size);
    List<Map<String, Object>> getUploadedDocuments(Long userId);
    Map<String, Object> uploadOrReplaceDocument(Long userId, MultipartFile file, String typeCode);
}
