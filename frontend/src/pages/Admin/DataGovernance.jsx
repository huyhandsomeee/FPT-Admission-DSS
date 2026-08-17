import { useState } from "react";
import { Shield, Lock, UserCheck, Key, FileCheck, EyeOff, AlertCircle } from "lucide-react";

export default function DataGovernance() {
  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản Trị Dữ Liệu & Tuân Thủ Bảo Mật (Data Governance)</h1>
          <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>Chính sách bảo mật thông tin PII, phân quyền RBAC & mã hóa dữ liệu theo chuẩn ISO 27001</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18, marginBottom: 28 }}>
        {[
          { title: "Chính Sách Bảo Mật PII", desc: "Mã hóa trường số CCCD, Email, SĐT trong DIM_STUDENT bằng AES-256", status: "Active", icon: Lock, color: "#2563EB" },
          { title: "Phân Quyền Truy Cập (RBAC)", desc: "Kiểm soát truy cập theo vai trò Thí sinh, Sinh viên, Cán bộ, Quản lý, BOD", status: "Enforced", icon: UserCheck, color: "#16A34A" },
          { title: "Audit Trail & Truy Vết", desc: "Ghi nhật ký toàn bộ truy vấn và thao tác xuất báo cáo Data Mart", status: "Logging", icon: FileCheck, color: "#7C3AED" },
          { title: "Data Masking Mask", desc: "Tự động che dữ liệu nhạy cảm đối với tài khoản không có quyền Admin", status: "Active", icon: EyeOff, color: "#FF6B35" }
        ].map((p, idx) => (
          <div key={idx} style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <p.icon size={22} color={p.color} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>{p.title}</h3>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, margin: "0 0 16px 0" }}>{p.desc}</p>
            <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: "#DCFCE7", color: "#16A34A" }}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
