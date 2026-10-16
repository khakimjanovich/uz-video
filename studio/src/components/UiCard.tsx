import React from "react";

export type CardVariant = "default" | "middle" | "danger" | "accent" | "success";

export interface UiCardProps {
  variant?: CardVariant;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const VARIANTS: Record<CardVariant, string> = {
  default: "bg-paper text-ink border-ink",
  middle: "bg-paper text-ink border-ink",
  danger: "bg-paper text-stamp-red border-stamp-red",
  accent: "bg-ink text-paper border-ink",
  success: "bg-paper text-stamp-green border-stamp-green",
};

// Receipt box: square corners, 3px ink rule; accent is inverted (ink fill).
export const UiCard: React.FC<UiCardProps> = ({ variant = "default", className = "", style = {}, children }) => {
  return (
    <div className={`border-[3px] ${VARIANTS[variant]} ${className}`} style={style}>
      {children}
    </div>
  );
};
