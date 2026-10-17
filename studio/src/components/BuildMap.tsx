import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useSubtitlesContext } from "../hooks";
import { APP_BOX, BUILD_ARROWS, BUILD_NODES, BUILD_PARTS, BuildNodeId } from "../series/build/map";

// One state of the map, keyed to the subtitle cue where it starts.
export interface BuildMapStep {
  cue: number;
  current?: BuildNodeId[]; // filled ink: what this sentence is about
  built?: BuildNodeId[]; // green outline: already in place
  part?: number; // highlighted row in the progress panel
}

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The Series B presentation: the system diagram on the left, the build progress on the right.
export const BuildMap: React.FC<{ steps: BuildMapStep[]; x: number; y: number; scale: number; panelX: number; showMap?: boolean }> = ({
  steps,
  x,
  y,
  scale,
  panelX,
  showMap = true,
}) => {
  const frame = useCurrentFrame();
  const { cueIndex, subtitles } = useSubtitlesContext();
  const i = steps.reduce((found, s, k) => (s.cue <= cueIndex ? k : found), 0);
  const step = steps[i];
  const prev = steps[i - 1];
  const t = frame - (subtitles[step.cue]?.startFrame ?? 0);
  const pop = interpolate(t, [0, 10], [0.9, 1], CLAMP);

  return (
    <>
      {showMap ? (
      <svg
        className="absolute font-mono"
        style={{ left: x, top: y }}
        width={680 * scale}
        height={500 * scale}
        viewBox="0 0 680 500"
      >
        <rect x={APP_BOX.x} y={APP_BOX.y} width={APP_BOX.w} height={APP_BOX.h} rx={16} fill="none" stroke="var(--ink-muted)" strokeWidth={1.5} strokeDasharray="6 6" />
        <text x={APP_BOX.x + 20} y={APP_BOX.y + 22} fontSize={12} fill="var(--ink-muted)" style={{ textTransform: "uppercase", letterSpacing: 1 }}>
          {APP_BOX.label}
        </text>
        {BUILD_ARROWS.map(([ax, y1, y2]) => (
          <path key={`${ax}-${y1}`} d={`M ${ax} ${y1} V ${y2 - 4} M ${ax - 5} ${y2 - 10} L ${ax} ${y2 - 3} L ${ax + 5} ${y2 - 10}`} fill="none" stroke="var(--ink-muted)" strokeWidth={1.5} />
        ))}
        {(() => {
          // The cluster is a frame, not a box: dashed until its part, then solid; its tab sits on the bottom edge.
          const k = BUILD_NODES.kubernetes;
          const on = step.current?.includes("kubernetes");
          const built = !on && step.built?.includes("kubernetes");
          const color = on ? "var(--ink)" : built ? "var(--stamp-green)" : "var(--ink-muted)";
          const tabX = 380;
          const tabY = k.y + k.h;
          return (
            <g>
              <rect x={k.x} y={k.y} width={k.w} height={k.h} rx={20} fill="none" stroke={color}
                strokeWidth={on || built ? 3 : 1.5} strokeDasharray={on || built ? "10 6" : "3 6"} />
              <rect x={tabX} y={tabY - 14} width={130} height={28} rx={6}
                fill={on ? "var(--ink)" : "var(--paper)"} stroke={color} strokeWidth={1.5} />
              <path d={k.logos![0]} transform={`translate(${tabX + 8} ${tabY - 9}) scale(0.75)`} fill={on ? "var(--paper)" : color} />
              <text x={tabX + 34} y={tabY} dominantBaseline="central" fontSize={12} fontWeight={700}
                fill={on ? "var(--paper)" : color} style={{ textTransform: "uppercase" }}>{k.label}</text>
            </g>
          );
        })()}
        {(Object.keys(BUILD_NODES) as BuildNodeId[]).filter((id) => id !== "kubernetes").map((id) => {
          const n = BUILD_NODES[id];
          const isCurrent = step.current?.includes(id);
          const isBuilt = !isCurrent && step.built?.includes(id);
          const isNew = isCurrent && !prev?.current?.includes(id);
          const s = isNew ? pop : 1;
          const cx = n.x + n.w / 2;
          const cy = n.y + n.h / 2;
          return (
            <g key={id} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={6}
                fill={isCurrent ? "var(--ink)" : "var(--paper)"}
                stroke={isCurrent ? "var(--ink)" : isBuilt ? "var(--stamp-green)" : "var(--ink-muted)"}
                strokeWidth={isBuilt ? 3 : 1.5}
                strokeDasharray={isCurrent || isBuilt ? undefined : "4 4"}
              />
              {n.logos?.map((d, k) => {
                const size = 24;
                const gap = 6;
                const total = n.logos!.length * size + (n.logos!.length - 1) * gap;
                const lx = cx - total / 2 + k * (size + gap);
                return (
                  <path key={k} d={d} transform={`translate(${lx} ${n.y + 9})`}
                    fill={isCurrent ? "var(--paper)" : isBuilt ? "var(--ink)" : "var(--ink-muted)"} />
                );
              })}
              <text x={cx} y={n.logos ? n.y + n.h - 13 : n.sub ? cy - 7 : cy} textAnchor="middle" dominantBaseline="central" fontSize={n.logos ? 12 : 14} fontWeight={700}
                fill={isCurrent ? "var(--paper)" : isBuilt ? "var(--ink)" : "var(--ink-muted)"} style={{ textTransform: "uppercase" }}>
                {n.label}
              </text>
              {n.sub ? (
                <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="central" fontSize={12}
                  fill={isCurrent ? "var(--paper)" : "var(--ink-muted)"} opacity={isCurrent ? 0.75 : 1}>
                  {n.sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      ) : null}
      <div className="absolute font-mono uppercase text-ink" style={{ left: panelX, top: y + 18, right: 84 }}>
        <div className="text-[20px] text-ink-muted tracking-wider mb-2">Build progress</div>
        {BUILD_PARTS.map((p) => {
          const active = p.n === step.part;
          const done = step.part !== undefined && p.n < step.part;
          return (
            <div key={p.n} className={`flex items-baseline gap-4 py-[6px] border-b-[3px] border-dotted border-ink-muted ${active ? "text-ink" : done ? "text-ink" : "text-ink-muted"}`}>
              <span className={`inline-flex w-[40px] h-[40px] items-center justify-center text-[22px] font-bold ${active ? "bg-ink text-paper" : done ? "border-[3px] border-stamp-green" : "border-[3px] border-dashed border-ink-muted"}`}>
                {p.n}
              </span>
              <span className={`text-[26px] ${active ? "font-bold" : ""}`}>{p.title}</span>
              <span className="ml-auto text-[20px] text-ink-muted">{p.episodes.length} ep</span>
            </div>
          );
        })}
      </div>
    </>
  );
};
