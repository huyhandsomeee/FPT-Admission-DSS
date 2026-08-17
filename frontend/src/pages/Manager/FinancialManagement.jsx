import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart2, Download, Filter, Calendar, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Layers } from "lucide-react";

const FINANCIAL_KPIS = [
  { label: "Tổng doanh thu năm 2026", value: "482.5 Tỷ", change: "+14.2%", isUp: true, color: "#16A34A", bg: "#F0FDF4" },
  { label: "Chi phí vận hành", value: "318.2 Tỷ", change: "+6.8%", isUp: false, color: "#DC2626", bg: "#FEF2F2" },
  { label: "Lợi nhuận gộp", value: "164.3 Tỷ", change: "+24.5%", isUp: true, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Quỹ học bổng đã cấp", value: "42.8 Tỷ", change: "8.8% Doanh thu", isUp: true, color: "#7C3AED", bg: "#F5F3FF" }
];

const REVENUE_BY_CAMPUS = [
  { campus: "FPT Hà Nội (Hoà Lạc)", revenue: 198.4, target: 190.0, rate: 104.4, color: "#FF6B35" },
  { campus: "FPT TP.HCM (Q9)", revenue: 172.6, target: 175.0, rate: 98.6, color: "#2563EB" },
  { campus: "FPT Đà Nẵng", revenue: 54.2, target: 50.0, rate: 108.4, color: "#16A34A" },
  { campus: "FPT Cần Thơ", revenue: 36.8, target: 40.0, rate: 92.0, color: "#7C3AED" },
  { campus: "FPT Quy Nhơn (AI Campus)", revenue: 20.5, target: 18.0, rate: 113.8, color: "#0891B2" }
];

const RECENT_TRANSACTIONS = [
  { id: "TX-2026-9041", entity: "Thu học phí Học kỳ Fall 2026 - Đợt 1", category: "Học phí", amount: "+ 45.2 Tỷ", date: "15/08/2026", status: "Hoàn tất" },
  { id: "TX-2026-9040", entity: "Chi đầu tư hạ tầng AI Lab Quy Nhơn", category: "Đầu tư CSVC", amount: "- 12.8 Tỷ", date: "14/08/2026", status: "Đã duyệt" },
  { id: "TX-2026-9039", entity: "Cấp học bổng FPT Talent Scholarship", category: "Học bổng", amount: "- 8.4 Tỷ", date: "12/08/2026", status: "Hoàn tất" },
  { id: "TX-2026-9038", entity: "Thu phí nhập học Tân sinh viên K22", category: "Tuyển sinh", amount: "+ 18.6 Tỷ", date: "10/08/2026", status: "Hoàn tất" },
  { id: "TX-2026-9037", entity: "Chi trả lương giảng viên & CBNV T7/2026", category: "Nhân sự", amount: "- 22.1 Tỷ", date: "05/08/2026", status: "Hoàn tất" }
];

export default function FinancialManagement() {
  const [selectedCampus, setSelectedCampus] = useState("ALL");
  const [period, setPeriod] = useState("2026");

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #16A34A, #15803D)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(22,163,74,0.3)" }}>
            <DollarSign size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 }}>Quản Lý Tài Chính & Ngân Sách</h1>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "2px 0 0 0" }}>FACT_FINANCE • Báo cáo doanh thu, học phí, chi phí & dòng tiền theo Data Warehouse</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} style={{ padding: "9px 16px", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer", color: "#334155" }}>
            <option value="2026">Năm tài chính 2026</option>
            <option value="2025">Năm tài chính 2025</option>
            <option value="2024">Năm tài chính 2024</option>
          </select>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "#0F172A", color: "#fff", border: "none", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
            <Download size={15} /> Xuất Báo Cáo Tài Chính
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 28 }}>
        {FINANCIAL_KPIS.map((kpi, idx) => (
          <div key={idx} style={{ background: kpi.bg, borderRadius: 16, padding: "20px 22px", border: `1px solid ${kpi.color}25` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>{kpi.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: kpi.color, background: "#fff", padding: "3px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 3 }}>
                {kpi.isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {kpi.change}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Campus Breakdown & Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* Campus Revenue */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Doanh Thu Học Phí Theo Cơ Sở</h3>
              <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>Tỷ lệ đạt mục tiêu ngân sách (Đơn vị: Tỷ VNĐ)</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "4px 10px", borderRadius: 100 }}>
              Trung bình: 103.4% Target
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {REVENUE_BY_CAMPUS.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>
                  <span style={{ color: "#1E293B" }}>{item.campus}</span>
                  <span style={{ color: "#0F172A" }}>
                    <strong>{item.revenue} Tỷ</strong> <span style={{ color: "#94A3B8", fontWeight: 400 }}>/ {item.target} Tỷ ({item.rate}%)</span>
                  </span>
                </div>
                <div style={{ width: "100%", height: 10, background: "#F1F5F9", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, item.rate)}%`, height: "100%", background: item.color, borderRadius: 100, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Structure breakdown */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0" }}>Cơ Cấu Nguồn Thu & Chi Phí</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 12, border: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 4 }}>
                <span>Thu học phí chính quy</span>
                <strong style={{ color: "#0F172A" }}>84.5%</strong>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#16A34A" }}>407.7 Tỷ</div>
            </div>

            <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 12, border: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 4 }}>
                <span>Nghiên cứu & Chuyển giao CN</span>
                <strong style={{ color: "#0F172A" }}>9.2%</strong>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#2563EB" }}>44.4 Tỷ</div>
            </div>

            <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 12, border: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748B", marginBottom: 4 }}>
                <span>Dịch vụ sinh viên & Đào tạo ngắn hạn</span>
                <strong style={{ color: "#0F172A" }}>6.3%</strong>
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#7C3AED" }}>30.4 Tỷ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Giao Dịch Tài Chính Gần Đây (Data Mart Finance)</h3>
          <span style={{ fontSize: 12.5, color: "#64748B" }}>Đồng bộ thời gian thực từ SAP ERP</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>MÃ GIAO DỊCH</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>NỘI DUNG</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>DANH MỤC</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>SỐ TIỀN</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>NGÀY GIAO DỊCH</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_TRANSACTIONS.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{tx.id}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 600, color: "#0F172A" }}>{tx.entity}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600, background: "#F1F5F9", color: "#475569" }}>{tx.category}</span>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: 800, color: tx.amount.startsWith("+") ? "#16A34A" : "#DC2626" }}>{tx.amount}</td>
                  <td style={{ padding: "14px 20px", color: "#64748B" }}>{tx.date}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: "#DCFCE7", color: "#16A34A" }}>{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
