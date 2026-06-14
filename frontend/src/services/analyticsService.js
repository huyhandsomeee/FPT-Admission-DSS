import axiosClient from "../config/axiosConfig";

const analyticsService = {
  getOverviewMetrics: (year) => axiosClient.get("/api/v1/analytics/overview", { params: { year } }),
  getTrendChartData: (year) => axiosClient.get("/api/v1/analytics/trends", { params: { year } }),
  getMajorAnalysis: (year) => axiosClient.get("/api/v1/analytics/majors", { params: { year } }),
  getRegionalAnalysis: (year) => axiosClient.get("/api/v1/analytics/regions", { params: { year } }),
  getForecastData: () => axiosClient.get("/api/v1/analytics/forecast"),
  exportReport: (type, year) => axiosClient.get(`/api/v1/analytics/export/${type}`, { params: { year }, responseType: "blob" }),
};

export default analyticsService;
