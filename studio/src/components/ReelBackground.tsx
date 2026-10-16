import React from "react";
import { useVideoConfig } from "remotion";

const MARGIN = 36; // dark counter visible on each side
const TOOTH = 24; // torn-edge zigzag width

// A strip of thermal receipt paper on a dark counter, torn at the bottom.
export const ReelBackground: React.FC = () => {
  const { width, height } = useVideoConfig();
  const bottom = height - 40;
  let tear = "";
  for (let x = width - MARGIN, up = true; x > MARGIN; x -= TOOTH / 2, up = !up) {
    tear += ` L ${x - TOOTH / 2} ${up ? bottom + 12 : bottom}`;
  }
  const d = `M ${MARGIN} 0 H ${width - MARGIN} V ${bottom}${tear} L ${MARGIN} ${bottom} Z`;

  return (
    <svg width={width} height={height} className="absolute inset-0">
      <rect width={width} height={height} style={{ fill: "var(--counter)" }} />
      <path d={d} style={{ fill: "var(--paper)" }} />
    </svg>
  );
};
