import { useState, useEffect, useCallback } from "react";
import api from "../config/axiosConfig";

export default function useConfigData() {
  const [campuses, setCampuses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [methods, setMethods] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/student/config/campuses").then(r => setCampuses(r.data)).catch(() => {}),
      api.get("/api/student/config/methods").then(r => setMethods(r.data.filter(m => m.code !== 'THPT'))).catch(() => {}),
      api.get("/api/student/config/provinces").then(r => setProvinces(r.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const fetchMajors = useCallback((campusId) => {
    if (campusId) {
      api.get(`/api/student/config/majors?campusId=${campusId}`)
        .then(r => setMajors(r.data))
        .catch(() => setMajors([]));
    } else {
      setMajors([]);
    }
  }, []);

  const fetchSchools = useCallback((provinceId) => {
    if (provinceId) {
      api.get(`/api/student/config/schools?provinceId=${provinceId}`)
        .then(r => setSchools(r.data))
        .catch(() => setSchools([]));
    } else {
      setSchools([]);
    }
  }, []);

  return { campuses, majors, methods, provinces, schools, loading, fetchMajors, fetchSchools };
}
