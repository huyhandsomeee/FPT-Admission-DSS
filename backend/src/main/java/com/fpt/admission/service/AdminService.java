package com.fpt.admission.service;

import java.util.List;
import java.util.Map;

public interface AdminService {
    Map<String, Object> getDashboard();
    Map<String, Object> getUsers(int page, int size, String search);
    Map<String, Object> createUser(String email, String password, String fullName, String phone, String role);
    Map<String, Object> updateUser(Long id, Map<String, Object> updates);
    Map<String, Object> deleteUser(Long id);
    Map<String, Object> getAuditLogs(int page, int size);
    List<?> getCampuses();
    List<?> getMajors();
    List<?> getAdmissionYears();
    List<?> getAdmissionMethods();
}
