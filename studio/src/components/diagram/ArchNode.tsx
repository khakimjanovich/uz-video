import React from "react";
import { CardVariant, UiCard } from "../UiCard";

export interface NodeDef {
  label: string;
  sublabel?: string;
}

// Fixed size so ArchDiagram can clip edges to the box border.
export const NODE_W = 280;
export const NODE_H = 150;

export interface ArchNodeProps {
  def: NodeDef;
  variant?: CardVariant;
  badge?: string; // rendered as a rubber stamp
}

export const ArchNode: React.FC<ArchNodeProps> = ({ def, variant = "default", badge }) => {
  const stampRed = variant === "danger";
  return (
    <UiCard
      variant={variant}
      className="relative flex flex-col items-center justify-center text-center px-4 font-mono uppercase"
      style={{ width: NODE_W, height: NODE_H }}
    >
      <div className="text-[30px] font-bold leading-tight tracking-wide">{def.label}</div>
      {def.sublabel ? (
        <div className={`mt-1 text-[18px] tracking-wider ${variant === "accent" ? "text-paper/70" : "text-ink-muted"}`}>
          {def.sublabel}
        </div>
      ) : null}
      {badge ? (
        <div
          className={`absolute -top-9 -right-8 px-3 py-1 border-[4px] bg-paper/80 font-display text-[24px] leading-none whitespace-nowrap ${
            stampRed ? "border-stamp-red text-stamp-red" : "border-stamp-green text-stamp-green"
          }`}
          style={{ rotate: stampRed ? "-8deg" : "6deg" }}
        >
          {badge}
        </div>
      ) : null}
    </UiCard>
  );
};
