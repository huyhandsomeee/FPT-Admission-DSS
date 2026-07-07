import React, { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { 
  RefreshCw, Upload, Download, CheckCircle, 
  XCircle, FileSpreadsheet, Sparkles, ChevronLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MoetResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/officer/moet/results");
      if (Array.isArray(res.data)) {
        setResults(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleSyncAPI = async () => {
    setSyncing(true);
    setMsg(null);
    try {
      const res = await api.post("/api/officer/moet/sync");
      setMsg({ type: "success", text: `${res.data.message}. Đã đồng bộ thành công ${res.data.totalSynced} hồ sơ (Đỗ: ${res.data.passCount}, Trượt: ${res.data.failCount}).` });
      fetchResults();
    } catch (e) {
      console.error(e);
      setMsg({ type: "error", text: "Đồng bộ API thất bại. Vui lòng kiểm tra lại kết nối cổng dịch vụ Bộ GD&ĐT." });
    } finally {
      setSyncing(false);
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setMsg(null);
    try {
      const res = await api.post("/api/officer/moet/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMsg({ type: "success", text: `${res.data.message}. Đã nhập thành công ${res.data.totalImported} dòng (Đỗ: ${res.data.passCount}, Trượt: ${res.data.failCount}).` });
      fetchResults();
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "Lỗi xử lý file Excel. Đảm bảo cấu trúc cột đúng định dạng." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="animate-fade-in">
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#94A3B8" }}>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/officer/dashboard")}>Cổng Tuyển Sinh</span>
        <span style={{ margin: "0 6px" }}>›</span>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/officer/applicants")}>Smart Pipeline review</span>
        <span style={{ margin: "0 6px" }}>›</span>
        <span style={{ color: "#FF6B35", fontWeight: 600 }}>Đồng bộ Bộ GDĐT</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button 
            onClick={() => navigate("/officer/applicants")}
            style={{ padding: 8, background: "white", border: "1px solid #E2E8F0", borderRadius: 10, cursor: "pointer", display: "flex", color: "#64748B" }}
          >
            <ChevronLeft size={16} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>
              Đồng bộ Kết quả tuyển sinh Bộ GD&ĐT
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
              Đối soát kết quả lọc ảo chính thức của Bộ GD&ĐT và cập nhật trạng thái trúng tuyển Đại học FPT.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {/* Custom File Upload Button */}
          <label style={{
            padding: "10px 18px", background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569",
            cursor: uploading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7,
            transition: "all 0.15s"
          }}>
            <Upload size={15} /> 
            {uploading ? "Đang upload..." : "Nhập file Excel"}
            <input 
              type="file" 
              accept=".xlsx,.xls" 
              onChange={handleExcelUpload} 
              disabled={uploading} 
              style={{ display: "none" }} 
            />
          </label>

          <button 
            onClick={handleSyncAPI} 
            disabled={syncing} 
            style={{
              padding: "10px 18px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
              border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "white",
              cursor: syncing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7,
              boxShadow: "0 4px 12px rgba(255,107,53,0.2)", transition: "all 0.15s"
            }}
          >
            <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Đang đồng bộ..." : "Đồng bộ API Bộ"}
          </button>
        </div>
      </div>

      {/* Messages */}
      {msg && (
        <div style={{
          padding: "14px 18px",
          borderRadius: 12,
          border: msg.type === "success" ? "1px solid #A7F3D0" : "1px solid #FCA5A5",
          background: msg.type === "success" ? "#EFFDF5" : "#FEF2F2",
          color: msg.type === "success" ? "#065F46" : "#991B1B",
          fontSize: 13.5,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 8,
          animation: "fade-in 0.3s ease"
        }}>
          {msg.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Summary Info Banner */}
      <div style={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
        borderRadius: 16, padding: "18px 24px",
        border: "1px solid #FED7AA",
        display: "flex", alignItems: "center", gap: 16
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Sparkles size={20} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", letterSpacing: "0.5px", marginBottom: 4 }}>
            HƯỚNG DẪN NGHIỆP VỤ ĐỒNG BỘ
          </div>
          <div style={{ fontSize: 13, color: "#78350F", lineHeight: "1.5" }}>
            Hệ thống hỗ trợ 2 phương thức đồng bộ: (1) <strong>Đồng bộ API Bộ</strong> để kết nối cổng lọc ảo của Bộ GD&ĐT lấy dữ liệu trực tiếp, hoặc (2) <strong>Nhập file Excel</strong> danh sách kết quả của Bộ để đối soát hàng loạt. Các hồ sơ trúng tuyển sẽ tự động chuyển sang trạng thái <strong>Trúng tuyển chính thức</strong> và kích hoạt thủ tục nhập học cho thí sinh.
          </div>
        </div>
      </div>

      {/* Results Log Table */}
      <div style={{
        background: "white", borderRadius: 16, overflow: "hidden",
        border: "1px solid #E8ECF1", boxShadow: "0 4px 10px rgba(0,0,0,0.02)"
      }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #E8ECF1", display: "flex", alignItems: "center", gap: 8 }}>
          <FileSpreadsheet size={18} color="#FF6B35" />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Nhật ký đồng bộ kết quả</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "80px 0", textAlign: "center", color: "#94A3B8" }}>
              <div style={{ width: 32, height: 32, border: "3px solid #FF6B35", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              Đang tải danh sách kết quả...
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#94A3B8", fontSize: 13.5 }}>
              Chưa có dữ liệu đồng bộ nào được ghi nhận. Vui lòng bấm Đồng bộ hoặc Nhập Excel để bắt đầu.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E8ECF1" }}>
                  <th style={{ padding: "14px 20px", fontWeight: 700, color: "#475569" }}>Mã hồ sơ</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, color: "#475569" }}>Họ tên thí sinh</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, color: "#475569" }}>Ngành xét tuyển</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, color: "#475569", textAlign: "center" }}>Nguyện vọng</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, color: "#475569" }}>Kết quả Bộ</th>
                  <th style={{ padding: "14px 20px", fontWeight: 700, color: "#475569" }}>Ngày đồng bộ</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid #F8FAFC" }} className="hover:bg-slate-50">
                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "#1E293B" }}>{row.applicationCode}</td>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: "#334155" }}>{row.fullName}</td>
                    <td style={{ padding: "14px 20px", color: "#475569" }}>{row.major}</td>
                    <td style={{ padding: "14px 20px", color: "#FF6B35", fontWeight: 800, textAlign: "center" }}>NV{row.choice}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
                        background: row.result === "PASS" ? "#D1FAE5" : "#FEE2E2",
                        color: row.result === "PASS" ? "#065F46" : "#991B1B"
                      }}>
                        {row.result === "PASS" ? "Trúng tuyển (PASS)" : "Không trúng tuyển (FAIL)"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", color: "#64748B" }}>
                      {new Date(row.syncedAt).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
