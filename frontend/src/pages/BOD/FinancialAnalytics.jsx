import { useState } from "react";
import { DollarSign, TrendingUp, BarChart3, PieChart, Layers, Download, Calendar, ArrowUpRight } from "lucide-react";

export default function FinancialAnalytics() {
  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>Phân Tích Tài Chính Chiến Lược (BOD Level)</h1>
          <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>Tổng hợp biên lợi nhuận, chi phí R&D, dòng tiền & ROI đầu tư cơ sở</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "#0F172A", color: "#fff", border: "none", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          <Download size={15} /> Xuất Báo Cáo Ban Giám Đốc
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 28 }}>
        {[
          { label: "Doanh Thu Dự Phóng 2026", val: "1,250 Tỷ", change: "+18.2%", color: "#16A34A", bg: "#F0FDF4" },
          { label: "EBITDA Margin", val: "28.4%", change: "+3.1% YoY", color: "#2563EB", bg: "#EFF6FF" },
          { label: "Ngân Sách Tái Đầu Tư CSVC", val: "280 Tỷ", change: "22.4% DT", color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Chi Phí Tuyển Sinh / Tân SV", val: "3.2 Triệu", change: "-8.5% YoY", color: "#FF6B35", bg: "#FFF7F4" },
        ].map((item, idx) => (
          <div key={idx} style={{ background: item.bg, borderRadius: 18, padding: "22px 24px", border: `1px solid ${item.color}25` }}>
            <div style={{ fontSize: 13.5, color: "#64748B", marginBottom: 8, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A" }}>{item.val}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: item.color, marginTop: 8 }}>{item.change}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0" }}>Phân Tích ROI Dự Án Tổ Hợp Giáo Dục & Trí Tuệ Nhân Tạo</h3>
        <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>
          Data Mart Tài chính ghi nhận hiệu quả vốn đầu tư (ROI) tại cơ sở Quy Nhơn đạt 18.5% sau 2 năm vận hành nhờ tích hợp đào tạo AI chất lượng cao và hợp tác doanh nghiệp công nghệ quốc tế.
        </p>
      </div>
    </div>
  );
}
