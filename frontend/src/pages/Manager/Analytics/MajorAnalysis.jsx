import { useState, useEffect } from "react";
import { ArrowUpRight, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import api from "../../../config/axiosConfig";

const MAJOR_DATA = [
  { name: "Kỹ thuật phần mềm", count: 3500, quota: 5100, rate: "76%", isTop: true },
  { name: "Quản trị kinh doanh", count: 2800, quota: 4000, rate: "71%" },
  { name: "Trí tuệ nhân tạo", count: 1500, quota: 1300, rate: "82%" },
  { name: "Thiết kế đồ họa", count: 820, quota: 900, rate: "68%" },
  { name: "Digital Marketing", count: 750, quota: 800, rate: "70%" },
  { name: "Tài chính - Ngân hàng", count: 620, quota: 700, rate: "65%" },
  { name: "Truyền thông đa phương tiện", count: 550, quota: 600, rate: "68%" },
  { name: "Quản trị khách sạn", count: 350, quota: 400, rate: "72%" },
  { name: "An toàn thông tin", count: 250, quota: 300, rate: "78%" },
];

export default function MajorAnalysis() {
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    api.get("/api/manager/analytics/by-major")
      .then(r => {
        if (Array.isArray(r.data) && r.data.length > 0) {
          setMajors(r.data);
        }
      })
      .catch(err => console.error("Lỗi lấy dữ liệu ngành học:", err));
  }, []);

  const rawData = majors.length > 0 ? majors : MAJOR_DATA;

  // Process data to align with quotas and compute statuses
  const displayData = rawData.map((item, i) => {
    const quota = item.quota || (item.name === "Kỹ thuật phần mềm" ? 5100 : item.name === "Trí tuệ nhân tạo" ? 1300 : item.name === "Quản trị kinh doanh" ? 4000 : 2000);
    const count = item.count || 0;
    const difference = item.difference !== undefined ? item.difference : (count - quota);
    const status = item.status || (difference > 0 ? "SURPLUS" : (difference < 0 ? "DEFICIT" : "BALANCED"));
    
    return {
      name: item.name,
      count,
      quota,
      difference,
      status,
      rate: item.rate || (count > 0 ? `${Math.round(70 + Math.random() * 20)}%` : "0%"),
      isTop: i === 0
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>Phân tích theo ngành</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
          Giám sát chỉ tiêu tuyển sinh thực tế, phân loại các ngành đang thừa hoặc thiếu chỉ tiêu trong năm 2026.
        </p>
      </div>

      {/* Horizontal bar chart */}
      <div style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>So sánh Hồ sơ & Chỉ tiêu</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(90deg, #10B981, #059669)" }} />
              <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Thừa chỉ tiêu (Surplus)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: "linear-gradient(90deg, #FF6B35, #E85A2A)" }} />
              <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Thiếu chỉ tiêu (Deficit)</span>
            </div>
          </div>
        </div>

        {/* Custom horizontal bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {displayData.map((major, i) => {
            const progressPct = Math.min((major.count / major.quota) * 100, 100);
            
            let statusColor = "#E85A2A";
            let statusBg = "#FFF7ED";
            let statusBorder = "#FFD8A8";
            let icon = <TrendingDown size={12} />;
            let statusText = `Thiếu ${Math.abs(major.difference).toLocaleString()} chỉ tiêu`;

            if (major.status === "SURPLUS") {
              statusColor = "#10B981";
              statusBg = "#ECFDF5";
              statusBorder = "#A7F3D0";
              icon = <TrendingUp size={12} />;
              statusText = `Thừa ${Math.abs(major.difference).toLocaleString()} chỉ tiêu`;
            } else if (major.status === "BALANCED") {
              statusColor = "#3B82F6";
              statusBg = "#EFF6FF";
              statusBorder = "#BFDBFE";
              icon = <CheckCircle size={12} />;
              statusText = "Đạt chỉ tiêu";
            }

            return (
              <div key={major.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, color: "#1E293B", fontWeight: 700 }}>{major.name}</span>
                    {major.isTop && (
                       <span style={{ fontSize: 10, fontWeight: 700, color: "white", background: "#1a2e6e", padding: "1px 6px", borderRadius: 4 }}>TOP</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "2px 8px",
                      color: statusColor, backgroundColor: statusBg, border: `1px solid ${statusBorder}`,
                      display: "flex", alignItems: "center", gap: 4
                    }}>
                      {icon} {statusText}
                    </span>
                    <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>
                      Chỉ tiêu: <strong>{major.quota.toLocaleString()}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 16, background: "#F1F5F9", borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0", position: "relative" }}>
                    <div style={{
                      width: `${progressPct}%`, height: "100%",
                      background: major.status === "SURPLUS" ? "linear-gradient(90deg, #10B981, #059669)" : (major.status === "DEFICIT" ? "linear-gradient(90deg, #FF6B35, #E85A2A)" : "linear-gradient(90deg, #3B82F6, #1D4ED8)"),
                      borderRadius: 8,
                      transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                    }} />
                  </div>
                  <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 700, width: 95, textAlign: "right" }}>
                    {major.count.toLocaleString()} hồ sơ ({Math.round((major.count / major.quota) * 100)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rankings Detail */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Chi tiết trạng thái theo ngành học</h3>
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>
            Chu kỳ tuyển sinh năm 2026
          </span>
        </div>

        <div>
          {displayData.map((major, i) => (
            <div key={major.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: i < displayData.length - 1 ? "1px solid #F8FAFC" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: i < 3 ? "#1a2e6e" : "#EEF2FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: i < 3 ? "white" : "#64748B",
                  fontWeight: 800, fontSize: 15
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>{major.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2, display: "flex", gap: 12 }}>
                    <span>Đã nộp: <strong>{major.count.toLocaleString()}</strong> hồ sơ</span>
                    <span>•</span>
                    <span>Chỉ tiêu: <strong>{major.quota.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                  fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                  color: major.status === "SURPLUS" ? "#065F46" : (major.status === "DEFICIT" ? "#9A3412" : "#1E40AF"),
                  backgroundColor: major.status === "SURPLUS" ? "#D1FAE5" : (major.status === "DEFICIT" ? "#FFEDD5" : "#DBEAFE")
                }}>
                  {major.status === "SURPLUS" ? `Thừa +${Math.abs(major.difference).toLocaleString()}` : (major.status === "DEFICIT" ? `Thiếu -${Math.abs(major.difference).toLocaleString()}` : "Đạt")}
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#1D4ED8" }}>{major.rate}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.4px" }}>TỶ LỆ DUYỆT</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 24px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>© 2026 Academic Fidelity Portal. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
}
