import { useState } from "react";
import { Mail, Download, Search, Filter, AlertTriangle } from "lucide-react";

export default function FinanceTuition() {
  const [tuitionYear, setTuitionYear] = useState("2026 - 2027");
  const [tuitionTerm, setTuitionTerm] = useState("Fall 2026");
  const [tuitionType, setTuitionType] = useState("Tất cả");
  const [tuitionStatus, setTuitionStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  const tuitionDebts = [
    { id: "DEBT-01", name: "Nguyễn Văn A", code: "HE150123", amount: "25,500,000", deadline: "15/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" },
    { id: "DEBT-02", name: "Trần Thị B", code: "SS160456", amount: "12,000,000", deadline: "20/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-03", name: "Lê Văn C", code: "SE170789", amount: "5,500,000", deadline: "30/09/2026", status: "Chờ xử lý", color: "#D97706", bg: "#FEF3C7" },
    { id: "DEBT-04", name: "Hoàng Minh D", code: "SE180234", amount: "18,200,000", deadline: "25/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-05", name: "Đỗ Thu E", code: "GD170990", amount: "29,700,000", deadline: "10/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" },
    { id: "DEBT-06", name: "Phạm Quốc Hưng", code: "AI160112", amount: "14,500,000", deadline: "28/09/2026", status: "Chờ xử lý", color: "#D97706", bg: "#FEF3C7" }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Công nợ Học phí</h1>
          <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Theo dõi và xử lý các khoản nợ học phí của sinh viên</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <Mail size={15} /> Gửi Email Nhắc nợ
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <Download size={15} /> Xuất Danh sách
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>NĂM HỌC</label>
            <select value={tuitionYear} onChange={e => setTuitionYear(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
              <option>2026 - 2027</option>
              <option>2025 - 2026</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>KỲ HỌC</label>
            <select value={tuitionTerm} onChange={e => setTuitionTerm(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
              <option>Fall 2026</option>
              <option>Summer 2026</option>
              <option>Spring 2026</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>LOẠI PHÍ</label>
            <select value={tuitionType} onChange={e => setTuitionType(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
              <option>Tất cả</option>
              <option>Học phí chính khóa</option>
              <option>Phí ký túc xá</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>TRẠNG THÁI</label>
            <select value={tuitionStatus} onChange={e => setTuitionStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
              <option value="ALL">Tất cả trạng thái</option>
              <option value="OVERDUE">Quá hạn</option>
              <option value="REMINDED">Đã nhắc nợ</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "transparent", color: "#64748B", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
            Xóa bộ lọc
          </button>
          <button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#9A3412", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
            Áp dụng
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "12px 18px", width: 40 }}><input type="checkbox" /></th>
              <th style={{ padding: "12px 18px", fontWeight: 700 }}>MSSV / SINH VIÊN</th>
              <th style={{ padding: "12px 18px", fontWeight: 700 }}>TỔNG NỢ (VND)</th>
              <th style={{ padding: "12px 18px", fontWeight: 700 }}>HẠN CHÓT</th>
              <th style={{ padding: "12px 18px", fontWeight: 700 }}>TRẠNG THÁI</th>
              <th style={{ padding: "12px 18px", fontWeight: 700 }}>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {tuitionDebts.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "14px 18px" }}><input type="checkbox" /></td>
                <td style={{ padding: "14px 18px" }}>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{item.name}</div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>{item.code}</div>
                </td>
                <td style={{ padding: "14px 18px", fontWeight: 800, color: "#DC2626" }}>{item.amount}</td>
                <td style={{ padding: "14px 18px", color: "#475569" }}>{item.deadline}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: item.bg, color: item.color }}>
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: "14px 18px" }}>
                  <button style={{ padding: "5px 12px", borderRadius: 6, background: "#EFF6FF", color: "#2563EB", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    Nhắc nợ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", fontSize: 12.5, color: "#64748B" }}>
          <span>Hiển thị 1-6 trong số 124 sinh viên</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#9A3412", color: "#fff", fontWeight: 700 }}>1</button>
            <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff" }}>2</button>
            <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff" }}>3</button>
          </div>
        </div>
      </div>
    </div>
  );
}
