import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Search } from "lucide-react";

export default function FinanceScholarships() {
  const [selectedScholar, setSelectedScholar] = useState({
    name: "Trần Thị B",
    code: "IA150456",
    major: "CNTT",
    type: "Khuyến khích",
    rate: "50%",
    amount: "12.500.000đ",
    remaining: "12.500.000đ",
    status: "Chờ duyệt",
    gpa: 8.5,
    gpaReq: 8.0,
    conduct: "Khá",
    conductReq: "Tốt",
    discipline: "Không"
  });

  const scholarshipsData = [
    { name: "Nguyễn Văn A", code: "SE150123", major: "CNTT", type: "Tài năng", rate: "100%", amount: "25.000.000đ", remaining: "0đ", status: "Đủ điều kiện", gpa: 9.2, gpaReq: 8.5, conduct: "Tốt", conductReq: "Tốt", discipline: "Không" },
    { name: "Trần Thị B", code: "IA150456", major: "ATTT", type: "Khuyến khích", rate: "50%", amount: "12.500.000đ", remaining: "12.500.000đ", status: "Chờ duyệt", gpa: 8.5, gpaReq: 8.0, conduct: "Khá", conductReq: "Tốt", discipline: "Không" },
    { name: "Lê Hoàng C", code: "SS150789", major: "QTKD", type: "Hỗ trợ TC", rate: "—", amount: "10.000.000đ", remaining: "10.000.000đ", status: "Vi phạm", gpa: 7.2, gpaReq: 7.5, conduct: "Trung bình", conductReq: "Khá", discipline: "Cảnh cáo" },
    { name: "Phạm Thu Hằng", code: "GD170112", major: "Thiết kế số", type: "Tài năng", rate: "70%", amount: "17.500.000đ", remaining: "0đ", status: "Đủ điều kiện", gpa: 8.8, gpaReq: 8.0, conduct: "Tốt", conductReq: "Tốt", discipline: "Không" }
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Học bổng & Hỗ trợ Tài chính</h1>
      </div>

      {/* 3 KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Tổng Ngân Sách Cấp</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              🏛️
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>15.5 Tỷ</div>
          <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Học kỳ Spring 2026</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Đã Giải Ngân</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              💳
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>12.0 Tỷ</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: "77%", height: "100%", background: "#EA580C" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>77%</span>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Sinh Viên Nhận</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              👥
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>450</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>↑ +12% so với kỳ trước</div>
        </div>
      </div>

      {/* 2 Columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Left Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>Danh sách Cấp học bổng</span>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", fontSize: 12, fontWeight: 600 }}>Lọc</button>
              <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", fontSize: 12, fontWeight: 600 }}>Xuất Excel</button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>HỌ TÊN / MSSV</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>LOẠI HB</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>MỨC / SỐ TIỀN</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>CÒN LẠI</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {scholarshipsData.map((s, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedScholar(s)}
                  style={{ borderBottom: "1px solid #F1F5F9", cursor: "pointer", background: selectedScholar.code === s.code ? "#EFF6FF" : "#fff" }}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{s.name}</div>
                    <div style={{ fontSize: 11.5, color: "#64748B" }}>{s.code}</div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: s.type === "Tài năng" ? "#DBEAFE" : s.type === "Khuyến khích" ? "#FFEDD5" : "#F1F5F9", color: s.type === "Tài năng" ? "#1D4ED8" : s.type === "Khuyến khích" ? "#C2410C" : "#475569" }}>
                      {s.type}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{s.rate}</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>~{s.amount}</div>
                  </td>
                  <td style={{ padding: "12px 14px", color: s.remaining !== "0đ" ? "#DC2626" : "#16A34A", fontWeight: 700 }}>{s.remaining}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.status === "Đủ điều kiện" ? "#DCFCE7" : s.status === "Chờ duyệt" ? "#FEF3C7" : "#FEE2E2", color: s.status === "Đủ điều kiện" ? "#16A34A" : s.status === "Chờ duyệt" ? "#B45309" : "#DC2626" }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Detail Box */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, borderBottom: "1px solid #F1F5F9", paddingBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
              {selectedScholar.name.split(" ").pop()[0]}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>{selectedScholar.name}</h3>
              <div style={{ fontSize: 12, color: "#64748B" }}>{selectedScholar.code} • {selectedScholar.major}</div>
            </div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 10 }}>
            ĐIỀU KIỆN DUY TRÌ HỌC BỔNG
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>GPA Học kỳ trước</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Yêu cầu: &gt;= {selectedScholar.gpaReq}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: selectedScholar.gpa >= selectedScholar.gpaReq ? "#16A34A" : "#DC2626" }}>{selectedScholar.gpa}</span>
                {selectedScholar.gpa >= selectedScholar.gpaReq ? <CheckCircle size={16} color="#16A34A" /> : <XCircle size={16} color="#DC2626" />}
              </div>
            </div>

            <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Điểm rèn luyện</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Yêu cầu: {selectedScholar.conductReq}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: selectedScholar.conduct === "Tốt" ? "#16A34A" : "#D97706" }}>{selectedScholar.conduct}</span>
                {selectedScholar.conduct === "Tốt" ? <CheckCircle size={16} color="#16A34A" /> : <AlertTriangle size={16} color="#D97706" />}
              </div>
            </div>

            <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Kỷ luật</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Yêu cầu: Không có</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: selectedScholar.discipline === "Không" ? "#16A34A" : "#DC2626" }}>{selectedScholar.discipline}</span>
                {selectedScholar.discipline === "Không" ? <CheckCircle size={16} color="#16A34A" /> : <XCircle size={16} color="#DC2626" />}
              </div>
            </div>
          </div>

          {selectedScholar.conduct !== "Tốt" && (
            <div style={{ padding: "10px 12px", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A", fontSize: 12, color: "#92400E", marginBottom: 16 }}>
              ⚠️ Sinh viên không đạt chuẩn điểm rèn luyện. Cần xem xét giải trình từ Phòng CTSV.
            </div>
          )}

          <div style={{ fontSize: 12, fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8 }}>
            HÀNH ĐỘNG
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button style={{ padding: "11px", borderRadius: 8, background: "#10B981", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              💳 Duyệt Giải Ngân
            </button>
            <button style={{ padding: "10px", borderRadius: 8, background: "#fff", color: "#DC2626", border: "1.5px solid #DC2626", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              🚫 Thu hồi Học bổng
            </button>
            <div style={{ textAlign: "center", fontSize: 12, color: "#475569", cursor: "pointer", marginTop: 4 }}>
              Yêu cầu bổ sung thông tin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
