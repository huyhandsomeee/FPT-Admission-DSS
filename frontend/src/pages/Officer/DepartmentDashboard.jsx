import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Users, CheckCircle2, Clock, BarChart3, TrendingUp,
  Award, ShieldCheck, FileCheck, ArrowRight, Download, Filter,
  Layers, AlertTriangle, Calendar, Send, Sparkles, CheckSquare
} from "lucide-react";

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState("PHONG_DAO_TAO");

  const depts = {
    PHONG_DAO_TAO: {
      name: "Phòng Quản Lý Đào Tạo & Khảo Thí",
      manager: "TS. Trần Quốc Tuấn (Trưởng Phòng)",
      staffCount: 18,
      kpis: [
        { label: "Tiến độ chuẩn hóa điểm học kỳ SU25", val: "98.4%", target: "100%", color: "#16A34A", bg: "#F0FDF4" },
        { label: "Báo cáo học vụ chờ Trưởng phòng duyệt", val: "4 Báo cáo", target: "Hạn 18/08", color: "#D97706", bg: "#FFFBEB" },
        { label: "Sinh viên hoàn thành chỉ tiêu tín chỉ", val: "89.2%", target: "+4.2% YoY", color: "#2563EB", bg: "#EFF6FF" },
        { label: "Độ chính xác dữ liệu đẩy DWH", val: "99.8%", target: "FACT_LEARNING", color: "#7C3AED", bg: "#F5F3FF" }
      ],
      pendingApprovals: [
        { id: "APPR-DT-01", title: "Phê duyệt danh sách 148 sinh viên nhận học bổng Khuyến khích học tập Fall 2026", submitter: "ThS. Hoàng Minh Đức", time: "30 phút trước", type: "Học bổng" },
        { id: "APPR-DT-02", title: "Duyệt thời khóa biểu & mở bổ sung 12 lớp học phần chuyên ngành AI / Cloud", submitter: "Nguyễn Thị Mai (Chuyên viên)", time: "1 giờ trước", type: "Xếp lớp" },
        { id: "APPR-DT-03", title: "Phê duyệt biên bản chấm phúc khảo 19 bài thi học phần Toán kỹ thuật", submitter: "Tổ Khảo Thí", time: "3 giờ trước", type: "Khảo thí" }
      ],
      staffPerformance: [
        { name: "ThS. Hoàng Minh Đức", role: "Chuyên viên Khảo thí", completedTasks: 42, sla: "99.2%", rating: "Xuất sắc" },
        { name: "Nguyễn Thị Mai", role: "Chuyên viên Học vụ", completedTasks: 38, sla: "97.5%", rating: "Tốt" },
        { name: "Lê Văn Tùng", role: "Quản trị Hệ thống FAP", completedTasks: 29, sla: "98.0%", rating: "Tốt" }
      ]
    },
    PHONG_TUYEN_SINH: {
      name: "Phòng Tuyển Sinh & Hướng Nghiệp",
      manager: "ThS. Đỗ Thị Thu Trang (Trưởng Ban)",
      staffCount: 24,
      kpis: [
        { label: "Tổng chỉ tiêu đã đạt toàn quốc", val: "96.5%", target: "Chỉ tiêu 22.000 SV", color: "#16A34A", bg: "#F0FDF4" },
        { label: "Hồ sơ xét tuyển chờ phê duyệt", val: "148 Hồ sơ", target: "Đợt 2 THPT", color: "#D97706", bg: "#FFFBEB" },
        { label: "Doanh thu lệ phí & nhập học", val: "38.5 Tỷ", target: "+15.8% YoY", color: "#2563EB", bg: "#EFF6FF" },
        { label: "Tỷ lệ xác nhận nhập học chính thức", val: "88.4%", target: "FACT_ADMISSION", color: "#7C3AED", bg: "#F5F3FF" }
      ],
      pendingApprovals: [
        { id: "APPR-TS-01", title: "Phê duyệt danh sách trúng tuyển đợt 2 theo phương thức ĐGNL ĐHQG (320 thí sinh)", submitter: "Tổ Thẩm định hồ sơ", time: "15 phút trước", type: "Tuyển sinh" },
        { id: "APPR-TS-02", title: "Duyệt cấp 50 suất học bổng FPT Talent cho thí sinh giải Quốc gia", submitter: "Tổ Học bổng", time: "45 phút trước", type: "Học bổng" }
      ],
      staffPerformance: [
        { name: "Phạm Văn Long", role: "Tư vấn viên Trưởng", completedTasks: 85, sla: "99.5%", rating: "Xuất sắc" },
        { name: "Trần Thị Thu", role: "Thẩm định hồ sơ", completedTasks: 76, sla: "98.2%", rating: "Tốt" }
      ]
    }
  };

  const current = depts[selectedDept];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* ── Top Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(124,58,237,0.3)"
          }}>
            <ShieldCheck size={26} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Bảng Điều Hành Trưởng Phòng Ban</h1>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE" }}>
                Cấp Quản Lý Khoa / Phòng
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>
              Trưởng đơn vị: <strong>{current.manager}</strong> • {current.name} ({current.staffCount} Cán bộ)
            </p>
          </div>
        </div>

        {/* Dept Selector */}
        <div style={{ display: "flex", gap: 8, background: "#F1F5F9", padding: 4, borderRadius: 12 }}>
          {[
            { key: "PHONG_DAO_TAO", label: "📚 Phòng Đào Tạo & Khảo Thí" },
            { key: "PHONG_TUYEN_SINH", label: "🏢 Phòng Tuyển Sinh & HN" }
          ].map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDept(d.key)}
              style={{
                padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                background: selectedDept === d.key ? "#fff" : "transparent",
                color: selectedDept === d.key ? "#7C3AED" : "#64748B",
                boxShadow: selectedDept === d.key ? "0 2px 6px rgba(0,0,0,0.08)" : "none"
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 28 }}>
        {current.kpis.map((kpi, idx) => (
          <div key={idx} style={{ background: kpi.bg, borderRadius: 18, padding: "20px 22px", border: `1.5px solid ${kpi.color}25` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>{kpi.val}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: kpi.color, marginTop: 6 }}>Mục tiêu: {kpi.target}</div>
          </div>
        ))}
      </div>

      {/* ── Approvals & Staff Performance ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Approvals */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Tờ Trình & Báo Cáo Chờ Trưởng Phòng Phê Duyệt</h3>
              <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>Phê duyệt trước khi đồng bộ dữ liệu vào Data Warehouse</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#D97706", background: "#FEF3C7", padding: "4px 10px", borderRadius: 100 }}>
              {current.pendingApprovals.length} Yêu cầu
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {current.pendingApprovals.map((appr, idx) => (
              <div key={idx} style={{ padding: "16px 18px", borderRadius: 14, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#7C3AED", background: "#F5F3FF", padding: "2px 8px", borderRadius: 6, marginRight: 8 }}>
                      {appr.id}
                    </span>
                    <strong style={{ fontSize: 14, color: "#0F172A" }}>{appr.title}</strong>
                  </div>
                  <span style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap" }}>{appr.time}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Người trình: <strong>{appr.submitter}</strong></span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "6px 12px", borderRadius: 8, background: "#16A34A", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      ✓ Phê Duyệt
                    </button>
                    <button style={{ padding: "6px 12px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "1px solid #E2E8F0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance & SLA */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0" }}>Hiệu Suất & Tiến Độ Của Cán Bộ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {current.staffPerformance.map((st, idx) => (
                <div key={idx} style={{ padding: "12px 14px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <strong style={{ fontSize: 13.5, color: "#0F172A" }}>{st.name}</strong>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#16A34A" }}>SLA: {st.sla}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#64748B" }}>
                    <span>{st.role}</span>
                    <span>Đã xử lý: <strong>{st.completedTasks} tác vụ</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)", borderRadius: 20, padding: 22, color: "#fff" }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px 0" }}>Chất Lượng Dữ Liệu Phòng Ban</h4>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", margin: "0 0 12px 0", lineHeight: 1.5 }}>
              Dữ liệu của phòng ban đạt điểm chuẩn hóa <strong>99.8%</strong>, sẵn sàng phục vụ báo cáo cho Ban Giám Đốc và tích hợp cổng dữ liệu mở.
            </p>
            <button
              onClick={() => navigate("/officer/academic-reports")}
              style={{ padding: "8px 14px", borderRadius: 8, background: "#fff", color: "#7C3AED", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
            >
              Mở Báo Cáo Học Vụ Chi Tiết →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
