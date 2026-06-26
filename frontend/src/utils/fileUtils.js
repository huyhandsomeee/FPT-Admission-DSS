export function getFilePreviewUrl(filePath) {
  if (!filePath) return "";
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
  return filePath.startsWith("http") ? filePath : `${API_BASE_URL}${filePath}`;
}

export function isPdfFile(filePath) {
  if (!filePath) return false;
  return filePath.toLowerCase().endsWith(".pdf");
}

export function isImgFile(filePath) {
  if (!filePath) return false;
  const pathLower = filePath.toLowerCase();
  return /\.(png|jpg|jpeg|webp|gif)$/.test(pathLower);
}

export function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}
