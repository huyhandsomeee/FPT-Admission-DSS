import { useState } from "react";
import { Search, X, Check, Eye } from "lucide-react";

export default function FinanceTransactions() {
  const [selectedTx, setSelectedTx] = useState({
    id: "TXN-88231",
    date: "24/10/2026 09:15:22",
    student: "Nguyễn Văn A",
    studentCode: "SE150001",
    amount: "15,000,000",
    method: "Chuyển khoản (Vietcombank)",
    content: "Nguyen Van A nop hoc phi ky Fall 2026",
    status: "Đang xử lý",
    methodType: "bank"
  });

  const [txSearch, setTxSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const transactionsList = [
    { id: "TXN-88231", date: "24/10/2026 09:15", student: "Nguyễn Văn A", studentCode: "SE150001", amount: "15,000,000", method: "Chuyển khoản (Vietcombank)", methodType: "bank", content: "Nguyen Van A nop hoc phi ky Fall 2026", status: "Đang xử lý" },
    { id: "TXN-88230", date: "24/10/2026 08:30", student: "Trần Thị B", studentCode: "IA150456", amount: "22,500,000", method: "Cổng thanh toán VNPay", methodType: "card", content: "Tran Thi B nop hoc phi hoc ky moi", status: "Đã duyệt" },
    { id: "TXN-88229", date: "23/10/2026 16:45", student: "Lê Văn C", studentCode: "SE170789", amount: "5,000,000", method: "Ví MoMo / QR Code", methodType: "wallet", content: "Le Van C nop tien giu cho KTX", status: "Đã duyệt" },
    { id: "TXN-88228", date: "23/10/2026 14:20", student: "Phạm Thị D", studentCode: "KD170112", amount: "15,000,000", method: "Chuyển khoản (Techcombank)", methodType: "bank", content: "Pham Thi D nop le phi nhap hoc", status: "Đang xử lý" },
    { id: "TXN-88227", date: "22/10/2026 11:10", student: "Hoàng Văn Nam", studentCode: "SE180345", amount: "25,000,000", method: "Chuyển khoản (BIDV)", methodType: "bank", content: "Hoang Van Nam nop hoc phi Fall 2026", status: "Đã duyệt" }
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Giao dịch</h1>
        <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Theo dõi, đối soát và phê duyệt các giao dịch tài chính.</p>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input
            placeholder="Tìm kiếm theo Mã giao dịch hoặc Tên sinh viên..."
            value={txSearch} onChange={e => setTxSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box", background: "#fff" }}
          />
        </div>
        <input type="date" style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }} />
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
          <option value="ALL">Tất cả phương thức</option>
          <option value="BANK">Chuyển khoản ngân hàng</option>
          <option value="VNPAY">Cổng VNPay</option>
          <option value="MOMO">Ví MoMo QR</option>
        </select>
        <button style={{ padding: "9px 20px", borderRadius: 8, background: "#F1F5F9", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Lọc
        </button>
      </div>

      {/* 2 Columns: Table Left, Detail View Right */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
        {/* Left Table */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
            Danh sách Giao dịch
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>MÃ GD</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>NGÀY</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>SINH VIÊN</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>SỐ TIỀN (VND)</th>
                <th style={{ padding: "10px 14px", fontWeight: 700 }}>PHƯƠNG THỨC</th>
              </tr>
            </thead>
            <tbody>
              {transactionsList.map((tx, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedTx(tx)}
                  style={{
                    borderBottom: "1px solid #F1F5F9", cursor: "pointer",
                    background: selectedTx.id === tx.id ? "#EFF6FF" : "#fff"
                  }}
                >
                  <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{tx.id}</td>
                  <td style={{ padding: "12px 14px", color: "#64748B", fontSize: 12 }}>{tx.date}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A" }}>{tx.student}</td>
                  <td style={{ padding: "12px 14px", fontWeight: 800, color: "#0F172A" }}>{tx.amount}</td>
                  <td style={{ padding: "12px 14px", textAlign: "center" }}>
                    {tx.methodType === "bank" ? "🏛️" : tx.methodType === "card" ? "💳" : "📱"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Detail Box */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Chi tiết Giao dịch</h3>
            <X size={16} color="#94A3B8" style={{ cursor: "pointer" }} />
          </div>

          <div style={{ textAlign: "center", padding: "14px 0", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>MÃ GIAO DỊCH</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", fontFamily: "monospace" }}>{selectedTx.id}</div>
            <span style={{ display: "inline-block", marginTop: 4, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: selectedTx.status === "Đã duyệt" ? "#DCFCE7" : "#FEF3C7", color: selectedTx.status === "Đã duyệt" ? "#16A34A" : "#B45309" }}>
              {selectedTx.status}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 0", fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Sinh viên:</span>
              <strong style={{ color: "#0F172A" }}>{selectedTx.student} ({selectedTx.studentCode})</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Số tiền:</span>
              <strong style={{ color: "#0F172A", fontSize: 14.5 }}>{selectedTx.amount} VND</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Thời gian:</span>
              <span style={{ color: "#475569" }}>{selectedTx.date}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Phương thức:</span>
              <span style={{ color: "#0F172A", fontWeight: 600 }}>{selectedTx.method}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Nội dung:</span>
              <span style={{ color: "#475569", textAlign: "right" }}>{selectedTx.content}</span>
            </div>
          </div>

          {/* Evidence Image Preview */}
          <div style={{ marginTop: 10, marginBottom: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Chứng từ đính kèm</div>
            <div style={{ height: 120, borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, cursor: "pointer" }}>
              <span style={{ fontSize: 26 }}>📄</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>Xem Giấy chuyển tiền Vietcombank</span>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>UNC-88231-VCB.pdf (1.4MB)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button style={{ padding: "11px", borderRadius: 8, background: "#E2E8F0", color: "#334155", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Từ chối
            </button>
            <button
              onClick={() => setSelectedTx(s => ({ ...s, status: "Đã duyệt" }))}
              style={{ padding: "11px", borderRadius: 8, background: "#9A3412", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              Phê duyệt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
