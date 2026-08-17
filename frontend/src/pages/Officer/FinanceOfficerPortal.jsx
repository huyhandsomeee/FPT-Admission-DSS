import { useState } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle, Download, Plus,
  Search, Filter, CheckCircle, Clock, XCircle, ChevronRight,
  Eye, FileText, Check, X, ShieldAlert, ArrowUpRight, ArrowDownRight,
  Send, UserCheck, Calendar, CreditCard, Landmark, Wallet, RefreshCw, Mail, Award
} from "lucide-react";

export default function FinanceOfficerPortal() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | tuition | transactions | scholarships | reports

  // Transaction selection state for detail sidebar
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

  // Scholarship selection state
  const [selectedScholar, setSelectedScholar] = useState({
    name: "Trần Thị B",
    code: "IA150456",
    major: "CNTT",
    type: "Khuyến khích",
    rate: "50%",
    amount: "12.500.000đ",
    remaining: "12.500.000đ",
    status: "Chờ duyệt",
    gpa: 8.5,
    gpaReq: 8.0,
    conduct: "Khá",
    conductReq: "Tốt",
    discipline: "Không"
  });

  // Tuition filter state
  const [tuitionYear, setTuitionYear] = useState("2026 - 2027");
  const [tuitionTerm, setTuitionTerm] = useState("Fall 2026");
  const [tuitionStatus, setTuitionStatus] = useState("ALL");

  const [txSearch, setTxSearch] = useState("");

  const transactionsList = [
    { id: "TXN-88231", date: "24/10/2026 09:15", student: "Nguyễn Văn A", studentCode: "SE150001", amount: "15,000,000", method: "Chuyển khoản (Vietcombank)", methodType: "bank", content: "Nguyen Van A nop hoc phi ky Fall 2026", status: "Đang xử lý" },
    { id: "TXN-88230", date: "24/10/2026 08:30", student: "Trần Thị B", studentCode: "IA150456", amount: "22,500,000", method: "Cổng thanh toán VNPay", methodType: "card", content: "Tran Thi B nop hoc phi hoc ky moi", status: "Đã duyệt" },
    { id: "TXN-88229", date: "23/10/2026 16:45", student: "Lê Văn C", studentCode: "SE170789", amount: "5,000,000", method: "Ví MoMo / QR Code", methodType: "wallet", content: "Le Van C nop tien giu cho KTX", status: "Đã duyệt" },
    { id: "TXN-88228", date: "23/10/2026 14:20", student: "Phạm Thị D", studentCode: "KD170112", amount: "15,000,000", method: "Chuyển khoản (Techcombank)", methodType: "bank", content: "Pham Thi D nop le phi nhap hoc", status: "Đang xử lý" },
  ];

  const tuitionDebts = [
    { id: "DEBT-01", name: "Nguyễn Văn A", code: "HE150123", amount: "25,500,000", deadline: "15/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" },
    { id: "DEBT-02", name: "Trần Thị B", code: "SS160456", amount: "12,000,000", deadline: "20/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-03", name: "Lê Văn C", code: "SE170789", amount: "5,500,000", deadline: "30/09/2026", status: "Chờ xử lý", color: "#D97706", bg: "#FEF3C7" },
    { id: "DEBT-04", name: "Hoàng Minh D", code: "SE180234", amount: "18,200,000", deadline: "25/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-05", name: "Đỗ Thu E", code: "GD170990", amount: "29,700,000", deadline: "10/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" }
  ];

  const scholarshipsData = [
    { name: "Nguyễn Văn A", code: "SE150123", major: "CNTT", type: "Tài năng", rate: "100%", amount: "25.000.000đ", remaining: "0đ", status: "Đủ điều kiện", gpa: 9.2, gpaReq: 8.5, conduct: "Tốt", conductReq: "Tốt", discipline: "Không" },
    { name: "Trần Thị B", code: "IA150456", major: "ATTT", type: "Khuyến khích", rate: "50%", amount: "12.500.000đ", remaining: "12.500.000đ", status: "Chờ duyệt", gpa: 8.5, gpaReq: 8.0, conduct: "Khá", conductReq: "Tốt", discipline: "Không" },
    { name: "Lê Hoàng C", code: "SS150789", major: "QTKD", type: "Hỗ trợ TC", rate: "—", amount: "10.000.000đ", remaining: "10.000.000đ", status: "Vi phạm", gpa: 7.2, gpaReq: 7.5, conduct: "Trung bình", conductReq: "Khá", discipline: "Cảnh cáo" }
  ];

  const refundRequests = [
    { name: "Nguyễn Văn A", code: "SE150xxx", reason: "Rút học phí", amount: "15,000,000đ", status: "Pending" },
    { name: "Trần Thị B", code: "IA160xxx", reason: "Bảo lưu", amount: "8,500,000đ", status: "Pending" },
    { name: "Lê Hoàng C", code: "GD170xxx", reason: "Chuyển ngành", amount: "22,000,000đ", status: "Pending" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* ── Finance Sub-Sidebar ── */}
      <div style={{ width: 240, background: "#fff", borderRight: "1px solid #E2E8F0", padding: "24px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingLeft: 6 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>
              FPT
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#9A3412", lineHeight: 1.1 }}>FPT Finance</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Staff Portal</div>
            </div>
          </div>

          {/* New Entry Button */}
          <button style={{
            width: "100%", padding: "10px 14px", borderRadius: 10, background: "linear-gradient(135deg, #C2410C, #9A3412)",
            color: "#fff", border: "none", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(194,65,12,0.25)", marginBottom: 20
          }}>
            <Plus size={16} /> New Entry
          </button>

          {/* Nav Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { key: "overview", label: "Overview", icon: Landmark },
              { key: "tuition", label: "Tuition Management", icon: CreditCard },
              { key: "transactions", label: "Transactions", icon: Wallet },
              { key: "scholarships", label: "Scholarships", icon: Award },
              { key: "reports", label: "Reports", icon: FileText },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  background: activeTab === tab.key ? "#60A5FA" : "transparent",
                  color: activeTab === tab.key ? "#fff" : "#475569"
                }}
              >
                <tab.icon size={17} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#2563EB", fontSize: 12 }}>
              NV
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Cán Bộ Tài Chính</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Finance Dept</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main View Area ── */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {/* Breadcrumb Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#9A3412" }}>
            Financial Management
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Mail size={16} color="#64748B" />
            </button>
            <button style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RefreshCw size={16} color="#64748B" />
            </button>
          </div>
        </div>

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Tổng quan Tài chính</h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Cập nhật lúc: Hôm nay, 08:30 AM</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1.5px solid #2563EB", background: "#fff", color: "#2563EB", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  <Download size={15} /> Export Report
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#EA580C", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  <Plus size={15} /> New Transaction
                </button>
              </div>
            </div>

            {/* 3 KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>
              {/* Total Revenue */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tổng Doanh Thu</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={16} color="#16A34A" />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>15.2B <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>VND</span></div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 6 }}>↑ +12.5% so với tháng trước</div>
              </div>

              {/* Total Expense */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tổng Chi Phí</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Wallet size={16} color="#DC2626" />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>4.8B <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>VND</span></div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginTop: 6 }}>↑ +3.2% so với tháng trước</div>
              </div>

              {/* Debt */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Dư Nợ Tồn Đọng</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AlertTriangle size={16} color="#D97706" />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>2.4B <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>VND</span></div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 6 }}>↓ -1.5% so với tháng trước</div>
              </div>
            </div>

            {/* Bottom Row: Trend Chart & Refund Requests */}
            <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
              {/* Trend Area Chart */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Xu Hướng Thu Phí & Doanh Thu</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#475569", background: "#F1F5F9", padding: "4px 10px", borderRadius: 6 }}>6 Tháng Qua</span>
                </div>
                <div style={{ position: "relative", height: 180, borderRadius: 12, background: "linear-gradient(180deg, rgba(234,88,12,0.12) 0%, rgba(234,88,12,0.01) 100%)", border: "1px solid #FDBA74", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
                  <svg viewBox="0 0 500 150" style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
                    <path d="M0,130 Q120,120 250,70 T500,40 L500,150 L0,150 Z" fill="rgba(234,88,12,0.2)" />
                    <path d="M0,130 Q120,120 250,70 T500,40" fill="none" stroke="#EA580C" strokeWidth="4" />
                  </svg>
                </div>
              </div>

              {/* Refund Requests List */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Yêu Cầu Hoàn Tiền Gần Đây</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#EA580C", cursor: "pointer" }}>Xem Tất Cả</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {refundRequests.map((r, idx) => (
                    <div key={idx} style={{ padding: "12px 14px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                          👤
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{r.name}</div>
                          <div style={{ fontSize: 11.5, color: "#64748B" }}>{r.code} - {r.reason}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{r.amount}</div>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#D97706", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: TUITION MANAGEMENT ── */}
        {activeTab === "tuition" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Công nợ Học phí</h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Theo dõi và xử lý các khoản nợ học phí của sinh viên</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  <Mail size={15} /> Gửi Email Nhắc nợ
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#fff", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  <Download size={15} /> Xuất Danh sách
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 18, marginBottom: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>NĂM HỌC</label>
                  <select value={tuitionYear} onChange={e => setTuitionYear(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
                    <option>2026 - 2027</option>
                    <option>2025 - 2026</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>KỲ HỌC</label>
                  <select value={tuitionTerm} onChange={e => setTuitionTerm(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
                    <option>Fall 2026</option>
                    <option>Summer 2026</option>
                    <option>Spring 2026</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>LOẠI PHÍ</label>
                  <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
                    <option>Tất cả</option>
                    <option>Học phí chính khóa</option>
                    <option>Phí ký túc xá</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>TRẠNG THÁI</label>
                  <select value={tuitionStatus} onChange={e => setTuitionStatus(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="OVERDUE">Quá hạn</option>
                    <option value="REMINDED">Đã nhắc nợ</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "transparent", color: "#64748B", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                  Xóa bộ lọc
                </button>
                <button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#9A3412", color: "#fff", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Tuition Debt Table */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px 18px", width: 40 }}><input type="checkbox" /></th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>MSSV / SINH VIÊN</th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>TỔNG NỢ (VND)</th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>HẠN CHÓT</th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>TRẠNG THÁI</th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {tuitionDebts.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "14px 18px" }}><input type="checkbox" /></td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 700, color: "#0F172A" }}>{item.name}</div>
                        <div style={{ fontSize: 11.5, color: "#64748B" }}>{item.code}</div>
                      </td>
                      <td style={{ padding: "14px 18px", fontWeight: 800, color: "#DC2626" }}>{item.amount}</td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{item.deadline}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: item.bg, color: item.color }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <button style={{ padding: "5px 12px", borderRadius: 6, background: "#EFF6FF", color: "#2563EB", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          Nhắc nợ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", fontSize: 12.5, color: "#64748B" }}>
                <span>Hiển thị 1-5 trong số 124 sinh viên</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#9A3412", color: "#fff", fontWeight: 700 }}>1</button>
                  <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff" }}>2</button>
                  <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#fff" }}>3</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: TRANSACTIONS & APPROVAL ── */}
        {activeTab === "transactions" && (
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
                  style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <input type="date" style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13 }} />
              <select style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#fff" }}>
                <option>Tất cả phương thức</option>
                <option>Chuyển khoản ngân hàng</option>
                <option>Cổng VNPay</option>
              </select>
              <button style={{ padding: "9px 18px", borderRadius: 8, background: "#F1F5F9", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Lọc
              </button>
            </div>

            {/* 2 Columns: Table Left, Detail View Right */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
              {/* Left Table */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
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
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Chi tiết Giao dịch</h3>
                  <X size={16} color="#94A3B8" style={{ cursor: "pointer" }} />
                </div>

                <div style={{ textAlign: "center", padding: "14px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>MÃ GIAO DỊCH</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", fontFamily: "monospace" }}>{selectedTx.id}</div>
                  <span style={{ display: "inline-block", marginTop: 4, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#FEF3C7", color: "#B45309" }}>
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
                    <strong style={{ color: "#0F172A", fontSize: 14 }}>{selectedTx.amount} VND</strong>
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
                  <div style={{ height: 110, borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, cursor: "pointer" }}>
                    <span style={{ fontSize: 24 }}>📄</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#2563EB" }}>Xem Giấy chuyển tiền Vietcombank</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button style={{ padding: "10px", borderRadius: 8, background: "#E2E8F0", color: "#334155", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Từ chối
                  </button>
                  <button style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Phê duyệt
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: SCHOLARSHIPS & FINANCIAL AID ── */}
        {activeTab === "scholarships" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Học bổng & Hỗ trợ Tài chính</h1>
            </div>

            {/* 3 KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 24 }}>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Tổng Ngân Sách Cấp</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    🏛️
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>15.5 Tỷ</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Học kỳ Spring 2026</div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Đã Giải Ngân</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    💳
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>12.0 Tỷ</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: "77%", height: "100%", background: "#EA580C" }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>77%</span>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Sinh Viên Nhận</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    👥
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>450</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>↑ +12% so với kỳ trước</div>
              </div>
            </div>

            {/* 2 Columns */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
              {/* Left Table */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: "#0F172A" }}>Danh sách Cấp học bổng</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", fontSize: 12, fontWeight: 600 }}>Lọc</button>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#fff", fontSize: 12, fontWeight: 600 }}>Xuất Excel</button>
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>HỌ TÊN / MSSV</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>LOẠI HB</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>MỨC / SỐ TIỀN</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>CÒN LẠI</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholarshipsData.map((s, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedScholar(s)}
                        style={{ borderBottom: "1px solid #F1F5F9", cursor: "pointer", background: selectedScholar.code === s.code ? "#EFF6FF" : "#fff" }}
                      >
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>{s.name}</div>
                          <div style={{ fontSize: 11.5, color: "#64748B" }}>{s.code}</div>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: s.type === "Tài năng" ? "#DBEAFE" : s.type === "Khuyến khích" ? "#FFEDD5" : "#F1F5F9", color: s.type === "Tài năng" ? "#1D4ED8" : s.type === "Khuyến khích" ? "#C2410C" : "#475569" }}>
                            {s.type}
                          </span>
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>{s.rate}</div>
                          <div style={{ fontSize: 11, color: "#64748B" }}>~{s.amount}</div>
                        </td>
                        <td style={{ padding: "12px 14px", color: s.remaining !== "0đ" ? "#DC2626" : "#16A34A", fontWeight: 700 }}>{s.remaining}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.status === "Đủ điều kiện" ? "#DCFCE7" : s.status === "Chờ duyệt" ? "#FEF3C7" : "#FEE2E2", color: s.status === "Đủ điều kiện" ? "#16A34A" : s.status === "Chờ duyệt" ? "#B45309" : "#DC2626" }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right Detail Box */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, borderBottom: "1px solid #F1F5F9", paddingBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>
                    {selectedScholar.name.split(" ").pop()[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>{selectedScholar.name}</h3>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{selectedScholar.code} • {selectedScholar.major}</div>
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 10 }}>
                  ĐIỀU KIỆN DUY TRÌ HỌC BỔNG
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>GPA Học kỳ trước</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>Yêu cầu: &gt;= {selectedScholar.gpaReq}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: selectedScholar.gpa >= selectedScholar.gpaReq ? "#16A34A" : "#DC2626" }}>{selectedScholar.gpa}</span>
                      {selectedScholar.gpa >= selectedScholar.gpaReq ? <CheckCircle size={16} color="#16A34A" /> : <XCircle size={16} color="#DC2626" />}
                    </div>
                  </div>

                  <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Điểm rèn luyện</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>Yêu cầu: {selectedScholar.conductReq}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: selectedScholar.conduct === "Tốt" ? "#16A34A" : "#D97706" }}>{selectedScholar.conduct}</span>
                      {selectedScholar.conduct === "Tốt" ? <CheckCircle size={16} color="#16A34A" /> : <AlertTriangle size={16} color="#D97706" />}
                    </div>
                  </div>

                  <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Kỷ luật</div>
                      <div style={{ fontSize: 11, color: "#64748B" }}>Yêu cầu: Không có</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: selectedScholar.discipline === "Không" ? "#16A34A" : "#DC2626" }}>{selectedScholar.discipline}</span>
                      {selectedScholar.discipline === "Không" ? <CheckCircle size={16} color="#16A34A" /> : <XCircle size={16} color="#DC2626" />}
                    </div>
                  </div>
                </div>

                {selectedScholar.conduct !== "Tốt" && (
                  <div style={{ padding: "10px 12px", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A", fontSize: 12, color: "#92400E", marginBottom: 16 }}>
                    ⚠️ Sinh viên không đạt chuẩn điểm rèn luyện. Cần xem xét giải trình từ Phòng CTSV.
                  </div>
                )}

                <div style={{ fontSize: 12, fontWeight: 800, color: "#64748B", textTransform: "uppercase", marginBottom: 8 }}>
                  HÀNH ĐỘNG
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button style={{ padding: "11px", borderRadius: 8, background: "#10B981", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    💳 Duyệt Giải Ngân
                  </button>
                  <button style={{ padding: "10px", borderRadius: 8, background: "#fff", color: "#DC2626", border: "1.5px solid #DC2626", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    🚫 Thu hồi Học bổng
                  </button>
                  <div style={{ textAlign: "center", fontSize: 12, color: "#475569", cursor: "pointer", marginTop: 4 }}>
                    Yêu cầu bổ sung thông tin
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
