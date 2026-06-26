import axiosClient from "../config/axiosConfig";

const admissionService = {
  // Configs
  getCampuses: () => axiosClient.get("/api/student/config/campuses"),
  getMajors: (campusId) => axiosClient.get(`/api/student/config/majors${campusId ? `?campusId=${campusId}` : ""}`),
  getAdmissionMethods: () => axiosClient.get("/api/student/config/methods"),
  getProvinces: () => axiosClient.get("/api/student/config/provinces"),

  // Student Profile
  getStudentProfile: () => axiosClient.get("/api/student/dashboard"),
  updateStudentProfile: (data) => axiosClient.put("/api/student/profile", data),

  // Application
  createApplication: (data) => axiosClient.post("/api/student/applications", data, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  getMyApplications: () => axiosClient.get("/api/student/applications"),
  getApplicationDetails: (id) => axiosClient.get(`/api/student/applications/${id}`),

  // Documents
  uploadDocument: (applicationId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(`/api/student/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Officer / Manager actions
  getAllApplications: (params) => axiosClient.get("/api/officer/applications", { params }),
  reviewApplication: (id, data) => axiosClient.patch(`/api/officer/applications/${id}/status`, data),
  verifyDocument: (docId, data) => axiosClient.post(`/api/officer/documents/${docId}/verify`, data),
};

export default admissionService;
