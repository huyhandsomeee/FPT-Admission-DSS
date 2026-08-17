import { useState } from "react";
import {
  TrendingUp, Wallet, AlertTriangle, Download, Plus,
  ArrowRight, Landmark, Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FinanceOverview() {
  const navigate = useNavigate();

  const refundRequests = [
    { name: "Nguyễn Văn A", code: "SE150xxx", reason: "Rút học phí", amount: "15,000,000đ", status: "Pending" },
    { name: "Trần Thị B", code: "IA160xxx", reason: "Bảo lưu", amount: "8,500,000đ", status: "Pending" },
    { name: "Lê Hoàng C", code: "GD170xxx", reason: "Chuyển ngành", amount: "22,000,000đ", status: "Pending" }
  ];

  return (
    <div>
      {/* Title & Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Tổng quan Tài chính</h1>
          <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Cập nhật lúc: Hôm nay, 08:30 AM</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1.5px solid #2563EB", background: "#fff", color: "#2563EB", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <Download size={15} /> Export Report
          </button>
          <button
            onClick={() => navigate("/staff/finance/transactions")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#EA580C", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            <Plus size={15} /> New Transaction
          </button>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 28 }}>
        {/* Total Revenue */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Tổng Doanh Thu</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} color="#16A34A" />
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>15.2B <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>VND</span></div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 8 }}>↑ +12.5% so với tháng trước</div>
        </div>

        {/* Total Expense */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Tổng Chi Phí</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Wallet size={18} color="#DC2626" />
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>4.8B <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>VND</span></div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#DC2626", marginTop: 8 }}>↑ +3.2% so với tháng trước</div>
        </div>

        {/* Debt */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Dư Nợ Tồn Đọng</span>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={18} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>2.4B <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>VND</span></div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 8 }}>↓ -1.5% so với tháng trước</div>
        </div>
      </div>

      {/* Bottom Row: Trend Chart & Refund Requests */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24 }}>
        {/* Trend Area Chart */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Xu Hướng Thu Phí & Doanh Thu</h3>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", background: "#F1F5F9", padding: "4px 12px", borderRadius: 6 }}>6 Tháng Qua</span>
          </div>
          <div style={{ position: "relative", height: 220, borderRadius: 12, background: "linear-gradient(180deg, rgba(234,88,12,0.15) 0%, rgba(234,88,12,0.01) 100%)", border: "1px solid #FDBA74", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
            <svg viewBox="0 0 500 150" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
              <path d="M0,130 Q120,120 250,70 T500,40 L500,150 L0,150 Z" fill="rgba(234,88,12,0.22)" />
              <path d="M0,130 Q120,120 250,70 T500,40" fill="none" stroke="#EA580C" strokeWidth="4" />
            </svg>
          </div>
        </div>

        {/* Refund Requests List */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Yêu Cầu Hoàn Tiền Gần Đây</h3>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#EA580C", cursor: "pointer" }}>Xem Tất Cả</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {refundRequests.map((r, idx) => (
              <div key={idx} style={{ padding: "14px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    👤
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{r.code} - {r.reason}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A" }}>{r.amount}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#D97706", background: "#FEF3C7", padding: "2px 8px", borderRadius: 4 }}>
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
