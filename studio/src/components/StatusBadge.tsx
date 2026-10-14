import React from "react";

export type BadgeTone = "neutral" | "danger" | "success" | "accent" | "warning";

export interface StatusBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
  style?: React.CSSProperties;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  tone = "neutral",
  className = "",
  style = {},
}) => {
  let toneClass = "bg-card border border-border text-primary";

  if (tone === "danger") {
    toneClass = "bg-danger-subtle text-danger border border-danger/40";
  } else if (tone === "success") {
    toneClass = "bg-success-subtle text-success border border-success/40";
  } else if (tone === "accent") {
    toneClass = "bg-accent-subtle text-accent border border-accent/40";
  } else if (tone === "warning") {
    toneClass = "bg-warning-subtle text-warning border border-warning/40";
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-extrabold tracking-wide ${toneClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
