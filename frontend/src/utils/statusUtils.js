import { FileText, Clock, CheckCircle, XCircle, Award } from "lucide-react";

export const STATUS_CONFIG = {
  DRAFT: { label: "Bản nháp", badge: "badge-draft", icon: FileText, color: "#4B5563" },
  SUBMITTED: { label: "Đã nộp", badge: "badge-submitted", icon: Clock, color: "#1D4ED8" },
  UNDER_REVIEW: { label: "Đang xét duyệt", badge: "badge-review", icon: Clock, color: "#92400E" },
  APPROVED: { label: "Đủ điều kiện", badge: "badge-approved", icon: CheckCircle, color: "#065F46" },
  REGISTERED_MOET: { label: "Sinh viên đã xác nhận đăng ký NV", badge: "badge-review", icon: FileText, color: "#7C3AED" },
  WAITING_MOET: { label: "Chờ đồng bộ Bộ", badge: "badge-review", icon: Clock, color: "#D97706" },
  ACCEPTED_MOET: { label: "Trúng tuyển chính thức", badge: "badge-approved", icon: CheckCircle, color: "#059669" },
  REJECTED: { label: "Không trúng tuyển", badge: "badge-rejected", icon: XCircle, color: "#991B1B" },
  ENROLLED: { label: "Đã nhập học", badge: "badge-enrolled", icon: Award, color: "#5B21B6" },
};

export const STATUS_LABELS = {
  "": "Tất cả",
  DRAFT: "Bản nháp",
  SUBMITTED: "Đã nộp",
  UNDER_REVIEW: "Đang xét duyệt",
  APPROVED: "Đủ điều kiện",
  REGISTERED_MOET: "Sinh viên đã xác nhận đăng ký NV",
  WAITING_MOET: "Chờ đồng bộ Bộ",
  ACCEPTED_MOET: "Trúng tuyển chính thức",
  REJECTED: "Không trúng tuyển",
  ENROLLED: "Đã nhập học",
};

export const STATUS_COLORS = {
  SUBMITTED:       { bg: "#DBEAFE", color: "#1D4ED8" },
  UNDER_REVIEW:    { bg: "#FEF3C7", color: "#92400E" },
  APPROVED:        { bg: "#D1FAE5", color: "#065F46" },
  REGISTERED_MOET: { bg: "#F3E8FF", color: "#7C3AED" },
  WAITING_MOET:    { bg: "#FEF3C7", color: "#D97706" },
  ACCEPTED_MOET:   { bg: "#D1FAE5", color: "#059669" },
  REJECTED:        { bg: "#FEE2E2", color: "#991B1B" },
  ENROLLED:        { bg: "#EDE9FE", color: "#5B21B6" },
  DRAFT:           { bg: "#F3F4F6", color: "#4B5563" },
};

export const STATUS_STEP_INDEX = {
  DRAFT: 0,
  SUBMITTED: 1,
  UNDER_REVIEW: 2,
  APPROVED: 3,
  REGISTERED_MOET: 4,
  WAITING_MOET: 5,
  ACCEPTED_MOET: 6,
  REJECTED: 3,
  ENROLLED: 7,
};

export const STEPS = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED"];

export const AVATAR_COLORS = [
  { bg: "#DBEAFE", color: "#1D4ED8" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#FEE2E2", color: "#991B1B" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#FFF7ED", color: "#C2410C" },
];
