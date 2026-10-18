import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useSubtitlesContext } from "../hooks";

// One real file from the companion repo, shown on a code beat.
export interface CodeStep {
  cue: number;
  file: string; // path inside the repo, e.g. modules/partner/src/main/openapi/partner-v1.yaml
  lines: string[];
  highlight?: number[]; // 1-based line numbers to mark
}

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Lines type in one after another; highlighted lines get the marker.
export const CodeCard: React.FC<{ step: CodeStep; x: number; y: number; w: number; h: number }> = ({ step, x, y, w, h }) => {
  const frame = useCurrentFrame();
  const { subtitles } = useSubtitlesContext();
  const t = frame - (subtitles[step.cue]?.startFrame ?? 0);
  return (
    <div className="absolute bg-ink text-paper font-mono overflow-hidden" style={{ left: x, top: y, width: w, height: h }}>
      <div className="px-6 py-3 text-[20px] tracking-wider uppercase border-b-[2px] border-dotted" style={{ color: "var(--marker)", borderColor: "var(--ink-muted)" }}>
        {step.file}
      </div>
      <div className="px-6 py-4 text-[25px] leading-[1.45] whitespace-pre">
        {step.lines.map((line, i) => {
          const marked = step.highlight?.includes(i + 1);
          return (
            <div
              key={i}
              style={{
                opacity: interpolate(t, [i * 2, i * 2 + 6], [0, 1], CLAMP),
                background: marked ? "rgba(255, 214, 0, 0.18)" : undefined,
                borderLeft: marked ? "5px solid var(--marker)" : "5px solid transparent",
                paddingLeft: 12,
              }}
            >
              <span style={{ color: "var(--ink-muted)", marginRight: 20 }}>{String(i + 1).padStart(2, " ")}</span>
              {line || " "}
            </div>
          );
        })}
      </div>
    </div>
  );
};
