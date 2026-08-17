import { useState } from "react";
import { Database, Search, Table2, Layers, Key, FileText, Tag, Filter, CheckCircle2 } from "lucide-react";

const CATALOG_TABLES = [
  {
    name: "FACT_ADMISSION",
    type: "Fact Table",
    domain: "Tuyển Sinh",
    owner: "Phòng Tuyển Sinh",
    columns: [
      { name: "admission_fact_key", type: "BIGINT", isKey: true, desc: "Khóa chính surrogate" },
      { name: "student_key", type: "BIGINT", isKey: false, desc: "FK đến DIM_STUDENT" },
      { name: "program_key", type: "INT", isKey: false, desc: "FK đến DIM_PROGRAM" },
      { name: "campus_key", type: "INT", isKey: false, desc: "FK đến DIM_CAMPUS" },
      { name: "total_score", type: "DECIMAL(5,2)", isKey: false, desc: "Tổng điểm xét tuyển" },
      { name: "offer_result", type: "VARCHAR(20)", isKey: false, desc: "Kết quả trúng tuyển" }
    ]
  },
  {
    name: "FACT_LEARNING",
    type: "Fact Table",
    domain: "Học Vụ & Đào Tạo",
    owner: "Phòng Đào Tạo",
    columns: [
      { name: "learning_fact_key", type: "BIGINT", isKey: true, desc: "Khóa chính surrogate" },
      { name: "student_key", type: "BIGINT", isKey: false, desc: "FK đến DIM_STUDENT" },
      { name: "course_key", type: "INT", isKey: false, desc: "FK đến DIM_COURSE" },
      { name: "gpa", type: "DECIMAL(3,2)", isKey: false, desc: "Điểm trung bình học phần" },
      { name: "credit_earned", type: "INT", isKey: false, desc: "Số tín chỉ tích lũy" }
    ]
  },
  {
    name: "DIM_STUDENT",
    type: "Dimension Table",
    domain: "Master Data",
    owner: "Phòng CTSV",
    columns: [
      { name: "student_key", type: "BIGINT", isKey: true, desc: "Khóa chính surrogate" },
      { name: "student_code", type: "VARCHAR(20)", isKey: false, desc: "Mã số sinh viên (HS17xxxx)" },
      { name: "citizen_id", type: "VARCHAR(12)", isKey: false, desc: "Số CCCD/Định danh (PII)" },
      { name: "full_name", type: "VARCHAR(100)", isKey: false, desc: "Họ và tên sinh viên" },
      { name: "email", type: "VARCHAR(100)", isKey: false, desc: "Email trường (@fpt.edu.vn)" }
    ]
  }
];

export default function DataCatalog() {
  const [search, setSearch] = useState("");
  const [selectedTable, setSelectedTable] = useState(CATALOG_TABLES[0]);

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>Data Catalog & Từ Điển Dữ Liệu (Metadata)</h1>
          <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>Tra cứu danh mục bảng, cấu trúc schema, định nghĩa trường dữ liệu & chính sách bảo mật PII</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "start" }}>
        {/* Table list */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              placeholder="Tìm kiếm bảng dữ liệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CATALOG_TABLES.map((t, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTable(t)}
                style={{
                  padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                  background: selectedTable.name === t.name ? "#EFF6FF" : "#F8FAFC",
                  border: `1.5px solid ${selectedTable.name === t.name ? "#2563EB" : "#E2E8F0"}`,
                  transition: "all 0.2s"
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{t.name}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12, color: "#64748B" }}>
                  <span>{t.type}</span>
                  <span style={{ fontWeight: 600, color: "#2563EB" }}>{t.domain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Schema Detail */}
        <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", fontFamily: "monospace", margin: 0 }}>{selectedTable.name}</h2>
              <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: "#DBEAFE", color: "#1D4ED8" }}>{selectedTable.type}</span>
            </div>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>Chủ sở hữu dữ liệu (Data Owner): <strong>{selectedTable.owner}</strong> • Miền: <strong>{selectedTable.domain}</strong></p>
          </div>

          <div style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 14px 0" }}>Danh Sách Cột & Kiểu Dữ Liệu</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>TÊN TRƯỜNG</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>KIỂU DỮ LIỆU</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>KHÓA</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>MÔ TẢ NGHIỆP VỤ</th>
                </tr>
              </thead>
              <tbody>
                {selectedTable.columns.map((col, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: 700, color: "#0F172A" }}>{col.name}</td>
                    <td style={{ padding: "14px 16px", color: "#2563EB", fontWeight: 600 }}>{col.type}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {col.isKey && <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 800, background: "#FEF3C7", color: "#B45309" }}>PK</span>}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#475569" }}>{col.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
