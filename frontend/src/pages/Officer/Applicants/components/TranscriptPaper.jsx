import React from "react";
import { AlertCircle } from "lucide-react";

export default function TranscriptPaper({ app }) {
  const bg = app.academicBackground;

  return (
    <div style={{ padding: "30px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{
        background: "white", width: "100%", maxWidth: "600px", borderRadius: 6,
        padding: "36px 40px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif"
      }}>
        <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "2px double #E2E8F0", paddingBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#374151", fontWeight: 600, letterSpacing: 0.5 }}>
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
            <span style={{ borderBottom: "1px solid #374151", display: "inline-block", width: "120px", marginTop: 4 }}>Độc lập - Tự do - Hạnh phúc</span>
          </div>
          <div style={{ marginTop: 18, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>BẢNG ĐIỂM CHI TIẾT HỒ SƠ TUYỂN SINH</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>Mã hồ sơ: <strong>{app.applicationCode}</strong></div>
        </div>

        {bg ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 13, color: "#334155", display: "flex", flexDirection: "column", gap: 6 }}>
              <div>• Trường THPT: <strong>{bg.schoolName || "N/A"}</strong></div>
              <div>• Năm tốt nghiệp: <strong>{bg.graduationYear || "N/A"}</strong></div>
            </div>

            <div style={{ marginTop: 8 }}>
              <h4 style={{ margin: "0 0 8px", fontSize: 12, color: "#475569", fontWeight: 700 }}>BẢNG ĐIỂM CHI TIẾT:</h4>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, border: "1px solid #CBD5E1" }}>
                <thead>
                  <tr style={{ background: "#F1F5F9" }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #CBD5E1", color: "#1E293B", fontWeight: 700 }}>Hạng mục</th>
                    <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #CBD5E1", color: "#1E293B", fontWeight: 700, width: "150px" }}>Điểm số</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Điểm Toán THPT", bg.mathScore],
                    ["Điểm Ngữ văn THPT", bg.literatureScore],
                    ["Điểm Tiếng Anh THPT", bg.englishScore],
                    ["Điểm GPA Lớp 10", bg.gpa10],
                    ["Điểm GPA Lớp 11", bg.gpa11],
                    ["Điểm GPA Lớp 12", bg.gpa12],
                    ["Chứng chỉ IELTS", bg.ieltsScore],
                    ["Điểm thi SAT", bg.satScore],
                  ].filter(([_, v]) => v !== null && v !== undefined).map(([label, val]) => (
                    <tr key={label} style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "8px 12px", color: "#475569", fontWeight: 500 }}>{label}</td>
                      <td style={{ padding: "8px 12px", textAlign: "right", color: "#FF6B35", fontWeight: 700, fontSize: 13 }}>{val}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#FFF7F4", borderTop: "2px solid #FF6B35" }}>
                    <td style={{ padding: "10px 12px", color: "#1E293B", fontWeight: 700 }}>Tổng điểm tổ hợp xét tuyển</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: "#FF6B35", fontWeight: 800, fontSize: 15 }}>
                      {bg.totalScore || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
            <AlertCircle size={32} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 12 }}>Chưa có thông tin điểm học bạ được lưu.</div>
          </div>
        )}

        <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 11, color: "#64748B" }}>
          <div><em>Ứng viên cam kết chịu trách nhiệm về điểm số đã khai báo</em></div>
          <div style={{ textAlign: "right" }}><strong>Hệ thống tuyển sinh trực tuyến</strong><br /><em>Đại học FPT</em></div>
        </div>
      </div>
    </div>
  );
}
