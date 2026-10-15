import React from "react";
import { evolvePath } from "@remotion/paths";

export interface ArchEdgeProps {
  path: string;
  progress: number; // 0..1 draw-on
  broken?: boolean;
}

// SVG <path>; must be rendered inside ArchDiagram's <svg>, which defines the arrow markers.
export const ArchEdge: React.FC<ArchEdgeProps> = ({ path, progress, broken = false }) => {
  const tone = broken ? "danger" : "accent";
  return (
    <path
      d={path}
      fill="none"
      strokeWidth={5}
      strokeLinecap="round"
      markerEnd={progress > 0.98 ? `url(#arrow-${tone})` : undefined}
      style={{
        stroke: `var(--${tone})`,
        ...(broken ? { strokeDasharray: "14 12" } : evolvePath(progress, path)),
      }}
    />
  );
};
