import { CheckCircle } from "lucide-react";

export default function LoadingSpinner({ message = "Đang tải..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "4px solid #F1F5F9", borderTop: "4px solid #FF6B35", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: "15px", color: "#64748B", fontWeight: 600 }}>{message}</span>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
    </div>
  );
}
