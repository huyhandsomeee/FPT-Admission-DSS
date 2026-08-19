import React, { useState } from "react";
import {
  Building, MapPin, Eye, Play, Sparkles, Check, ArrowRight,
  DollarSign, Home, Award, GraduationCap, X
} from "lucide-react";
import { CAMPUSES, MAJORS } from "../../data/admissionRulesData";

export default function CampusExplorer360({ onSelectCampusForAspiration, showToast }) {
  const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0]);
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const campusMajors = MAJORS.filter(m => m.openCampuses.includes(selectedCampus.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header Info */}
      <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "24px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Building size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: 0 }}>
              Khám Phá Cơ Sở Đào Tạo Đại Học FPT 360°
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
              Trải nghiệm không gian học tập chuẩn quốc tế tại 5 phân hiệu: Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ và Quy Nhơn.
            </p>
          </div>
        </div>

        {/* Campus Selector Pills */}
        <div style={{ display: "flex", gap: 10, marginTop: 18, overflowX: "auto", paddingBottom: 4 }}>
          {CAMPUSES.map(c => {
            const isSelected = selectedCampus.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCampus(c)}
                style={{
                  padding: "9px 18px", borderRadius: 8,
                  border: isSelected ? "2px solid #EA580C" : "1px solid #E2E8F0",
                  background: isSelected ? "#EA580C" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#475569",
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all 0.15s ease", display: "flex", alignItems: "center", gap: 6
                }}
              >
                <MapPin size={14} /> {c.name.split("(")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Campus Feature Card */}
      <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
        {/* Banner Image & Tour Button */}
        <div style={{
          height: 240, position: "relative",
          backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 100%), url(${selectedCampus.image})`,
          backgroundSize: "cover", backgroundPosition: "center",
          padding: "24px 28px", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#FFFFFF"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
            <div>
              <span style={{ fontSize: 11.5, background: "#EA580C", color: "#FFF", padding: "3px 10px", borderRadius: 100, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {selectedCampus.city}
              </span>
              <h1 style={{ fontSize: 24, fontWeight: 900, margin: "6px 0 4px", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                {selectedCampus.name}
              </h1>
              <div style={{ fontSize: 13, color: "#E2E8F0", display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} /> {selectedCampus.address}
              </div>
            </div>

            <button
              onClick={() => setActiveVideoModal(selectedCampus)}
              style={{
                padding: "9px 18px", borderRadius: 8, background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.4)",
                color: "#FFFFFF", fontWeight: 800, fontSize: 12.5, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              <Play size={14} fill="#FFF" /> Xem Video Campus 360
            </button>
          </div>
        </div>

        {/* Details & Policies */}
        <div style={{ padding: "24px 28px", display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: 24 }}>
          {/* Left Column: Description & Programs */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>
              Giới thiệu & Cơ sở vật chất nổi bật
            </h3>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: "0 0 16px" }}>
              {selectedCampus.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
              {selectedCampus.highlights.map((hl, idx) => (
                <div key={idx} style={{ background: "#F8FAFC", padding: "10px 12px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12.5, color: "#334155", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                  <Check size={14} color="#16A34A" /> {hl}
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 12px" }}>
              Các ngành đào tạo tại {selectedCampus.name.split("(")[0]} ({campusMajors.length} ngành)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {campusMajors.map(m => (
                <div key={m.id} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: 13, color: "#0F172A" }}>{m.name}</strong>
                    <span style={{ fontSize: 11, color: "#64748B", marginLeft: 6 }}>(Mã: {m.code})</span>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectCampusForAspiration) {
                        onSelectCampusForAspiration(selectedCampus.id, m.id);
                      } else {
                        showToast(`Đã chọn ngành ${m.name} tại ${selectedCampus.name}`);
                      }
                    }}
                    style={{ padding: "4px 10px", borderRadius: 6, background: "#EA580C", color: "#FFF", border: "none", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    Đăng Ký Nguyện Vọng
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tuition & Dorm & Scholarship Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Học phí */}
            <div style={{ background: "#FFF7ED", borderRadius: 10, padding: "16px", border: "1px solid #FED7AA" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, color: "#9A3412", fontWeight: 800, fontSize: 13.5 }}>
                <DollarSign size={16} /> Mức Học Phí Chuyên Ngành
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#EA580C", margin: "4px 0 2px" }}>
                {selectedCampus.tuitionPerSemester}
              </div>
              <span style={{ fontSize: 11.5, color: "#7C2D12" }}>Mỗi học kỳ (gồm 9 học kỳ chuyên ngành)</span>
            </div>

            {/* Ký túc xá */}
            <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "16px", border: "1px solid #DBEAFE" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, color: "#1E40AF", fontWeight: 800, fontSize: 13.5 }}>
                <Home size={16} /> Ký Túc Xá Sinh Viên
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1D4ED8", margin: "4px 0 2px" }}>
                {selectedCampus.dormPrice}
              </div>
              <span style={{ fontSize: 11.5, color: "#1E3A8A" }}>Phòng máy lạnh, khép kín, tiện ích trọn gói</span>
            </div>

            {/* Học bổng */}
            <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "16px", border: "1px solid #BBF7D0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, color: "#166534", fontWeight: 800, fontSize: 13.5 }}>
                <Award size={16} /> Chính Sách Học Bổng
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#15803D", margin: "4px 0 2px" }}>
                {selectedCampus.scholarshipPolicy}
              </div>
              <span style={{ fontSize: 11.5, color: "#14532D" }}>Xét tuyển học bạ Top 30 hoặc thi học bổng FPTU</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Tour Modal */}
      {activeVideoModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.8)", zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 720, width: "100%", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0" }}>
              <strong style={{ fontSize: 15, color: "#0F172A" }}>Trải nghiệm Không gian 360: {activeVideoModal.name}</strong>
              <button onClick={() => setActiveVideoModal(null)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ height: 380, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
              <iframe
                width="100%"
                height="100%"
                src={activeVideoModal.videoTourUrl}
                title="Campus Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
