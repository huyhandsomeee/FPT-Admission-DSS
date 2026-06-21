import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, XCircle, Clock, User, FileText, 
  ChevronDown, Eye, ExternalLink, Download, AlertCircle, File
} from "lucide-react";
import api from "../../../config/axiosConfig";

const MOCK_DOCS = [
  { name: "Học bạ THPT", desc: "Học bạ lên", status: "uploaded" },
  { name: "CCCD/CMND", desc: "Ảnh CCCD 2 mặt", status: "uploaded" },
  { name: "Chứng chỉ Tiếng Anh", desc: "Chứng chỉ IELTS/SAT", status: "pending" },
];

const DECISION_OPTIONS = ["Duyệt", "Bổ sung", "Từ chối"];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Application details
  const [app, setApp] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true);
  
  // Evaluation States
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [decision, setDecision] = useState("Duyệt");
  
  // UI States
  const [showDecisionDropdown, setShowDecisionDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [activeTab, setActiveTab] = useState("transcript"); // "transcript" or "document"
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    setLoadingApp(true);
    api.get(`/api/officer/applications/${id}`)
      .then(r => {
        if (r.data) {
          const data = r.data;
          setApp(data);
          
          if (data.documents && data.documents.length > 0) {
            setDocs(data.documents);
            // Default select the first document that has a filePath
            const firstValidDoc = data.documents.find(d => d.filePath);
            if (firstValidDoc) {
              setSelectedDoc(firstValidDoc);
            }
          } else {
            setDocs(MOCK_DOCS);
          }
          
          if (data.officerNotes) {
            setNotes(data.officerNotes);
          }
          if (data.rejectionReason) {
            setRejectionReason(data.rejectionReason);
          }
          if (data.totalScore !== null && data.totalScore !== undefined) {
            setScore(data.totalScore);
          }
          
          if (data.status) {
            const statusLabelMap = { 
              "APPROVED": "Duyệt", 
              "UNDER_REVIEW": "Bổ sung", 
              "REJECTED": "Từ chối",
              "SUBMITTED": "Duyệt" // Default choice for newly submitted apps
            };
            setDecision(statusLabelMap[data.status] || "Duyệt");
          }
        }
      })
      .catch(err => {
        console.error("Lỗi khi tải chi tiết hồ sơ:", err);
      })
      .finally(() => setLoadingApp(false));
  }, [id]);

  const handleSave = async () => {
    const statusMap = { "Duyệt": "APPROVED", "Bổ sung": "UNDER_REVIEW", "Từ chối": "REJECTED" };
    const status = statusMap[decision] || "UNDER_REVIEW";

    // Form validations based on decision
    if (status === "REJECTED" && !rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối hồ sơ.");
      return;
    }
    if (status === "UNDER_REVIEW" && !notes.trim()) {
      alert("Vui lòng nhập lý do/yêu cầu tài liệu bổ sung.");
      return;
    }

    setLoading(true);
    setAction(status);

    const payload = {
      status,
      notes: status === "REJECTED" ? "" : notes,
      reason: status === "REJECTED" ? rejectionReason : "",
      score: score
    };

    try {
      await api.patch(`/api/officer/applications/${id}/status`, payload);
      navigate("/officer/applicants");
    } catch (err) {
      console.error("Lỗi khi cập nhật đánh giá:", err);
      alert(err.response?.data?.message || "Không thể lưu đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (status) => {
    const statusLabelMap = { "APPROVED": "Duyệt", "UNDER_REVIEW": "Bổ sung", "REJECTED": "Từ chối" };
    setDecision(statusLabelMap[status] || "Duyệt");
    // Scroll to evaluation panel
    const element = document.getElementById("evaluation-panel");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectDoc = (doc) => {
    if (doc.filePath) {
      setSelectedDoc(doc);
      setActiveTab("document");
    }
  };

  if (loadingApp || !app) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "4px solid #F1F5F9", borderTop: "4px solid #FF6B35", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: "15px", color: "#64748B", fontWeight: 600 }}>Đang tải dữ liệu hồ sơ thí sinh...</span>
      </div>
    );
  }

  // Determine file url and format
  const getFilePreviewUrl = (filePath) => {
    if (!filePath) return "";
    return filePath.startsWith("http") ? filePath : `http://localhost:8081${filePath}`;
  };

  const isPdfFile = (filePath) => {
    if (!filePath) return false;
    return filePath.toLowerCase().endsWith(".pdf");
  };

  const isImgFile = (filePath) => {
    if (!filePath) return false;
    const pathLower = filePath.toLowerCase();
    return pathLower.endsWith(".png") || pathLower.endsWith(".jpg") || pathLower.endsWith(".jpeg") || pathLower.endsWith(".webp") || pathLower.endsWith(".gif");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto", padding: "12px 16px" }}>

      {/* Back + Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "white", border: "1px solid #E2E8F0",
              borderRadius: 10, padding: "8px 16px",
              fontSize: 13, fontWeight: 700, color: "#475569",
              cursor: "pointer", transition: "all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <div>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>Đánh Giá Hồ Sơ Xét Tuyển</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748B" }}>Cập nhật điểm số và duyệt trạng thái hồ sơ</p>
          </div>
        </div>

        {/* Current status badge */}
        <div style={{
          padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700,
          background: app.status === "APPROVED" ? "#ECFDF5" : app.status === "REJECTED" ? "#FEF2F2" : app.status === "UNDER_REVIEW" ? "#FFFBEB" : "#EFF6FF",
          color: app.status === "APPROVED" ? "#059669" : app.status === "REJECTED" ? "#DC2626" : app.status === "UNDER_REVIEW" ? "#D97706" : "#2563EB"
        }}>
          Trạng thái hiện tại: {
            app.status === "APPROVED" ? "Đã duyệt" : 
            app.status === "REJECTED" ? "Từ chối" : 
            app.status === "UNDER_REVIEW" ? "Yêu cầu bổ sung" : 
            app.status === "SUBMITTED" ? "Chờ xét duyệt" : app.status
          }
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "flex-start" }}>

        {/* Left Column: Interactive Viewer & Candidate Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Document Workstation Viewer */}
          <div style={{
            background: "white", borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflow: "hidden"
          }}>
            {/* Tabs Selector Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 16px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0"
            }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setActiveTab("transcript")}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700,
                    background: activeTab === "transcript" ? "#FF6B35" : "transparent",
                    color: activeTab === "transcript" ? "white" : "#64748B",
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: activeTab === "transcript" ? "0 2px 8px rgba(255,107,53,0.25)" : "none"
                  }}>
                  Bảng điểm học bạ
                </button>
                <button
                  onClick={() => {
                    if (selectedDoc) {
                      setActiveTab("document");
                    } else if (docs.length > 0 && docs[0].filePath) {
                      setSelectedDoc(docs[0]);
                      setActiveTab("document");
                    } else {
                      alert("Thí sinh chưa đính kèm tệp tài liệu nào.");
                    }
                  }}
                  style={{
                    padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700,
                    background: activeTab === "document" ? "#FF6B35" : "transparent",
                    color: activeTab === "document" ? "white" : "#64748B",
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: activeTab === "document" ? "0 2px 8px rgba(255,107,53,0.25)" : "none"
                  }}>
                  Tài liệu minh chứng {selectedDoc ? `(${selectedDoc.desc || selectedDoc.name})` : ""}
                </button>
              </div>

              {/* View options when document tab is active */}
              {activeTab === "document" && selectedDoc && selectedDoc.filePath && (
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={getFilePreviewUrl(selectedDoc.filePath)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 4, padding: "6px 12px",
                      borderRadius: 6, background: "white", border: "1px solid #CBD5E1",
                      fontSize: 11, fontWeight: 700, color: "#475569", textDecoration: "none",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}>
                    <ExternalLink size={12} /> Cửa sổ mới
                  </a>
                </div>
              )}
            </div>

            {/* Display Pane */}
            <div style={{ background: "#404040", minHeight: "560px", position: "relative" }}>
              
              {/* Tab 1: Transcript Paper Sheet View */}
              {activeTab === "transcript" && (
                <div style={{ padding: "30px 20px", display: "flex", justifyContent: "center" }}>
                  <div style={{
                    background: "white", width: "100%", maxWidth: "600px", borderRadius: 6,
                    padding: "36px 40px", boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
                    boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif"
                  }}>
                    {/* Header of paper */}
                    <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "2px double #E2E8F0", paddingBottom: 16 }}>
                      <div style={{ fontSize: 11, color: "#374151", fontWeight: 600, letterSpacing: 0.5 }}>
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                        <span style={{ borderBottom: "1px solid #374151", display: "inline-block", width: "120px", marginTop: 4 }}>Độc lập - Tự do - Hạnh phúc</span>
                      </div>
                      <div style={{ marginTop: 18, fontSize: 16, fontWeight: 800, color: "#0F172A" }}>BẢNG ĐIỂM CHI TIẾT HỒ SƠ TUYỂN SINH</div>
                      <div style={{ fontSize: 11, color: "#64748B", marginTop: 6 }}>Mã hồ sơ đăng ký: <strong>{app.applicationCode}</strong></div>
                    </div>

                    {/* School Information */}
                    {app.academicBackground ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ fontSize: 13, color: "#334155", display: "flex", flexDirection: "column", gap: 6 }}>
                          <div>• Trường trung học phổ thông: <strong>{app.academicBackground.schoolName || "N/A"}</strong></div>
                          <div>• Năm tốt nghiệp: <strong>{app.academicBackground.graduationYear || "N/A"}</strong></div>
                        </div>

                        {/* Grades Table */}
                        <div style={{ marginTop: 8 }}>
                          <h4 style={{ margin: "0 0 8px", fontSize: 12, color: "#475569", fontWeight: 700 }}>BẢNG ĐIỂM CHI TIẾT:</h4>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, border: "1px solid #CBD5E1" }}>
                            <thead>
                              <tr style={{ background: "#F1F5F9" }}>
                                <th style={{ padding: "8px 12px", textAlign: "left", border: "1px solid #CBD5E1", color: "#1E293B", fontWeight: 700 }}>Hạng mục môn học / Học lực</th>
                                <th style={{ padding: "8px 12px", textAlign: "right", border: "1px solid #CBD5E1", color: "#1E293B", fontWeight: 700, width: "150px" }}>Điểm số chi tiết</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                ["Điểm Toán THPT", app.academicBackground.mathScore],
                                ["Điểm Ngữ văn THPT", app.academicBackground.literatureScore],
                                ["Điểm Tiếng Anh THPT", app.academicBackground.englishScore],
                                ["Điểm GPA năm Lớp 10", app.academicBackground.gpa10],
                                ["Điểm GPA năm Lớp 11", app.academicBackground.gpa11],
                                ["Điểm GPA năm Lớp 12", app.academicBackground.gpa12],
                                ["Chứng chỉ IELTS", app.academicBackground.ieltsScore],
                                ["Điểm thi SAT", app.academicBackground.satScore],
                              ].filter(([_, v]) => v !== null && v !== undefined).map(([label, val]) => (
                                <tr key={label} style={{ borderBottom: "1px solid #E2E8F0" }}>
                                  <td style={{ padding: "8px 12px", color: "#475569", fontWeight: 500 }}>{label}</td>
                                  <td style={{ padding: "8px 12px", textAlign: "right", color: "#FF6B35", fontWeight: 700, fontSize: 13 }}>{val}</td>
                                </tr>
                              ))}
                              <tr style={{ background: "#FFF7F4", borderTop: "2px solid #FF6B35" }}>
                                <td style={{ padding: "10px 12px", color: "#1E293B", fontWeight: 700 }}>Tổng điểm tổ hợp xét tuyển</td>
                                <td style={{ padding: "10px 12px", textAlign: "right", color: "#FF6B35", fontWeight: 800, fontSize: 15 }}>
                                  {app.academicBackground.totalScore || "N/A"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
                        <AlertCircle size={32} style={{ marginBottom: 8 }} />
                        <div style={{ fontSize: 12 }}>Chưa có thông tin điểm học bạ được lưu trên cơ sở dữ liệu.</div>
                      </div>
                    )}

                    <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 11, color: "#64748B" }}>
                      <div>
                        <em>Ứng viên cam kết chịu trách nhiệm</em><br />
                        <em>về điểm số đã khai báo</em>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong>Hệ thống tuyển sinh trực tuyến</strong><br />
                        <em>Đại học FPT</em>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Attached File Previewer */}
              {activeTab === "document" && (
                <div style={{ width: "100%", height: "560px", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
                  {!selectedDoc ? (
                    <div style={{ color: "#E2E8F0", textAlign: "center", padding: 24 }}>
                      <File size={40} style={{ margin: "0 auto 12px", color: "#94A3B8" }} />
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Chưa chọn tài liệu minh chứng nào</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Vui lòng bấm chọn một tài liệu trong danh sách đính kèm phía dưới.</div>
                    </div>
                  ) : !selectedDoc.filePath ? (
                    <div style={{ color: "#E2E8F0", textAlign: "center", padding: 24 }}>
                      <File size={40} style={{ margin: "0 auto 12px", color: "#94A3B8" }} />
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Tài liệu chưa được tải lên</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Tài liệu minh chứng "{selectedDoc.name}" chưa có tệp đính kèm hợp lệ.</div>
                    </div>
                  ) : isPdfFile(selectedDoc.filePath) ? (
                    <iframe
                      src={getFilePreviewUrl(selectedDoc.filePath)}
                      title="File preview"
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  ) : isImgFile(selectedDoc.filePath) ? (
                    <div style={{ width: "100%", height: "100%", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: "#262626", padding: 12, boxSizing: "border-box" }}>
                      <img
                        src={getFilePreviewUrl(selectedDoc.filePath)}
                        alt={selectedDoc.name}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}
                      />
                    </div>
                  ) : (
                    <div style={{ color: "#E2E8F0", textAlign: "center", padding: 24, maxWidth: "400px" }}>
                      <File size={48} style={{ margin: "0 auto 16px", color: "#FF6B35" }} />
                      <div style={{ fontSize: 14, fontWeight: 700 }}>Định dạng tệp không được hỗ trợ preview</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6, lineHeight: 1.6 }}>
                        Hệ thống chỉ xem trước trực tiếp các tệp PDF hoặc ảnh (PNG, JPG, JPEG, WebP).
                      </div>
                      <a
                        href={getFilePreviewUrl(selectedDoc.filePath)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px",
                          borderRadius: 8, background: "#FF6B35", color: "white", fontSize: 13,
                          fontWeight: 700, textDecoration: "none", marginTop: 16, border: "none",
                          boxShadow: "0 4px 12px rgba(255,107,53,0.3)"
                        }}>
                        <Download size={14} /> Tải tài liệu về máy
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Student Profile Identity Card */}
          <div style={{
            background: "white", borderRadius: 16, padding: 24,
            border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: 22, flexShrink: 0,
                boxShadow: "0 4px 12px rgba(255,107,53,0.3)"
              }}>
                {getInitials(app.studentName)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A" }}>{app.studentName}</span>
                  <span style={{
                    padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                    background: "#FFF7F4", color: "#FF6B35", border: "1px solid #FFD8C9"
                  }}>
                    Thí sinh
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px 24px", marginTop: 8 }}>
                  <div style={{ fontSize: 13, color: "#475569" }}>Mã hồ sơ: <strong style={{ color: "#0F172A" }}>{app.applicationCode}</strong></div>
                  <div style={{ fontSize: 13, color: "#475569" }}>Cơ sở: <strong style={{ color: "#0F172A" }}>{app.campusName}</strong></div>
                  <div style={{ fontSize: 13, color: "#475569" }}>Chuyên ngành: <strong style={{ color: "#0F172A" }}>{app.majorName}</strong></div>
                  <div style={{ fontSize: 13, color: "#475569" }}>Phương thức: <strong style={{ color: "#0F172A" }}>{app.methodName}</strong></div>
                  <div style={{ fontSize: 13, color: "#475569" }}>SĐT liên hệ: <strong style={{ color: "#0F172A" }}>{app.studentPhone || "Chưa cung cấp"}</strong></div>
                  <div style={{ fontSize: 13, color: "#475569" }}>Email đăng ký: <strong style={{ color: "#0F172A" }}>{app.studentEmail}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Attached Documents List */}
          <div style={{
            background: "white", borderRadius: 16, padding: 24,
            border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <h3 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 15, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={18} color="#FF6B35" /> Danh sách tài liệu đính kèm
            </h3>
            <p style={{ margin: "-10px 0 16px", fontSize: 12, color: "#64748B" }}>
              Bấm trực tiếp vào tài liệu bên dưới để mở trình xem trước ở khung phía trên
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {docs.map((doc, i) => {
                const isSelected = selectedDoc?.filePath === doc.filePath && doc.filePath;
                return (
                  <div key={i}
                    onClick={() => handleSelectDoc(doc)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderRadius: 12,
                      background: isSelected ? "#FFF7F4" : "#F8FAFC",
                      border: isSelected ? "2px solid #FF6B35" : "1px solid #E2E8F0",
                      cursor: doc.filePath ? "pointer" : "default",
                      transition: "all 0.2s"
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <FileText size={18} color={isSelected ? "#FF6B35" : "#94A3B8"} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#E85A2A" : "#1E293B" }}>{doc.name}</div>
                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Loại tài liệu: {doc.desc}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={e => e.stopPropagation()}>
                      {doc.filePath ? (
                        <>
                          <button
                            onClick={() => handleSelectDoc(doc)}
                            style={{
                              display: "flex", alignItems: "center", gap: 4, padding: "5px 10px",
                              border: "1px solid #FFD8C9", background: isSelected ? "#FF6B35" : "white",
                              color: isSelected ? "white" : "#FF6B35", borderRadius: 6, fontSize: 11,
                              fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                            }}>
                            <Eye size={12} /> Xem trước
                          </button>
                          <a
                            href={getFilePreviewUrl(doc.filePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex", alignItems: "center", gap: 4, padding: "5px 10px",
                              border: "1px solid #E2E8F0", background: "white",
                              color: "#475569", borderRadius: 6, fontSize: 11,
                              fontWeight: 700, textDecoration: "none", cursor: "pointer"
                            }}>
                            <ExternalLink size={12} /> Tải / Mở mới
                          </a>
                        </>
                      ) : (
                        <span style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>Chưa tải lên</span>
                      )}
                      
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                        background: doc.status === "uploaded" ? "#D1FAE5" : doc.status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                        color: doc.status === "uploaded" ? "#065F46" : doc.status === "rejected" ? "#991B1B" : "#92400E"
                      }}>
                        {doc.status === "uploaded" ? "✓ Đã verify" : doc.status === "rejected" ? "Từ chối" : "Đang chờ"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Evaluation Controls Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Decision Evaluation Panel Card */}
          <div id="evaluation-panel" style={{
            background: "white", borderRadius: 16, padding: 24,
            border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <h3 style={{ margin: "0 0 18px", fontWeight: 800, fontSize: 16, color: "#0F172A" }}>Bảng Đánh Giá</h3>

            {/* Score Input */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                Điểm xét tuyển tổ hợp *
              </label>
              <input
                value={score}
                onChange={(e) => setScore(e.target.value)}
                type="text"
                placeholder="Nhập điểm tổ hợp thực tế..."
                style={{
                  width: "100%", padding: "10px 14px",
                  border: "1px solid #CBD5E1", borderRadius: 10,
                  fontSize: 13, color: "#0F172A", outline: "none",
                  boxSizing: "border-box", transition: "all 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#FF6B35"}
                onBlur={e => e.target.style.borderColor = "#CBD5E1"}
              />
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748B" }}>
                Điểm khai báo: <strong>{app.totalScore || "Chưa có"}</strong>
              </p>
            </div>

            {/* Decision Dropdown Selection */}
            <div style={{ marginBottom: 18, position: "relative" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                Quyết định đánh giá *
              </label>
              <button
                onClick={() => setShowDecisionDropdown(!showDecisionDropdown)}
                style={{
                  width: "100%", padding: "10px 14px",
                  border: "1px solid #CBD5E1", borderRadius: 10,
                  fontSize: 13, color: "#0F172A",
                  background: "white", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  boxSizing: "border-box", transition: "all 0.2s"
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#FF6B35"}
                onBlur={e => setTimeout(() => setShowDecisionDropdown(false), 200)}>
                <span style={{ fontWeight: 700, color: decision === "Duyệt" ? "#059669" : decision === "Từ chối" ? "#DC2626" : "#D97706" }}>
                  {decision}
                </span>
                <ChevronDown size={16} color="#64748B" />
              </button>
              
              {showDecisionDropdown && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  background: "white", border: "1px solid #E2E8F0", borderRadius: 10,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden"
                }}>
                  {DECISION_OPTIONS.map(opt => (
                    <button key={opt}
                      onClick={() => { setDecision(opt); setShowDecisionDropdown(false); }}
                      style={{
                        width: "100%", padding: "10px 14px", textAlign: "left",
                        background: opt === decision ? "#FFF7F4" : "white",
                        border: "none", fontSize: 13, cursor: "pointer",
                        color: opt === "Duyệt" ? "#059669" : opt === "Từ chối" ? "#DC2626" : opt === "Bổ sung" ? "#D97706" : "#1E293B",
                        fontWeight: 700, transition: "background 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={e => e.currentTarget.style.background = opt === decision ? "#FFF7F4" : "white"}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Conditional Textarea Based on Decision */}
            {decision === "Duyệt" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                  Nhận xét chuyên môn (không bắt buộc)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Hồ sơ tốt, điểm số chính xác..."
                  rows={4}
                  style={{
                    width: "100%", padding: "10px 14px",
                    border: "1px solid #CBD5E1", borderRadius: 10,
                    fontSize: 13, color: "#0F172A", outline: "none",
                    resize: "none", boxSizing: "border-box", transition: "all 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#FF6B35"}
                  onBlur={e => e.target.style.borderColor = "#CBD5E1"}
                />
              </div>
            )}

            {decision === "Bổ sung" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                  Yêu cầu tài liệu bổ sung * (sẽ gửi cho thí sinh)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thí sinh vui lòng bổ sung ảnh chụp rõ mặt sau của CCCD / học bạ năm lớp 10..."
                  rows={4}
                  style={{
                    width: "100%", padding: "10px 14px",
                    border: "2px solid #D97706", borderRadius: 10,
                    fontSize: 13, color: "#0F172A", outline: "none",
                    resize: "none", boxSizing: "border-box", background: "#FFFDF5"
                  }}
                />
              </div>
            )}

            {decision === "Từ chối" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>
                  Lý do từ chối hồ sơ * (sẽ gửi cho thí sinh)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Điểm tổ hợp xét tốt nghiệp THPT chưa đạt yêu cầu tối thiểu (21.0 điểm)..."
                  rows={4}
                  style={{
                    width: "100%", padding: "10px 14px",
                    border: "2px solid #DC2626", borderRadius: 10,
                    fontSize: 13, color: "#0F172A", outline: "none",
                    resize: "none", boxSizing: "border-box", background: "#FEF2F2"
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10, border: "none",
                  background: decision === "Duyệt" ? "#059669" : decision === "Từ chối" ? "#DC2626" : "#D97706",
                  color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)", transition: "all 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                {loading && action ? "Đang xử lý..." : "Lưu đánh giá"}
              </button>
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: "12px 18px", borderRadius: 10,
                  border: "1px solid #CBD5E1", background: "white",
                  color: "#64748B", fontWeight: 700, fontSize: 13, cursor: "pointer"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                onMouseLeave={e => e.currentTarget.style.background = "white"}>
                Hủy
              </button>
            </div>
          </div>

          {/* Quick Actions Navigator Panel */}
          <div style={{
            background: "white", borderRadius: 16, padding: 20,
            border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
          }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 800, color: "#0F172A" }}>Hành động nhanh</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => handleQuickAction("APPROVED")}
                disabled={loading}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  background: "#ECFDF5", color: "#059669", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#D1FAE5"}
                onMouseLeave={e => e.currentTarget.style.background = "#ECFDF5"}>
                <CheckCircle size={16} /> Chấp thuận hồ sơ (Duyệt)
              </button>
              <button
                onClick={() => handleQuickAction("UNDER_REVIEW")}
                disabled={loading}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  background: "#FFFBEB", color: "#D97706", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FEF3C7"}
                onMouseLeave={e => e.currentTarget.style.background = "#FFFBEB"}>
                <Clock size={16} /> Yêu cầu tài liệu bổ sung
              </button>
              <button
                onClick={() => handleQuickAction("REJECTED")}
                disabled={loading}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  background: "#FEF2F2", color: "#DC2626", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#FEE2E2"}
                onMouseLeave={e => e.currentTarget.style.background = "#FEF2F2"}>
                <XCircle size={16} /> Từ chối hồ sơ (Không đạt)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
