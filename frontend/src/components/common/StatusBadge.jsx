import React from "react";
import { STATUS_COLORS, STATUS_LABELS } from "../../utils/statusUtils";

export default function StatusBadge({ status, style: customStyle = {} }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.DRAFT;
  const label = STATUS_LABELS[status] || status;

  return (
    <span style={{
      display: "inline-block", padding: "4px 10px", borderRadius: 999,
      fontSize: 11, fontWeight: 700,
      background: colors.bg, color: colors.color,
      ...customStyle
    }}>
      {label}
    </span>
  );
}
