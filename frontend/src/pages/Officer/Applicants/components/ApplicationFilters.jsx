import React from "react";
import { Search, Download, Plus } from "lucide-react";

export default function ApplicationFilters({
  search, onSearchChange, statusFilter, onStatusChange,
  statuses, statusLabels, statusCounts
}) {
  return (
    <>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "9px 14px" }}>
          <Search size={15} color="#94A3B8" />
          <input value={search} onChange={e => onSearchChange(e.target.value)} type="text"
            placeholder="Tìm kiếm theo tên thí sinh, SĐT hoặc mã hồ sơ..."
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%" }} />
        </div>
        <button style={{ padding: "9px 16px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Download size={14} /> Xuất báo cáo
        </button>
      </div>

      <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid #F1F5F9", overflowX: "auto" }}>
        {statuses.map(s => (
          <button key={s} onClick={() => onStatusChange(s)}
            style={{
              padding: "12px 16px", background: "none", border: "none",
              borderBottom: statusFilter === s ? "2px solid #FF6B35" : "2px solid transparent",
              fontWeight: statusFilter === s ? 700 : 500, fontSize: 13,
              color: statusFilter === s ? "#FF6B35" : "#64748B",
              cursor: "pointer", whiteSpace: "nowrap"
            }}>
            {statusLabels[s]} ({(statusCounts[s] || 0).toLocaleString()})
          </button>
        ))}
      </div>
    </>
  );
}
