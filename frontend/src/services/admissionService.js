import axiosClient from "../config/axiosConfig";

const admissionService = {
  // Configs
  getCampuses: () => axiosClient.get("/api/v1/config/campuses"),
  getMajors: () => axiosClient.get("/api/v1/config/majors"),
  getAdmissionMethods: () => axiosClient.get("/api/v1/config/methods"),
  getProvinces: () => axiosClient.get("/api/v1/config/provinces"),

  // Student Profile
  getStudentProfile: () => axiosClient.get("/api/v1/student/profile"),
  updateStudentProfile: (data) => axiosClient.put("/api/v1/student/profile", data),

  // Application
  createApplication: (data) => axiosClient.post("/api/v1/student/applications", data),
  getMyApplications: () => axiosClient.get("/api/v1/student/applications"),
  getApplicationDetails: (id) => axiosClient.get(`/api/v1/student/applications/${id}`),

  // Documents
  uploadDocument: (applicationId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post(`/api/v1/student/applications/${applicationId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Officer / Manager actions
  getAllApplications: (params) => axiosClient.get("/api/v1/officer/applications", { params }),
  reviewApplication: (id, data) => axiosClient.post(`/api/v1/officer/applications/${id}/review`, data),
  verifyDocument: (docId, data) => axiosClient.post(`/api/v1/officer/documents/${docId}/verify`, data),
};

export default admissionService;
