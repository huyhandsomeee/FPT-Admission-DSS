import React from "react";
import { Eye } from "lucide-react";
import FilePreview from "../../../../components/common/FilePreview";
import TranscriptPaper from "./TranscriptPaper";

export default function DocumentViewer({ app, activeTab, setActiveTab, selectedDoc, setSelectedDoc, docs }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, border: "1px solid #E2E8F0",
      boxShadow: "0 4px 12px rgba(0,0,0,0.03)", overflow: "hidden"
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0"
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setActiveTab("transcript")}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700,
              background: activeTab === "transcript" ? "#FF6B35" : "transparent",
              color: activeTab === "transcript" ? "white" : "#64748B",
              cursor: "pointer", transition: "all 0.15s",
              boxShadow: activeTab === "transcript" ? "0 2px 8px rgba(255,107,53,0.25)" : "none"
            }}>
            Bảng điểm học bạ
          </button>
          <button onClick={() => {
            if (selectedDoc) setActiveTab("document");
            else if (docs.length > 0 && docs[0].filePath) { setSelectedDoc(docs[0]); setActiveTab("document"); }
            else alert("Thí sinh chưa đính kèm tệp tài liệu nào.");
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
      </div>

      <div style={{ background: "#404040", minHeight: "560px", position: "relative" }}>
        {activeTab === "transcript" ? (
          <TranscriptPaper app={app} />
        ) : (
          <div style={{ width: "100%", height: "560px", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
            <FilePreview selectedDoc={selectedDoc} />
          </div>
        )}
      </div>
    </div>
  );
}
