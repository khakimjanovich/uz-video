import React from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import { StatusBadge } from "../StatusBadge";

export interface PacketProps {
  path: string;
  progress: number; // 0..1 along the path
  label: string;
  danger?: boolean; // frozen mid-edge or travelling a broken edge
  opacity?: number;
}

export const Packet: React.FC<PacketProps> = ({ path, progress, label, danger = false, opacity = 1 }) => {
  const point = getPointAtLength(path, getLength(path) * progress);
  if (!point) return null;

  return (
    <StatusBadge
      tone={danger ? "danger" : "accent"}
      className="absolute shadow-2xl"
      style={{
        left: point.x,
        top: point.y,
        translate: "-50% -50%",
        fontSize: 24,
        opacity,
        zIndex: 5,
      }}
    >
      {label}
    </StatusBadge>
  );
};
