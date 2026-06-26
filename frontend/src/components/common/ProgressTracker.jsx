import React from "react";

export default function ProgressTracker({ steps, currentStep, currentStatus, statusLabels, barColor = "linear-gradient(90deg, #FF6B35, #E85A2A)" }) {
  const stepIdx = steps.indexOf(currentStatus);
  const totalSteps = steps.length;

  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between text-xs text-gray-400 mb-2" style={{ padding: "0 4px" }}>
        {steps.slice(0, 5).map((s, i) => (
          <span key={s} className={i <= stepIdx ? "text-orange-600 font-semibold" : ""}>
            {statusLabels[s] || s}
          </span>
        ))}
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${((stepIdx + 1) / totalSteps) * 100}%`, background: barColor }}
        ></div>
      </div>
    </div>
  );
}
