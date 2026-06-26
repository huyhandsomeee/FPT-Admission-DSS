import { FileText, Clock, CheckCircle, XCircle, Award } from "lucide-react";

export const STATUS_CONFIG = {
  DRAFT: { label: "Bản nháp", badge: "badge-draft", icon: FileText, color: "#4B5563" },
  SUBMITTED: { label: "Đã nộp", badge: "badge-submitted", icon: Clock, color: "#1D4ED8" },
  UNDER_REVIEW: { label: "Đang xét duyệt", badge: "badge-review", icon: Clock, color: "#92400E" },
  APPROVED: { label: "Được chấp thuận", badge: "badge-approved", icon: CheckCircle, color: "#065F46" },
  REJECTED: { label: "Bị từ chối", badge: "badge-rejected", icon: XCircle, color: "#991B1B" },
  ENROLLED: { label: "Đã nhập học", badge: "badge-enrolled", icon: Award, color: "#5B21B6" },
};

export const STATUS_LABELS = {
  "": "Tất cả",
  DRAFT: "Bản nháp",
  SUBMITTED: "Đã nộp",
  UNDER_REVIEW: "Đang xét duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  ENROLLED: "Nhập học",
};

export const STATUS_COLORS = {
  SUBMITTED:    { bg: "#DBEAFE", color: "#1D4ED8" },
  UNDER_REVIEW: { bg: "#FEF3C7", color: "#92400E" },
  APPROVED:     { bg: "#D1FAE5", color: "#065F46" },
  REJECTED:     { bg: "#FEE2E2", color: "#991B1B" },
  ENROLLED:     { bg: "#EDE9FE", color: "#5B21B6" },
  DRAFT:        { bg: "#F3F4F6", color: "#4B5563" },
};

export const STATUS_STEP_INDEX = {
  DRAFT: 0,
  SUBMITTED: 1,
  UNDER_REVIEW: 2,
  APPROVED: 3,
  REJECTED: 3,
  ENROLLED: 4,
};

export const STEPS = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "ENROLLED"];

export const AVATAR_COLORS = [
  { bg: "#DBEAFE", color: "#1D4ED8" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#FEE2E2", color: "#991B1B" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#FFF7ED", color: "#C2410C" },
];
