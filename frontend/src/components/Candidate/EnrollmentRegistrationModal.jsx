import React, { useState } from "react";
import {
  X, Printer, Download, CheckCircle2, ShieldCheck,
  Building, User, Calendar, MapPin, Phone, Mail, FileText,
  FileCheck, Sparkles, Check, AlertCircle, Award
} from "lucide-react";

export default function EnrollmentRegistrationModal({
  isOpen,
  onClose,
  application,
  onConfirmEnrollment,
  showToast
}) {
  if (!isOpen) return null;

  const p = application?.personalInfo || {};
  const a = application?.academicInfo || {};
  const pref = (application?.preferences && application.preferences[0]) || {
    majorName: "Kỹ thuật Phần mềm (Software Engineering)",
    campusName: "FPT Hà Nội (Khu CNC Hòa Lạc)"
  };

  const [hasSigned, setHasSigned] = useState(false);
  const [signatureDate] = useState(new Date().toLocaleDateString("vi-VN"));

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (showToast) {
      showToast("📄 Đang tải xuống Phiếu Đăng Ký Đại Học FPT (Bản PDF chính thức)...");
    }
    setTimeout(() => {
      if (showToast) {
        showToast("✅ Đã tải xuống file Phieu_Dang_Ky_Dai_Hoc_FPT_2026.pdf thành công!");
      }
    }, 1200);
  };

  const handleConfirm = () => {
    setHasSigned(true);
    if (onConfirmEnrollment) {
      onConfirmEnrollment();
    }
    if (showToast) {
      showToast("🎉 Đã hoàn tất và ký số nộp Phiếu Đăng Ký Đại Học FPT thành công!");
    }
  };

  // Format DOB digits
  const dobDigits = (p.dob ? p.dob.replace(/-/g, "") : "20060815");
  // YYYYMMDD -> DDMMYY
  const formattedDob = p.dob
    ? `${p.dob.split("-")[2]}${p.dob.split("-")[1]}${p.dob.split("-")[0]}`
    : "15082006";

  // Format CCCD digits
  const cccd = p.citizenId || "001206019842";
  const cccdDigits = cccd.split("").concat(Array(12 - cccd.length).fill("")).slice(0, 12);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 99999,
      background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", overflowY: "auto"
    }}>
      <div style={{
        width: "100%", maxWidth: 880, background: "#FFFFFF",
        borderRadius: 16, border: "1px solid #CBD5E1",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
        display: "flex", flexDirection: "column", maxHeight: "92vh",
        overflow: "hidden"
      }}>
        {/* Header Action Bar */}
        <div style={{
          padding: "14px 22px", background: "#0F172A", color: "#FFFFFF",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: "#EA580C",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <FileCheck size={18} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: "-0.2px" }}>
                Phiếu Đăng Ký Đại Học FPT (Hệ Đại Học Chính Quy)
              </h3>
              <span style={{ fontSize: 11, color: "#94A3B8" }}>
                Mã biểu mẫu: 06.03-BM/ĐH/HDCV/FE v1/5 • Hồ sơ: <strong>{application?.applicationId || "FPT-2026-894120"}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handlePrint}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                borderRadius: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#FFF", fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}
            >
              <Printer size={14} /> In Phiếu
            </button>
            <button
              onClick={handleDownload}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                borderRadius: 6, background: "#EA580C", border: "none",
                color: "#FFF", fontSize: 12, fontWeight: 800, cursor: "pointer"
              }}
            >
              <Download size={14} /> Tải PDF
            </button>
            <button
              onClick={onClose}
              style={{
                border: "none", background: "transparent", color: "#94A3B8",
                cursor: "pointer", marginLeft: 4, padding: 4
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Body - Authentic Paper Style matching the reference PDF */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "30px 40px",
          background: "#FDFDFD", color: "#000000", fontFamily: "'Times New Roman', Times, serif",
          fontSize: "14px", lineHeight: 1.45
        }}>
          {/* Top Form Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: "bold" }}>BỘ GIÁO DỤC VÀ ĐÀO TẠO</div>
              <div style={{ fontSize: 13, fontWeight: "bold" }}>TRƯỜNG ĐẠI HỌC FPT</div>
              <div style={{ fontSize: 11 }}>----------***----------</div>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: "#EA580C", fontFamily: "Inter, sans-serif" }}>FPT</span>
                <span style={{ fontSize: 12, color: "#2563EB", fontFamily: "Inter, sans-serif" }}>Education</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: "bold", color: "#EA580C", textTransform: "uppercase" }}>
                TRƯỜNG ĐẠI HỌC FPT
              </div>
            </div>
          </div>

          <div style={{ fontSize: 10, color: "#666", marginBottom: 14 }}>
            06.03-BM/ĐH/HDCV/FE v1/5 &nbsp;&nbsp;&nbsp;&nbsp; 1/1
          </div>

          {/* Form Title */}
          <div style={{ textAlign: "center", margin: "10px 0 20px" }}>
            <h2 style={{ fontSize: 18, fontWeight: "bold", textTransform: "uppercase", margin: "0 0 4px" }}>
              PHIẾU ĐĂNG KÝ ĐẠI HỌC FPT
            </h2>
            <div style={{ fontSize: 14, fontWeight: "bold", fontStyle: "italic" }}>
              (HỆ ĐẠI HỌC CHÍNH QUY)
            </div>
          </div>

          {/* Section 1 & 2 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <strong>1. Họ và tên:</strong> <span style={{ textTransform: "uppercase", fontWeight: "bold", fontSize: 15, marginLeft: 8 }}>{p.fullName || "NGUYỄN VĂN AN"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Nam <span style={{ display: "inline-block", width: 16, height: 16, border: "1px solid #000", textAlign: "center", lineHeight: "14px", fontWeight: "bold" }}>{p.gender === "Nữ" ? "" : "✓"}</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Nữ <span style={{ display: "inline-block", width: 16, height: 16, border: "1px solid #000", textAlign: "center", lineHeight: "14px", fontWeight: "bold" }}>{p.gender === "Nữ" ? "✓" : ""}</span>
              </label>
            </div>
          </div>

          {/* Section 2: Date of Birth boxes */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <strong>2. Ngày tháng năm sinh (dd/mm/yy):</strong>
            <div style={{ display: "flex", gap: 3 }}>
              {["1", "5", "", "0", "8", "", "0", "6"].map((digit, idx) => (
                digit === "" ? (
                  <span key={idx} style={{ padding: "0 2px" }}>/</span>
                ) : (
                  <span key={idx} style={{
                    width: 22, height: 24, border: "1px solid #000",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", fontSize: 13
                  }}>
                    {digit}
                  </span>
                )
              ))}
            </div>
          </div>

          {/* Section 3: High School */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <strong>3. Trường THPT:</strong>
              <span style={{ borderBottom: "1px dotted #000", flex: 1, paddingLeft: 6 }}>
                {a.highSchoolName || "THPT Chuyên Hà Nội - Amsterdam"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
              <div style={{ display: "flex", flex: 1, gap: 4 }}>
                <span>TP/Quận/Huyện:</span>
                <span style={{ borderBottom: "1px dotted #000", flex: 1, paddingLeft: 4 }}>{a.highSchoolDistrict || "Cầu Giấy"}</span>
              </div>
              <div style={{ display: "flex", flex: 1, gap: 4 }}>
                <span>Tỉnh/TP:</span>
                <span style={{ borderBottom: "1px dotted #000", flex: 1, paddingLeft: 4 }}>{a.highSchoolProvince || "Hà Nội"}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Graduation Year */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <strong>4. Năm tốt nghiệp THPT:</strong>
            <div style={{ display: "flex", gap: 3 }}>
              {["2", "0", "2", "6"].map((d, i) => (
                <span key={i} style={{
                  width: 22, height: 24, border: "1px solid #000",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontWeight: "bold", fontSize: 13
                }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: CCCD */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <strong>5. Số CMND/CCCD:</strong>
              <div style={{ display: "flex", gap: 2 }}>
                {cccdDigits.map((d, i) => (
                  <span key={i} style={{
                    width: 20, height: 22, border: "1px solid #000",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "bold", fontSize: 12
                  }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
              <span>cấp ngày: <strong>{p.citizenIssueDate || "10/09/2022"}</strong></span>
              <span>tại: <strong>{p.citizenIssuePlace || "Cục Cảnh sát QLHC về TTXH"}</strong></span>
            </div>
          </div>

          {/* Section 6: Contact Info */}
          <div style={{ marginBottom: 12 }}>
            <strong>6. Liên lạc (Họ và tên):</strong> <span style={{ fontWeight: "bold" }}>{p.fullName || "Nguyễn Văn An"}</span>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              <span>Địa chỉ:</span>
              <span style={{ borderBottom: "1px dotted #000", flex: 1, paddingLeft: 4 }}>{p.permanentAddress || "Số 8 Tôn Thất Thuyết"}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 4 }}>
              <div>Phường/Xã: <strong>{p.permanentWard || "Dịch Vọng Hậu"}</strong></div>
              <div>Quận/Huyện: <strong>{p.permanentDistrict || "Cầu Giấy"}</strong></div>
              <div>Tỉnh/TP: <strong>{p.permanentProvince || "Hà Nội"}</strong></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 12, marginTop: 4 }}>
              <div>ĐT di động (bắt buộc): <strong>{p.phone || "0912345678"}</strong></div>
              <div>Số ĐT khác: <strong>{p.backupPhone || "0987654321"}</strong></div>
            </div>
            <div style={{ marginTop: 4 }}>
              Email (bắt buộc): <strong>{p.email || "nguyenvanan.fpt@gmail.com"}</strong>
            </div>
          </div>

          {/* Section 7: Major Selection Table */}
          <div style={{ marginBottom: 14 }}>
            <strong>7. Đăng ký học ngành:</strong> <span style={{ fontStyle: "italic", fontSize: 12 }}>&lt;Thí sinh chỉ đăng ký một chuyên ngành học&gt;</span>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 6, fontSize: 12, border: "1px solid #000" }}>
              <thead>
                <tr style={{ background: "#F1F5F9" }}>
                  <th style={{ border: "1px solid #000", padding: "4px 8px", width: "50%", textAlign: "left" }}>
                    <strong>7.1. Quản trị kinh doanh</strong>
                  </th>
                  <th style={{ border: "1px solid #000", padding: "4px 8px", width: "50%", textAlign: "left" }}>
                    <strong>7.2. Công nghệ thông tin</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px 8px", verticalAlign: "top" }}>
                    <div>☐ &lt;Digital Marketing&gt;</div>
                    <div>☐ &lt;Kinh doanh quốc tế&gt;</div>
                    <div>☐ &lt;Logistic và quản lý chuỗi cung ứng&gt;</div>
                    <div>☐ &lt;Quản trị khách sạn&gt;</div>
                    <div>☐ &lt;Tài chính&gt;</div>
                    <div>☐ &lt;Quản trị dịch vụ du lịch &amp; lữ hành&gt;</div>
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 8px", verticalAlign: "top" }}>
                    <div>☐ &lt;Thiết kế Mỹ thuật số&gt;</div>
                    <div style={{ fontWeight: "bold", color: "#B45309" }}>☑ &lt;Kỹ thuật phần mềm&gt; (Đã chọn)</div>
                    <div>☐ &lt;Trí tuệ nhân tạo&gt;</div>
                    <div>☐ &lt;An toàn thông tin&gt;</div>
                    <div>☐ &lt;Hệ thống thông tin&gt;</div>
                    <div>☐ &lt;Công nghệ ô tô số&gt;</div>
                  </td>
                </tr>
                <tr style={{ background: "#F1F5F9" }}>
                  <th colSpan={2} style={{ border: "1px solid #000", padding: "4px 8px", textAlign: "left" }}>
                    <strong>7.3. Công nghệ truyền thông:</strong> ☐ &lt;Truyền thông đa phương tiện&gt; &nbsp;&nbsp;&nbsp; ☐ &lt;Quan hệ công chúng&gt;
                  </th>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    <strong>7.4. Ngôn ngữ Anh:</strong> ☐ &lt;Ngôn ngữ Anh&gt;
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    <strong>7.5. Ngôn ngữ Nhật:</strong> ☐ &lt;Song ngữ Nhật - Anh&gt;
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    <strong>7.6. Ngôn ngữ Hàn Quốc:</strong> ☐ &lt;Song ngữ Hàn - Anh&gt;
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    <strong>7.7. Ngôn ngữ Trung Quốc:</strong> ☐ &lt;Song ngữ Trung - Anh&gt;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 8: Campus Location */}
          <div style={{ marginBottom: 14 }}>
            <strong>8. Đăng ký học tại:</strong>
            <div style={{ display: "flex", gap: 18, marginTop: 4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontWeight: "bold" }}>☑</span> Hà Nội
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span>☐</span> TP. Hồ Chí Minh
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span>☐</span> Đà Nẵng
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span>☐</span> Cần Thơ
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span>☐</span> Quy Nhơn
              </label>
            </div>
          </div>

          {/* Section 9: Eligibility Criteria */}
          <div style={{ marginBottom: 16 }}>
            <strong>9. Điều kiện trúng tuyển:</strong>
            <div style={{ fontSize: 12, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>
              <div>
                <strong>Xếp hạng học sinh THPT năm 2026:</strong>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <span>☑ Đạt xếp hạng Top40 theo học bạ THPT năm 2026</span>
                  <span>Mã hồ sơ: <strong>{application?.applicationId || "FPT-2026-894120"}</strong></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                  <span>☐ Đạt xếp hạng Top50 theo học bạ THPT năm 2026 đối với Thế hệ 1</span>
                  <span>Mã hồ sơ: ................................</span>
                </div>
              </div>

              <div style={{ marginTop: 4 }}>
                <strong>Xét tuyển thẳng:</strong>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 4, marginTop: 2 }}>
                  <div>☐ Tuyển thẳng</div>
                  <div>☐ HSK từ cấp độ 4 trở lên</div>
                  <div>☐ TOPIK II (Cấp độ 4)</div>
                  <div>☐ Tốt nghiệp Đại học</div>
                  <div>☐ JLPT (N3)</div>
                  <div style={{ fontWeight: "bold", color: "#16A34A" }}>☑ IELTS/TOEFL/VSTEP (IELTS 7.0)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Signature Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24, paddingTop: 10, borderTop: "1px solid #E2E8F0" }}>
            <div style={{ textAlign: "center", minWidth: 200 }}>
              <div style={{ fontSize: 12, color: "#059669", fontWeight: "bold" }}>
                ✓ ĐÃ XÁC THỰC BỞI CÁN BỘ TUYỂN SINH
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                Hội đồng Tuyển sinh Đại học FPT
              </div>
              <div style={{
                marginTop: 6, padding: "4px 8px", background: "#ECFDF5",
                borderRadius: 4, border: "1px solid #A7F3D0", fontSize: 10, fontFamily: "monospace", color: "#065F46"
              }}>
                DIGITAL_SIGNED: FPTU_ADMISSION_AUTH
              </div>
            </div>

            <div style={{ textAlign: "center", minWidth: 220 }}>
              <div style={{ fontStyle: "italic", fontSize: 12 }}>
                Ngày {signatureDate.split("/")[0] || "19"} tháng {signatureDate.split("/")[1] || "08"} năm 2026
              </div>
              <div style={{ fontWeight: "bold", marginTop: 4, fontSize: 13 }}>
                Chữ ký thí sinh
              </div>
              <div style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", color: "#1D4ED8", fontWeight: "bold" }}>
                {hasSigned ? p.fullName || "Nguyễn Văn An" : "(Bấm nút bên dưới để ký nộp)"}
              </div>
              <div style={{ fontSize: 12, fontWeight: "bold" }}>{p.fullName || "Nguyễn Văn An"}</div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div style={{
          padding: "14px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0
        }}>
          <div style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={16} color="#16A34A" />
            Phiếu đăng ký đã điền sẵn tự động từ dữ liệu hồ sơ đã duyệt.
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid #CBD5E1",
                background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer"
              }}
            >
              Đóng lại
            </button>
            <button
              onClick={handleConfirm}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 20px",
                borderRadius: 8, background: "#16A34A", color: "#FFF",
                border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer",
                boxShadow: "0 2px 8px rgba(22,163,74,0.3)"
              }}
            >
              <CheckCircle2 size={16} /> Ký &amp; Xác Nhận Nộp Phiếu Nhập Học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
