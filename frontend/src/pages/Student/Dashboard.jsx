import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/axiosConfig";
import {
  GraduationCap, BookOpen, DollarSign, Video, Book, User,
  Bell, Clock, Calendar, CheckCircle2, AlertTriangle, ArrowRight,
  TrendingUp, Award, QrCode, Sparkles, Download, ShieldCheck,
  ExternalLink, ChevronRight, FileText, Bookmark
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock Student DW Data
  const studentInfo = {
    name: user?.fullName || "Nguyễn Minh Khoa",
    code: "HS172345",
    major: "Kỹ thuật phần mềm (Software Engineering)",
    faculty: "Khoa Công nghệ thông tin",
    campus: "FPT Hà Nội (Hoà Lạc)",
    classCode: "SE1715",
    gpa: 3.67,
    credits: "42 / 150",
    status: "Đang theo học",
    term: "Fall 2026 (Học kỳ 4)"
  };

  const scheduleToday = [
    { time: "07:30 - 09:50", subject: "Trí tuệ nhân tạo (AIB201)", room: "BE-302", lecturer: "TS. Nguyễn Hải Đăng", status: "Sắp diễn ra" },
    { time: "10:00 - 12:20", subject: "Kiểm thử phần mềm (SWR302)", room: "AL-204", lecturer: "ThS. Trần Thị Bình", status: "Chưa bắt đầu" },
    { time: "13:30 - 15:50", subject: "Internet of Things (IOT301)", room: "Lab IoT 02", lecturer: "Dr. Lê Minh Cường", status: "Chưa bắt đầu" }
  ];

  const financialSummary = {
    tuitionTerm: "29.700.000 đ",
    paid: "15.000.000 đ",
    debt: "14.700.000 đ",
    dueDate: "30/08/2026",
    scholarship: "Học bổng 100% Thủ khoa kỳ Fall"
  };

  const lmsTasks = [
    { task: "Nộp Assignment 2: CNN Image Classification", course: "AIB201", deadline: "23:59 Hôm nay", urgent: true },
    { task: "Quiz 3: Test Automation with Selenium", course: "SWR302", deadline: "18/08/2026", urgent: false },
    { task: "Báo cáo tiến độ Capstone Project 1", course: "CAP201", deadline: "22/08/2026", urgent: false }
  ];

  const libraryBooks = [
    { title: "Clean Code: A Handbook of Agile Software", author: "Robert C. Martin", dueDate: "25/08/2026", isOverdue: false },
    { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", dueDate: "15/08/2026", isOverdue: true }
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* ── Welcome Banner & Digital Student Card ── */}
      <div style={{
        background: "linear-gradient(135deg, #0d1b3e 0%, #1a3a6c 50%, #2b4c8c 100%)",
        borderRadius: 24, padding: "28px 32px", color: "#fff", marginBottom: 28,
        position: "relative", overflow: "hidden", boxShadow: "0 12px 30px rgba(13,27,62,0.25)"
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 70%)" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, position: "relative" }}>
          {/* Left Info */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 76, height: 76, borderRadius: 20, background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900,
              boxShadow: "0 6px 18px rgba(255,107,53,0.45)", border: "3px solid rgba(255,255,255,0.2)"
            }}>
              {studentInfo.name.split(" ").pop()[0]}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, color: "#fff" }}>{studentInfo.name}</h1>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#10B981", color: "#fff" }}>
                  {studentInfo.status}
                </span>
              </div>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", margin: "0 0 6px 0" }}>
                MSSV: <strong style={{ color: "#FF8C5A" }}>{studentInfo.code}</strong> • Lớp: {studentInfo.classCode} • {studentInfo.campus}
              </p>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.65)" }}>
                {studentInfo.major} • {studentInfo.term}
              </div>
            </div>
          </div>

          {/* Quick Stats on Card */}
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontWeight: 700 }}>GPA Tích Lũy</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8", marginTop: 2 }}>{studentInfo.gpa}</div>
              <div style={{ fontSize: 10.5, color: "#4ADE80" }}>Hạng Giỏi (Top 5%)</div>
            </div>
            <div style={{ padding: "12px 18px", borderRadius: 14, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontWeight: 700 }}>Tín Chỉ Tích Lũy</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#FB923C", marginTop: 2 }}>{studentInfo.credits}</div>
              <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)" }}>Tiến độ 28%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Quick Shortcuts to DW Features ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
        {[
          { title: "Kết Quả Học Tập", desc: "Xem bảng điểm, GPA, lịch thi & chuyên cần", icon: BookOpen, path: "/student/academic-records", color: "#2563EB", bg: "#EFF6FF", fact: "FACT_LEARNING" },
          { title: "Tài Chính & Học Phí", desc: "Hạn nộp học phí, học bổng & công nợ", icon: DollarSign, path: "/student/financial", color: "#16A34A", bg: "#F0FDF4", fact: "FACT_FINANCE" },
          { title: "LMS & Thư Viện", desc: "Khóa học trực tuyến, bài tập & sách mượn", icon: Video, path: "/student/learning-resources", color: "#7C3AED", bg: "#F5F3FF", fact: "FACT_LMS / LIB" },
          { title: "Hồ Sơ Sinh Viên", desc: "Thông tin định danh, văn bằng & bảo trợ", icon: User, path: "/student/profile", color: "#FF6B35", bg: "#FFF7F4", fact: "DIM_STUDENT" }
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            style={{
              background: item.bg, borderRadius: 18, padding: "20px 22px", border: `1.5px solid ${item.color}25`,
              cursor: "pointer", transition: "all 0.25s ease", position: "relative"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 10px 24px ${item.color}25`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${item.color}40` }}>
                <item.icon size={22} color="#fff" />
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#fff", color: item.color, border: `1px solid ${item.color}30` }}>
                {item.fact}
              </span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>{item.title}</h3>
            <p style={{ fontSize: 12.5, color: "#64748B", margin: "0 0 12px 0", lineHeight: 1.4 }}>{item.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: item.color }}>
              Truy cập ngay <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid: Schedule & LMS / Finance ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left Column: Schedule Today & Learning Progress */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Schedule Today */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar size={18} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Lịch Học Hôm Nay (Thứ Hai, 17/08/2026)</h3>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Hệ thống đào tạo FAP • Đồng bộ realtime</p>
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", background: "#DBEAFE", padding: "4px 10px", borderRadius: 100 }}>
                3 Ca học
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {scheduleToday.map((slot, idx) => (
                <div key={idx} style={{
                  padding: "16px 18px", borderRadius: 14, background: idx === 0 ? "#FFF7F4" : "#F8FAFC",
                  border: `1.5px solid ${idx === 0 ? "#FF6B35" : "#E2E8F0"}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: idx === 0 ? "#FF6B35" : "#2563EB", background: "#fff", padding: "2px 8px", borderRadius: 6 }}>
                        {slot.time}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Phòng {slot.room}</span>
                    </div>
                    <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0F172A" }}>{slot.subject}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>GV: {slot.lecturer}</div>
                  </div>

                  <span style={{
                    fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 100,
                    background: idx === 0 ? "#FFEDD5" : "#F1F5F9", color: idx === 0 ? "#C2410C" : "#64748B"
                  }}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding Learning Tasks (FACT_LMS) */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bookmark size={18} color="#7C3AED" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Nhiệm Vụ Học Tập LMS Cần Hoàn Thành</h3>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Khai thác từ FACT_LMS & Coursera FPT</p>
                </div>
              </div>
              <Link to="/student/learning-resources" style={{ fontSize: 12.5, fontWeight: 700, color: "#7C3AED", textDecoration: "none" }}>
                Xem tất cả →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lmsTasks.map((t, idx) => (
                <div key={idx} style={{ padding: "14px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{t.task}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Môn học: <strong>{t.course}</strong></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: t.urgent ? "#DC2626" : "#475569", background: t.urgent ? "#FEF2F2" : "#F1F5F9", padding: "3px 8px", borderRadius: 6 }}>
                      {t.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Alert & Library Books */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Financial Box (FACT_FINANCE) */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DollarSign size={18} color="#16A34A" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Học Phí & Học Bổng (FACT_FINANCE)</h3>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Học kỳ Fall 2026</p>
                </div>
              </div>
            </div>

            <div style={{ padding: 16, background: "#FFFBEB", borderRadius: 14, border: "1px solid #FDE68A", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#92400E", marginBottom: 4 }}>
                <span>Còn cần thanh toán đợt 2:</span>
                <strong style={{ fontSize: 16, color: "#B45309" }}>{financialSummary.debt}</strong>
              </div>
              <div style={{ fontSize: 12, color: "#B45309" }}>Hạn chót: <strong>{financialSummary.dueDate}</strong></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                <span>Học phí cả kỳ:</span>
                <strong style={{ color: "#0F172A" }}>{financialSummary.tuitionTerm}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                <span>Đã nộp đợt 1:</span>
                <strong style={{ color: "#16A34A" }}>{financialSummary.paid}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                <span>Học bổng áp dụng:</span>
                <strong style={{ color: "#7C3AED" }}>{financialSummary.scholarship}</strong>
              </div>
            </div>

            <button
              onClick={() => navigate("/student/financial")}
              style={{
                width: "100%", padding: "11px", borderRadius: 12, background: "linear-gradient(135deg, #16A34A, #15803D)",
                color: "#fff", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
              }}
            >
              Thanh Toán Học Phí Trực Tuyến
            </button>
          </div>

          {/* Library Borrowing (FACT_LIBRARY) */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Book size={18} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Thư Viện Số (FACT_LIBRARY)</h3>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Sách đang mượn & CSDL trực tuyến</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {libraryBooks.map((b, idx) => (
                <div key={idx} style={{ padding: "12px 14px", borderRadius: 12, background: b.isOverdue ? "#FEF2F2" : "#F8FAFC", border: `1px solid ${b.isOverdue ? "#FCA5A5" : "#E2E8F0"}` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{b.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, fontSize: 11.5 }}>
                    <span style={{ color: "#64748B" }}>{b.author}</span>
                    <span style={{ fontWeight: 700, color: b.isOverdue ? "#DC2626" : "#16A34A" }}>
                      {b.isOverdue ? `⚠️ Quá hạn (${b.dueDate})` : `Hạn: ${b.dueDate}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
