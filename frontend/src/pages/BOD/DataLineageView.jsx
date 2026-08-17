import { useState } from "react";
import { GitBranch, Database, Layers, ArrowRight, Server, CheckCircle2, Shield, Eye } from "lucide-react";

const LINEAGE_NODES = [
  {
    layer: "1. Lớp Nguồn Dữ Liệu",
    color: "#3B82F6",
    nodes: [
      { name: "Cổng Tuyển Sinh (Portal)", type: "OLTP MySQL", status: "Active" },
      { name: "Hệ Thống Đào Tạo (FAP)", type: "SQL Server", status: "Active" },
      { name: "LMS (Canvas API)", type: "REST API", status: "Active" },
      { name: "SAP Finance ERP", type: "SAP Connector", status: "Active" },
      { name: "Oracle HRMS", type: "Oracle DB", status: "Active" },
      { name: "Bộ GD&ĐT / CSDL QG", type: "NDOP / LGSP", status: "Active" }
    ]
  },
  {
    layer: "2. Tích Hợp & Điều Phối",
    color: "#8B5CF6",
    nodes: [
      { name: "AGN Agent Node", type: "Message Broker", status: "Active" },
      { name: "Batch ELT / ETL Pipeline", type: "Apache Airflow", status: "Active" },
      { name: "API Gateway (LGSP)", type: "Kong Gateway", status: "Active" }
    ]
  },
  {
    layer: "3. Kho Dữ Liệu Tập Trung (DWH)",
    color: "#F59E0B",
    nodes: [
      { name: "FACT_ADMISSION", type: "Fact Star Schema", status: "Active" },
      { name: "FACT_LEARNING", type: "Fact Star Schema", status: "Active" },
      { name: "FACT_FINANCE", type: "Fact Star Schema", status: "Active" },
      { name: "FACT_HR", type: "Fact Star Schema", status: "Active" },
      { name: "DIM_* (Master Data)", type: "Dimension Tables", status: "Active" }
    ]
  },
  {
    layer: "4. Data Mart Nghiệp Vụ",
    color: "#10B981",
    nodes: [
      { name: "Data Mart Tuyển Sinh", type: "MOLAP Cube", status: "Active" },
      { name: "Data Mart Học Vụ", type: "MOLAP Cube", status: "Active" },
      { name: "Data Mart Tài Chính", type: "MOLAP Cube", status: "Active" }
    ]
  },
  {
    layer: "5. Lớp Ứng Dụng & Khai Thác",
    color: "#EF4444",
    nodes: [
      { name: "Cổng Dữ Liệu FPT", type: "Public Portal", status: "Active" },
      { name: "DSS Hỗ Trợ Quyết Định", type: "AI Analytics", status: "Active" },
      { name: "Executive BOD Dashboard", type: "BI Dashboard", status: "Active" }
    ]
  }
];

export default function DataLineageView() {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>Data Lineage — Dòng Chảy Dữ Liệu Toàn Hệ Thống</h1>
          <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>Truy vết nguồn gốc, biến đổi và đích đến của dữ liệu từ Nguồn đến Báo cáo Ban Giám Đốc</p>
        </div>
        <span style={{ padding: "6px 14px", borderRadius: 100, background: "#16A34A", color: "#fff", fontSize: 12.5, fontWeight: 700 }}>
          Kiến trúc FPT Enterprise Data Warehouse
        </span>
      </div>

      {/* Lineage diagram columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, alignItems: "start" }}>
        {LINEAGE_NODES.map((col, cIdx) => (
          <div key={cIdx} style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${col.color}40`, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ padding: "14px 16px", background: `${col.color}15`, borderBottom: `1px solid ${col.color}30`, fontWeight: 800, fontSize: 13.5, color: col.color }}>
              {col.layer}
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {col.nodes.map((node, nIdx) => (
                <div
                  key={nIdx}
                  onClick={() => setSelectedNode(node)}
                  style={{
                    padding: "12px 14px", borderRadius: 10, background: selectedNode?.name === node.name ? `${col.color}15` : "#F8FAFC",
                    border: `1.5px solid ${selectedNode?.name === node.name ? col.color : "#E2E8F0"}`, cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{node.name}</div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>{node.type}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Details Box */}
      {selectedNode && (
        <div style={{ marginTop: 28, background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 8px 0" }}>Chi Tiết Node: {selectedNode.name}</h3>
          <p style={{ fontSize: 13.5, color: "#475569", margin: 0 }}>
            Loại thành phần: <strong>{selectedNode.type}</strong> | Trạng thái: <span style={{ color: "#16A34A", fontWeight: 700 }}>Hoạt động bình thường (Healthy)</span>. Dữ liệu được mã hóa chuẩn TLS 1.3 và kiểm tra toàn vẹn định kỳ qua LGSP/NDOP.
          </p>
        </div>
      )}
    </div>
  );
}
