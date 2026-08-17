import { useState } from "react";
import { BookOpen, Award, TrendingUp, Download, Globe, FileText, Cpu, CheckCircle } from "lucide-react";

export default function ResearchAnalytics() {
  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>Nghiên Cứu Khoa Học & Đổi Mới Sáng Tạo</h1>
          <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>FACT_RESEARCH • Công bố ISI/Scopus, bằng sáng chế và dự án chuyển giao công nghệ</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "#0F172A", color: "#fff", border: "none", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          <Download size={15} /> Xuất Báo Cáo NCKH
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 28 }}>
        {[
          { label: "Tổng bài báo Scopus/ISI", val: "680 Bài", sub: "+24.5% so với 2025", color: "#2563EB", bg: "#EFF6FF" },
          { label: "Bằng sáng chế / Patent", val: "18 Bằng", sub: "8 bằng quốc tế USPTO", color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Doanh thu Chuyển giao CN", val: "44.4 Tỷ", sub: "+32.0% YoY", color: "#16A34A", bg: "#F0FDF4" },
          { label: "Tổng kinh phí tài trợ NCKH", val: "65.0 Tỷ", sub: "Từ Quỹ FPT & Bộ KHCN", color: "#FF6B35", bg: "#FFF7F4" },
        ].map((item, idx) => (
          <div key={idx} style={{ background: item.bg, borderRadius: 18, padding: "22px 24px", border: `1px solid ${item.color}25` }}>
            <div style={{ fontSize: 13.5, color: "#64748B", marginBottom: 8, fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A" }}>{item.val}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: item.color, marginTop: 8 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0" }}>Lĩnh Vực Nghiên Cứu Mũi Nhọn</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { title: "Generative AI & LLM tiếng Việt", papers: 142, citations: "1,850", lead: "AI Center Quy Nhơn" },
            { title: "Bán dẫn & Thiết kế Vi mạch (Semiconductor)", papers: 84, citations: "920", lead: "Khoa CNTT & FPT Semiconductor" },
            { title: "Cybersecurity & Blockchain", papers: 96, citations: "1,200", lead: "Khoa An Toàn Thông Tin" },
            { title: "Công nghệ Tài chính (Fintech) & QTKD", papers: 110, citations: "890", lead: "Khoa QTKD" }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: 18, background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>{item.title}</h4>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>Chủ trì: <strong>{item.lead}</strong></div>
              <div style={{ display: "flex", gap: 14, fontSize: 13, fontWeight: 700, color: "#2563EB", marginTop: 8 }}>
                <span>{item.papers} Công bố</span>
                <span>•</span>
                <span>{item.citations} Trích dẫn</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
