import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export type MotionEnter =
  | "pop"
  | "scale"
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "none";

export interface MotionBoxProps {
  enter?: MotionEnter;
  delay?: number;
  duration?: number;
  springConfig?: { damping?: number; stiffness?: number; mass?: number };
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const MotionBox: React.FC<MotionBoxProps> = ({
  enter = "pop",
  delay = 0,
  duration,
  springConfig,
  className = "",
  style = {},
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activeFrame = frame - delay;

  const springVal = spring({
    frame: activeFrame,
    fps,
    config: springConfig ?? { damping: 13, stiffness: 95 },
  });

  const animStyle: React.CSSProperties = {};

  if (enter === "pop") {
    animStyle.scale = interpolate(springVal, [0, 1], [0.88, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    animStyle.opacity = interpolate(activeFrame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (enter === "scale") {
    animStyle.scale = interpolate(springVal, [0, 1], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    animStyle.opacity = interpolate(activeFrame, [0, 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (enter === "slide-up") {
    const y = interpolate(springVal, [0, 1], [40, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    animStyle.translate = `0px ${y}px`;
    animStyle.opacity = interpolate(activeFrame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (enter === "slide-down") {
    const y = interpolate(springVal, [0, 1], [-40, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    animStyle.translate = `0px ${y}px`;
    animStyle.opacity = interpolate(activeFrame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (enter === "slide-left") {
    const x = interpolate(springVal, [0, 1], [50, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    animStyle.translate = `${x}px 0px`;
    animStyle.opacity = interpolate(activeFrame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (enter === "slide-right") {
    const x = interpolate(springVal, [0, 1], [-50, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    animStyle.translate = `${x}px 0px`;
    animStyle.opacity = interpolate(activeFrame, [0, 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (enter === "fade") {
    animStyle.opacity = interpolate(activeFrame, [0, duration ?? 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <div
      className={className}
      style={{
        ...animStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
