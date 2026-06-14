import axiosClient from "../config/axiosConfig";

const adminService = {
  // Users
  getAllUsers: (params) => axiosClient.get("/api/v1/admin/users", { params }),
  createUser: (data) => axiosClient.post("/api/v1/admin/users", data),
  updateUserStatus: (id, status) => axiosClient.patch(`/api/v1/admin/users/${id}/status`, { status }),

  // System Configuration
  getSystemConfig: () => axiosClient.get("/api/v1/admin/config"),
  updateSystemConfig: (data) => axiosClient.put("/api/v1/admin/config", data),

  // Campuses / Majors / Methods
  updateCampus: (id, data) => axiosClient.put(`/api/v1/admin/campuses/${id}`, data),
  updateMajor: (id, data) => axiosClient.put(`/api/v1/admin/majors/${id}`, data),
  updateMethod: (id, data) => axiosClient.put(`/api/v1/admin/methods/${id}`, data),

  // Audit Logs
  getAuditLogs: (params) => axiosClient.get("/api/v1/admin/audit-logs", { params }),
};

export default adminService;
