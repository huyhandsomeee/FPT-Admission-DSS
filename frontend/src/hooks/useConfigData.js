import { useState, useEffect, useCallback } from "react";
import api from "../config/axiosConfig";
import { PROVINCE_WIKI_MAPPING } from "../data/provinceWikiMapping";

export default function useConfigData() {
  const [campuses, setCampuses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [methods, setMethods] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [dbProvinces, setDbProvinces] = useState([]);
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/student/config/campuses").then(r => setCampuses(r.data)).catch(() => {}),
      api.get("/api/student/config/methods").then(r => {
        const rawMethods = r.data || [];
        const hocBa = rawMethods.find(m => m.code === 'HOC_BA') || { id: 1, code: 'HOC_BA' };
        const satIelts = rawMethods.find(m => m.code === 'SAT_IELTS') || { id: 4, code: 'SAT_IELTS' };
        setMethods([
          {
            ...hocBa,
            name: "Kết hợp kết quả kỳ thi tốt nghiệp THPT với kết quả học tập THPT",
            description: "Dành cho thí sinh có điểm thi tốt nghiệp THPT và học bạ/bảng điểm lớp 12."
          },
          {
            ...satIelts,
            name: "Xét tuyển thẳng / Ưu tiên xét tuyển",
            description: "Chọn phương thức xét tuyển thẳng phù hợp và upload giấy tờ minh chứng."
          }
        ]);
      }).catch(() => {}),
      api.get("/api/student/config/provinces").then(r => {
        setDbProvinces(r.data);
      }).catch(() => {}),
      fetch("https://provinces.open-api.vn/api/v2/p/")
        .then(r => r.json())
        .then(data => {
          const sorted = (data || []).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
          setProvinces(sorted);
        })
        .catch(() => {
          api.get("/api/student/config/provinces").then(r => setProvinces(r.data)).catch(() => {});
        })
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

  /**
   * Parse school names from Wikipedia HTML table structure.
   * The Wikipedia pages use wikitable format where the school name is in the 2nd column (<td>).
   * We extract text from: table rows with numbered first columns (STT column).
   */
  const parseSchoolsFromHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const schoolNames = [];

    // Get all wikitable tables
    const tables = doc.querySelectorAll('table.wikitable');

    tables.forEach(table => {
      const rows = table.querySelectorAll('tr');

      rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length < 2) return;

        // Skip header rows (colspan rows used as section headers like "Phường Ba Đình")
        const firstCell = cells[0];
        if (firstCell.getAttribute('colspan')) return;

        // The first cell should be a number (STT), and the second cell contains the school name
        const sttText = firstCell.textContent.trim();
        if (!/^\d+$/.test(sttText)) return;

        // Get the school name from the second cell
        const nameCell = cells[1];
        let schoolName = nameCell.textContent.trim();

        if (!schoolName) return;

        // Clean up the name: normalize "Trường THPT" → "THPT"
        schoolName = schoolName
          .replace(/\s+/g, ' ')  // collapse whitespace
          .replace(/^Trường Trung học phổ thông\s+/i, 'THPT ')
          .replace(/^Trường THPT\s+/i, 'THPT ')
          .replace(/^Trung học phổ thông\s+/i, 'THPT ')
          .trim();

        // Only include entries that look like high schools
        if (
          schoolName.startsWith('THPT') ||
          schoolName.toLowerCase().includes('thpt') ||
          schoolName.toLowerCase().includes('trung học phổ thông') ||
          schoolName.toLowerCase().includes('phổ thông')
        ) {
          schoolNames.push(schoolName);
        }
      });
    });

    // Also search in list items (<li>) as fallback for pages using list format
    if (schoolNames.length === 0) {
      doc.querySelectorAll('li a, td a').forEach(a => {
        const title = (a.getAttribute('title') || '').replace(/\s*\(trang chưa viết\)$/i, '').trim();
        const text = (a.textContent || '').trim();
        let name = title || text;

        if (
          name &&
          !name.includes(':') &&
          !name.includes('Danh sách') &&
          !name.startsWith('Wikipedia') &&
          !name.startsWith('Bách khoa') &&
          (
            name.startsWith('THPT') ||
            name.startsWith('Trường THPT') ||
            name.toLowerCase().startsWith('trung học phổ thông') ||
            name.toLowerCase().startsWith('trường trung học phổ thông')
          )
        ) {
          name = name
            .replace(/^Trường Trung học phổ thông\s+/i, 'THPT ')
            .replace(/^Trường THPT\s+/i, 'THPT ')
            .replace(/^Trung học phổ thông\s+/i, 'THPT ')
            .trim();
          if (name) schoolNames.push(name);
        }
      });
    }

    return [...new Set(schoolNames)];
  };

  /**
   * Fetch schools from Wikipedia for a given province.
   * Uses the new 34-province codename to look up which old province Wikipedia pages to fetch.
   * Falls back to DB schools if Wikipedia fails, or text input if no schools found at all.
   */
  const fetchSchools = useCallback(async (provinceId, provinceName, provinceCodename) => {
    if (!provinceName && !provinceId && !provinceCodename) {
      setSchools([]);
      return;
    }

    setSchoolsLoading(true);
    let dbSchoolsList = [];

    // 1. Fetch from database first (for seeded provinces)
    if (provinceId) {
      try {
        const res = await api.get(`/api/student/config/schools?provinceId=${provinceId}`);
        dbSchoolsList = res.data || [];
      } catch (e) {}
    }

    // 2. Look up old Wikipedia page names for this new province codename
    const wikiPageSuffixes = PROVINCE_WIKI_MAPPING[provinceCodename] || [];

    if (wikiPageSuffixes.length > 0) {
      try {
        // Fetch all old province pages in parallel
        const wikiResults = await Promise.all(
          wikiPageSuffixes.map(async (suffix) => {
            try {
              const pageTitle = `Danh sách trường trung học phổ thông tại ${suffix}`;
              const url = `https://vi.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${encodeURIComponent(pageTitle)}`;
              const response = await fetch(url);
              const data = await response.json();

              if (data && data.parse && data.parse.text) {
                return parseSchoolsFromHtml(data.parse.text['*']);
              }
            } catch (e) {}
            return [];
          })
        );

        // Flatten and deduplicate all wiki schools across all fetched pages
        const allWikiNames = [...new Set([].concat(...wikiResults))];

        // Merge: start with DB schools, add wiki schools not already in DB
        const merged = [...dbSchoolsList];
        allWikiNames.forEach(name => {
          if (!merged.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            merged.push({ id: `wiki-${name}`, name });
          }
        });

        const sorted = merged.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        setSchools(sorted);
        setSchoolsLoading(false);
        return;
      } catch (err) {
        console.error('Failed to fetch from Wikipedia:', err);
      }
    }

    // Fallback: use DB schools only (or empty → text input will show)
    setSchools(dbSchoolsList);
    setSchoolsLoading(false);
  }, []);

  return { campuses, majors, methods, provinces, dbProvinces, schools, loading, schoolsLoading, fetchMajors, fetchSchools };
}
