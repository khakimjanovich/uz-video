import React from "react";

export type CardVariant = "default" | "middle" | "danger" | "accent" | "success";

export interface UiCardProps {
  variant?: CardVariant;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const UiCard: React.FC<UiCardProps> = ({
  variant = "default",
  className = "",
  style = {},
  children,
}) => {
  let variantClass = "bg-card border border-border shadow-2xl";

  if (variant === "middle") {
    variantClass = "bg-card-middle border border-border shadow-2xl";
  } else if (variant === "danger") {
    variantClass =
      "bg-card-middle border-2 border-danger shadow-[0_25px_50px_-12px_rgba(239,68,68,0.25)]";
  } else if (variant === "accent") {
    variantClass =
      "bg-card-middle border-2 border-accent shadow-[0_25px_50px_-12px_rgba(14,165,233,0.25)]";
  } else if (variant === "success") {
    variantClass =
      "bg-card-middle border-2 border-success shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)]";
  }

  return (
    <div
      className={`rounded-[36px] ${variantClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};
