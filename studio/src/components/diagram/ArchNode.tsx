import React from "react";
import { CardVariant, UiCard } from "../UiCard";
import { StatusBadge } from "../StatusBadge";

export interface NodeDef {
  icon: string;
  label: string;
  sublabel?: string;
}

// Fixed size so ArchDiagram can clip edges to the box border.
export const NODE_W = 280;
export const NODE_H = 170;

export interface ArchNodeProps {
  def: NodeDef;
  variant?: CardVariant;
  badge?: string;
}

export const ArchNode: React.FC<ArchNodeProps> = ({ def, variant = "default", badge }) => {
  return (
    <UiCard
      variant={variant}
      className="relative flex flex-col items-center justify-center text-center px-4"
      style={{ width: NODE_W, height: NODE_H }}
    >
      <div className="text-[52px] leading-none">{def.icon}</div>
      <div className="mt-2 text-[28px] font-extrabold leading-tight text-primary">{def.label}</div>
      {def.sublabel ? (
        <div className="text-[20px] font-semibold text-secondary">{def.sublabel}</div>
      ) : null}
      {badge ? (
        <StatusBadge
          tone={variant === "danger" ? "danger" : "success"}
          className="absolute -top-4 -right-4"
          style={{ fontSize: 20 }}
        >
          {badge}
        </StatusBadge>
      ) : null}
    </UiCard>
  );
};
