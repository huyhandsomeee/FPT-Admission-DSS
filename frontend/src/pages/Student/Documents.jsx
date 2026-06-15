import { useState } from "react";
import { Upload, FileCheck, X, AlertCircle } from "lucide-react";

const DOCUMENT_TYPES = [
  { id: 1, code: "CCCD", name: "CCCD/CMND", required: true, description: "Ảnh 2 mặt CCCD/CMND rõ nét", accepted: "image/*,.pdf" },
  { id: 2, code: "TRANSCRIPT", name: "Học bạ THPT", required: true, description: "Học bạ 3 năm có xác nhận trường", accepted: ".pdf,image/*" },
  { id: 3, code: "CERTIFICATE", name: "Giấy chứng nhận", required: true, description: "Giấy CN tốt nghiệp hoặc kết quả thi", accepted: ".pdf,image/*" },
  { id: 4, code: "PHOTO", name: "Ảnh thẻ 3x4", required: true, description: "Ảnh nền trắng, chụp trong 6 tháng", accepted: "image/*" },
  { id: 5, code: "OTHER", name: "Tài liệu khác", required: false, description: "Chứng chỉ, giải thưởng (nếu có)", accepted: "*" },
];

export default function StudentDocuments() {
  const [files, setFiles] = useState({});
  const [uploading, setUploading] = useState({});

  const handleFileChange = (typeCode, e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading({ ...uploading, [typeCode]: true });
    setTimeout(() => {
      setFiles({ ...files, [typeCode]: { name: file.name, size: file.size, status: "PENDING" } });
      setUploading({ ...uploading, [typeCode]: false });
    }, 1200);
  };

  const removeFile = (typeCode) => {
    const newFiles = { ...files };
    delete newFiles[typeCode];
    setFiles(newFiles);
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ padding: "8px 0" }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý tài liệu</h1>
        <p className="text-gray-500 text-sm mt-1">Upload đầy đủ tài liệu để hoàn thiện hồ sơ xét tuyển</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 flex items-start gap-3" style={{ borderRadius: "14px", padding: "16px" }}>
        <AlertCircle size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700">
          <strong>Lưu ý:</strong> Tài liệu phải rõ nét, đúng định dạng. File tối đa 10MB.
          Tài liệu bắt buộc (<span className="text-red-500">*</span>) phải được upload để hồ sơ được xét duyệt.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {DOCUMENT_TYPES.map((docType) => {
          const uploaded = files[docType.code];
          const isUploading = uploading[docType.code];
          return (
            <div key={docType.id} className="student-card" style={{ padding: "20px 24px" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4" style={{ display: "flex", gap: "16px" }}>
                  <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0`}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      backgroundColor: uploaded ? "#DCFCE7" : "#F1F5F9"
                    }}>
                    {uploaded ? (
                      <FileCheck size={22} className="text-green-600" />
                    ) : (
                      <Upload size={22} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="font-bold text-gray-900 text-base">{docType.name}</span>
                      {docType.required && <span className="text-red-500 font-bold">*</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{docType.description}</p>
                    {uploaded && (
                      <div className="mt-2 flex items-center gap-2" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                        <span className="text-xs text-green-600 font-semibold">✓ {uploaded.name}</span>
                        <span className="text-xs text-gray-400">({Math.round(uploaded.size / 1024)}KB)</span>
                        <span className="badge badge-submitted text-xs" style={{ borderRadius: "20px", padding: "3px 8px" }}>Chờ duyệt</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0" style={{ display: "flex", gap: "8px" }}>
                  {uploaded && (
                    <button onClick={() => removeFile(docType.code)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      style={{ background: "none", border: "none", cursor: "pointer", width: "32px", height: "32px" }}>
                      <X size={16} />
                    </button>
                  )}
                  <label className="student-btn-primary" style={{ cursor: "pointer", padding: "8px 16px", borderRadius: "10px", fontSize: "13px" }}>
                    {isUploading ? (
                      <div className="animate-spin w-4 h-4 border-b-2 border-white rounded-full"></div>
                    ) : (
                      <><Upload size={14} /> {uploaded ? "Thay thế" : "Upload"}</>
                    )}
                    <input type="file" accept={docType.accepted} className="hidden" onChange={(e) => handleFileChange(docType.code, e)} />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="student-card">
        <div className="flex items-center justify-between mb-3" style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span className="font-semibold text-gray-900">Tiến độ nộp tài liệu</span>
          <span className="text-sm font-bold text-orange-600">
            {Object.keys(files).length}/{DOCUMENT_TYPES.filter(d => d.required).length} bắt buộc
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(Object.keys(files).length / DOCUMENT_TYPES.filter(d => d.required).length) * 100}%`,
              background: "linear-gradient(90deg, #FF6B35, #E85A2A)"
            }}></div>
        </div>
      </div>
    </div>
  );
}
