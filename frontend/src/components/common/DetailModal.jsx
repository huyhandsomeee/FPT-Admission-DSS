import React from "react";
import { X, User, BookOpen, FileText, MapPin, Phone, Calendar, Award } from "lucide-react";
import { getFilePreviewUrl } from "../../utils/fileUtils";
import { formatDateDisplay } from "../../utils/dateUtils";
import StatusBadge from "./StatusBadge";

const Section = ({ icon: Icon, title, color = "#FF6B35", children }) => (
  <div style={{ border: "1px solid #F1F5F9", borderRadius: 14, overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", background: `${color}0d`, borderBottom: "1px solid #F1F5F9" }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={15} color={color} />
      </div>
      <span style={{ fontWeight: 700, fontSize: 13, color: "#1E293B", textTransform: "uppercase", letterSpacing: "0.04em" }}>{title}</span>
    </div>
    <div style={{ padding: "16px 18px" }}>{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
    <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
    <span style={{ fontSize: 14, color: "#1E293B", fontWeight: 500 }}>{value || "—"}</span>
  </div>
);

const docStatusStyle = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "verified" || s === "uploaded") return { bg: "#D1FAE5", color: "#065F46", label: "Đã duyệt" };
  if (s === "rejected") return { bg: "#FEE2E2", color: "#991B1B", label: "Từ chối" };
  return { bg: "#FEF3C7", color: "#92400E", label: "Chờ duyệt" };
};

export default function DetailModal({ show, onClose, appDetail, loading }) {
  if (!show) return null;
  const bg = appDetail?.academicBackground;
  const isHocBa = appDetail?.methodName?.toLowerCase().includes("học bạ");
  const totalGpa = bg ? ((parseFloat(bg.gpa10) || 0) + (parseFloat(bg.gpa11) || 0) + (parseFloat(bg.gpa12) || 0)).toFixed(2) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#F8FAFC", borderRadius: 24, width: "100%", maxWidth: 720, maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #FF6B35, #E85A2A)", padding: "22px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ color: "white", fontWeight: 900, fontSize: 18, letterSpacing: "0.5px" }}>Chi tiết hồ sơ đăng ký</div>
            {appDetail && <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 3, fontWeight: 600 }}>Mã HS: {appDetail.applicationCode}</div>}
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", color: "white", display: "flex", transition: "all 0.2s" }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {loading ? (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#94A3B8" }}>
              <div style={{ width: 36, height: 36, border: "3px solid #FF6B35", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              Đang tải dữ liệu hồ sơ...
            </div>
          ) : appDetail ? (
            <>
              {/* Status bar */}
              <div style={{ background: "white", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid #F1F5F9" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>{appDetail.majorName}</div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{appDetail.campusName} • {appDetail.methodName}</div>
                </div>
                <StatusBadge status={appDetail.status} />
              </div>

              {/* Thông tin cá nhân */}
              <Section icon={User} title="Thông tin cá nhân">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
                  <Field label="Họ và tên" value={appDetail.fullName} />
                  <Field label="Ngày sinh" value={formatDateDisplay(appDetail.dob)} />
                  <Field label="Giới tính" value={appDetail.gender === "MALE" ? "Nam" : "Nữ"} />
                  <Field label="CCCD/CMND" value={appDetail.cccd} />
                  <Field label="Số điện thoại" value={appDetail.phone} />
                  <Field label="Họ tên phụ huynh" value={appDetail.parentName} />
                  <Field label="SĐT phụ huynh" value={appDetail.parentPhone} />
                  <Field label="Địa chỉ" value={appDetail.permanentAddress} />
                </div>
              </Section>

              {/* Lịch sử tiến trình hồ sơ */}
              <Section icon={Calendar} title="Lịch sử tiến trình hồ sơ" color="#FF6B35">
                <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", paddingLeft: 12 }}>
                  <div style={{ position: "absolute", left: 16, top: 12, bottom: 12, width: 2, background: "#E2E8F0", zIndex: 0 }} />
                  {[
                    { label: "Ngày nộp hồ sơ", val: appDetail.submittedAt, desc: "Thí sinh gửi hồ sơ xét tuyển lên hệ thống." },
                    { label: "Ngày được duyệt sơ bộ", val: appDetail.reviewedAt, desc: "Cán bộ tuyển sinh phê duyệt học bạ đủ điều kiện trúng tuyển." },
                    { label: "Ngày xác nhận đăng ký nguyện vọng Bộ", val: appDetail.moetRegisteredAt, desc: "Xác nhận đã đặt Đại học FPT làm nguyện vọng trên cổng Bộ GD&ĐT." },
                    { label: "Ngày Bộ công bố kết quả lọc ảo", val: appDetail.moetReleasedAt, desc: "Dữ liệu lọc ảo của Bộ xác nhận trúng tuyển chính thức." },
                    { label: "Ngày xác nhận nhập học", val: appDetail.enrolledAt, desc: "Thí sinh thực hiện cam kết nhập học trực tuyến." },
                    { label: "Ngày nộp học phí", val: appDetail.feePaidAt, desc: "Cổng thanh toán ghi nhận giao dịch nộp học phí thành công." }
                  ].map((step, idx) => {
                    const hasDate = !!step.val;
                    const dateStr = hasDate ? new Date(step.val).toLocaleString("vi-VN") : "Chưa hoàn thành";
                    return (
                      <div key={idx} style={{ display: "flex", gap: 16, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                        <div style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: hasDate ? "#FF6B35" : "#CBD5E1",
                          border: "3px solid white",
                          boxShadow: "0 0 0 3px " + (hasDate ? "rgba(255,107,53,0.15)" : "transparent"),
                          marginTop: 4, flexShrink: 0
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: hasDate ? "#1E293B" : "#94A3B8" }}>{step.label}</div>
                          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{step.desc}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: hasDate ? "#FF6B35" : "#94A3B8", marginTop: 4 }}>
                            {hasDate ? `⏱️ ${dateStr}` : "—"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* Kết quả học tập */}
              {bg && (
                <Section icon={BookOpen} title="Kết quả học tập" color="#2563EB">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px", marginBottom: 14 }}>
                    <Field label="Trường THPT" value={bg.schoolName} />
                    <Field label="Năm tốt nghiệp" value={bg.graduationYear} />
                  </div>

                  {isHocBa ? (
                    /* Học bạ: chỉ hiện GPA 10/11/12 + tổng */
                    <div style={{ background: "#EFF6FF", borderRadius: 12, padding: "14px 16px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#1D4ED8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Bảng điểm học bạ</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                        {[["GPA Lớp 10", bg.gpa10], ["GPA Lớp 11", bg.gpa11], ["GPA Lớp 12", bg.gpa12]].map(([label, val]) => (
                          <div key={label} style={{ background: "white", borderRadius: 10, padding: "12px 14px", textAlign: "center", border: "1px solid #BFDBFE" }}>
                            <div style={{ fontSize: 11, color: "#64748B", marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: 22, fontWeight: 800, color: "#2563EB" }}>{val ?? "—"}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "linear-gradient(135deg, #FF6B35, #E85A2A)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Tổng điểm xét tuyển (GPA 10+11+12)</span>
                        <span style={{ color: "white", fontWeight: 900, fontSize: 22 }}>{totalGpa}</span>
                      </div>
                    </div>
                  ) : (
                    /* Các phương thức khác */
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
                      {bg.mathScore != null && <Field label="Điểm Toán" value={bg.mathScore} />}
                      {bg.literatureScore != null && <Field label="Điểm Ngữ văn" value={bg.literatureScore} />}
                      {bg.englishScore != null && <Field label="Điểm Tiếng Anh" value={bg.englishScore} />}
                      {bg.ieltsScore != null && <Field label="IELTS" value={bg.ieltsScore} />}
                      {bg.satScore != null && <Field label="SAT" value={bg.satScore} />}
                      {bg.totalScore != null && (
                        <div style={{ gridColumn: "1/-1", background: "#FFF7F4", border: "1px solid #FFEDD5", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontWeight: 700, color: "#C2410C" }}>Tổng điểm xét tuyển</span>
                          <span style={{ fontWeight: 900, fontSize: 18, color: "#FF6B35" }}>{bg.totalScore}</span>
                        </div>
                      )}
                    </div>
                  )}
                </Section>
              )}

              {/* Thông tin xác nhận đăng ký nguyện vọng */}
              {appDetail.preferenceConfirmation && (
                <Section icon={Award} title="Thông tin xác nhận đăng ký nguyện vọng" color="#3B82F6">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 24px" }}>
                    <Field label="Ngày xác nhận" value={new Date(appDetail.preferenceConfirmation.confirmationDate).toLocaleString("vi-VN")} />
                    <Field label="Thứ tự nguyện vọng" value={`Nguyện vọng ${appDetail.preferenceConfirmation.preferenceOrder}`} />
                    <Field label="Ngành đã đăng ký" value={appDetail.preferenceConfirmation.majorName} />
                    <Field label="Mã ngành" value={appDetail.preferenceConfirmation.majorCode} />
                    {appDetail.preferenceConfirmation.note && (
                      <div style={{ gridColumn: "1/-1" }}>
                        <Field label="Ghi chú của sinh viên" value={appDetail.preferenceConfirmation.note} />
                      </div>
                    )}
                    {appDetail.preferenceConfirmation.evidenceImage && (
                      <div style={{ gridColumn: "1/-1", display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Minh chứng đăng ký</span>
                        <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden", maxWidth: 300 }}>
                          <img src={appDetail.preferenceConfirmation.evidenceImage} alt="Minh chứng nguyện vọng" style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Tài liệu */}
              {appDetail.documents?.length > 0 && (
                <Section icon={FileText} title="Tài liệu minh chứng" color="#7C3AED">
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {appDetail.documents.map((doc, idx) => {
                      const ds = docStatusStyle(doc.status);
                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{doc.desc || doc.name}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{doc.name}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: ds.bg, color: ds.color }}>{ds.label}</span>
                            {doc.filePath && (
                              <a href={getFilePreviewUrl(doc.filePath)} target="_blank" rel="noreferrer"
                                style={{ fontSize: 12, color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>Xem file</a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}
            </>
          ) : (
            <div style={{ padding: "60px 0", textAlign: "center", color: "#EF4444" }}>Không tìm thấy thông tin chi tiết.</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 28px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end", background: "white", flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ padding: "11px 28px", background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background 0.2s" }}
            onMouseOver={e => e.target.style.background = "#E2E8F0"}
            onMouseOut={e => e.target.style.background = "#F1F5F9"}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
