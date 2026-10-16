import React from "react";

export type BadgeTone = "neutral" | "danger" | "success" | "accent" | "warning";

export interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  style?: React.CSSProperties;
}

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-paper text-ink-muted",
  danger: "bg-stamp-red text-paper",
  success: "bg-stamp-green text-paper",
  accent: "bg-ink text-paper",
  warning: "bg-marker text-ink",
};

// Receipt chip: square tape label in mono caps.
export const StatusBadge: React.FC<StatusBadgeProps> = ({ children, tone = "neutral", className = "", style = {} }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 font-mono font-semibold uppercase tracking-wide whitespace-nowrap ${TONES[tone]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
