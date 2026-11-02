import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useSubtitlesContext } from "../hooks";
import { BUILD_ARROWS, BUILD_NODES, BUILD_PARTS, BuildNodeId, UNIT_BOXES, UnitId } from "../series/build/map";

// One state of the map, keyed to the subtitle cue where it starts.
export interface BuildMapStep {
  cue: number;
  current?: BuildNodeId[]; // filled ink: what this sentence is about
  built?: BuildNodeId[]; // green outline: already in place
  part?: number; // highlighted row in the progress panel (the course module)
  rows?: number[]; // panel rows this sentence is about (focus mode); defaults to [part]
  analogy?: "card-token"; // a picture card in the right column (card number -> token); lasts until the next step
  dot?: BuildNodeId | "off"; // the payment marker: glides to this node when the step starts; "off" hides it
  units?: Partial<Record<UnitId, string>>; // unit boxes drawn solid, with a stamp (e.g. cards: "CDE")
}

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The Series B presentation: the system diagram on the left, the build progress on the right.
export const BuildMap: React.FC<{ steps: BuildMapStep[]; x: number; y: number; scale: number; panelX: number; showMap?: boolean; focus?: boolean; hidePanelBefore?: number }> = ({
  steps,
  x,
  y,
  scale,
  panelX,
  showMap = true,
  focus = false,
  hidePanelBefore = 0,
}) => {
  const frame = useCurrentFrame();
  const { cueIndex, subtitles } = useSubtitlesContext();
  const i = steps.reduce((found, s, k) => (s.cue <= cueIndex ? k : found), 0);
  const step = steps[i];
  const prev = steps[i - 1];
  const t = frame - (subtitles[step.cue]?.startFrame ?? 0);
  const pop = interpolate(t, [0, 10], [0.9, 1], CLAMP);
  // Focus mode: while a sentence is about some nodes, the rest fade back so the eye finds them (fades over the first 10 frames).
  const dimOf = (s: BuildMapStep | undefined, id: BuildNodeId) => (focus && s?.current?.length && !s.current.includes(id) ? 0.15 : 1);
  // The payment dot: sits on the latest node named by a step so far, and glides from the one before it.
  const dotAt = (upTo: number) => steps.slice(0, upTo + 1).reduce<BuildMapStep["dot"]>((d, st) => st.dot ?? d, undefined);
  const dotNow = dotAt(i);
  const dotPrev = dotAt(i - 1);
  // The dot rides the node's top edge, so the label stays readable.
  const center = (id: BuildNodeId) => ({ x: BUILD_NODES[id].x + BUILD_NODES[id].w / 2, y: BUILD_NODES[id].y });
  const glide = interpolate(t, [0, 30], [0, 1], { ...CLAMP, easing: Easing.inOut(Easing.cubic) });
  // Focus mode, panel rows: only the rows the sentence is about stay bright.
  const rowDim = (s: BuildMapStep | undefined, n: number) => (focus && s && !(s.rows ?? (s.part !== undefined ? [s.part] : [])).includes(n) ? 0.15 : 1);
  const rowFade = (n: number) => {
    const from = rowDim(prev, n);
    return from + (rowDim(step, n) - from) * interpolate(t, [0, 10], [0, 1], CLAMP);
  };
  // Focus mode, arrows: an arrow stays bright only while both boxes it joins are in play (same order as BUILD_ARROWS).
  const ARROW_ENDS: [BuildNodeId, BuildNodeId][] = [
    ["partner", "emailport"], ["epos", "procport"], ["payment", "procport"], ["reconciliation", "procport"],
    ["emailport", "emailsvc"], ["procport", "card"], ["adapters", "procsvc"],
  ];
  const arrowDim = (s: BuildMapStep | undefined, k: number) => (focus && s?.current?.length && !ARROW_ENDS[k].every((id) => s.current!.includes(id)) ? 0.15 : 1);
  const arrowFade = (k: number) => {
    const from = arrowDim(prev, k);
    return from + (arrowDim(step, k) - from) * interpolate(t, [0, 10], [0, 1], CLAMP);
  };
  const fade = (id: BuildNodeId) => {
    const from = dimOf(prev, id);
    return from + (dimOf(step, id) - from) * interpolate(t, [0, 10], [0, 1], CLAMP);
  };

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
        {UNIT_BOXES.map((u) => {
          const stamp = step.units?.[u.id];
          return (
            <g key={u.id}>
              <rect x={u.x} y={u.y} width={u.w} height={u.h} rx={16} fill="none" stroke={stamp ? "var(--ink)" : "var(--ink-muted)"}
                strokeWidth={stamp ? 4 : 1.5} strokeDasharray={stamp ? undefined : "6 6"} />
              <text x={u.x + 20} y={u.y + 22} fontSize={12} fill={stamp ? "var(--ink)" : "var(--ink-muted)"} fontWeight={stamp ? 700 : 400}
                style={{ textTransform: "uppercase", letterSpacing: 1 }}>
                {u.label}
              </text>
              {stamp ? (
                <g transform={`translate(${u.x + u.w - 10} ${u.y + 4}) rotate(4)`} opacity={pop * 10 - 9}>
                  <rect x={-stamp.length * 9.6 - 20} y={-16} width={stamp.length * 9.6 + 20} height={30} fill="var(--paper)" stroke="var(--stamp-green)" strokeWidth={3} />
                  <text x={-10} y={0} textAnchor="end" dominantBaseline="central" fontSize={16} fontWeight={700} fill="var(--stamp-green)"
                    style={{ textTransform: "uppercase" }}>{stamp}</text>
                </g>
              ) : null}
            </g>
          );
        })}
        {BUILD_ARROWS.map(([ax, y1, y2], k) => (
          <path key={`${ax}-${y1}`} opacity={arrowFade(k)} d={`M ${ax} ${y1} V ${y2 - 4} M ${ax - 5} ${y2 - 10} L ${ax} ${y2 - 3} L ${ax + 5} ${y2 - 10}`} fill="none" stroke="var(--ink-muted)" strokeWidth={1.5} />
        ))}
        {(() => {
          // The delivery frame is a frame, not a box: dashed until its part, then solid; its tab sits on the bottom edge.
          const k = BUILD_NODES.kubernetes;
          const on = step.current?.includes("kubernetes");
          const built = !on && step.built?.includes("kubernetes");
          const color = on ? "var(--ink)" : built ? "var(--stamp-green)" : "var(--ink-muted)";
          const tabX = k.x + 16;
          const tabY = k.y + k.h;
          return (
            <g opacity={fade("kubernetes")}>
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
            <g key={id} opacity={fade(id)} transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
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
                // Logos are 24-unit icons; shrink them when a narrow box can't hold them all.
                const gap = 6;
                const size = Math.min(24, (n.w - 12 - (n.logos!.length - 1) * gap) / n.logos!.length);
                const total = n.logos!.length * size + (n.logos!.length - 1) * gap;
                const lx = cx - total / 2 + k * (size + gap);
                return (
                  <path key={k} d={d} transform={`translate(${lx} ${n.y + 9}) scale(${size / 24})`}
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
        {dotNow && dotNow !== "off" ? (() => {
          const to = center(dotNow);
          const from = dotPrev && dotPrev !== "off" ? center(dotPrev) : to;
          const x = from.x + (to.x - from.x) * glide;
          const y = from.y + (to.y - from.y) * glide;
          const appear = dotPrev && dotPrev !== "off" ? 1 : interpolate(t, [0, 12], [0, 1], CLAMP);
          return (
            <g transform={`translate(${x} ${y})`} opacity={appear}>
              <circle r={15} fill="var(--stamp-green)" opacity={0.25} />
              <circle r={9} fill="var(--stamp-green)" stroke="var(--paper)" strokeWidth={3} />
            </g>
          );
        })() : null}
      </svg>
      ) : null}
      {step.analogy === "card-token" ? (
        <svg className="absolute font-mono" style={{ left: panelX, top: 262, opacity: pop * 10 - 9 }} width={683} height={320} viewBox="0 0 683 320">
          <text x={0} y={22} fontSize={20} fill="var(--ink-muted)" style={{ textTransform: "uppercase", letterSpacing: 1 }}>What ecom gets instead</text>
          <g transform="translate(0 66)">
            <rect x={0} y={0} width={230} height={140} rx={14} fill="var(--paper)" stroke="var(--ink)" strokeWidth={4} />
            <rect x={22} y={26} width={42} height={30} rx={5} fill="none" stroke="var(--ink)" strokeWidth={3} />
            <text x={22} y={104} fontSize={24} fontWeight={700} fill="var(--ink)">4242 4242 4242</text>
          </g>
          <text x={115} y={246} textAnchor="middle" fontSize={24} fontWeight={700} fill="var(--ink)">CARD NUMBER</text>
          <text x={115} y={274} textAnchor="middle" fontSize={20} fill="var(--ink-muted)">stays locked up</text>
          <path d="M250 136 H370 M356 124 L372 136 L356 148" fill="none" stroke="var(--ink)" strokeWidth={4} />
          <text x={310} y={112} textAnchor="middle" fontSize={20} fill="var(--ink-muted)">swapped</text>
          <g transform="translate(400 66)">
            <path d="M0 0 H230 V54 a14 14 0 0 0 0 28 V140 H0 V82 a14 14 0 0 0 0 -28 Z" fill="var(--ink)" />
            <text x={115} y={70} textAnchor="middle" dominantBaseline="central" fontSize={40} fontWeight={700} fill="var(--paper)">tok_47</text>
          </g>
          <text x={515} y={246} textAnchor="middle" fontSize={24} fontWeight={700} fill="var(--ink)">TOKEN</text>
          <text x={515} y={274} textAnchor="middle" fontSize={20} fill="var(--ink-muted)">all ecom ever holds</text>
          <text x={0} y={310} fontSize={22} fontWeight={700} fill="var(--stamp-green)">It names the card. It is not the card.</text>
        </svg>
      ) : null}
      {cueIndex >= hidePanelBefore && (!focus || step.rows) ? (
      <div className="absolute font-mono uppercase text-ink" style={{ left: panelX, top: y + 18, right: 84 }}>
        <div className="text-[20px] text-ink-muted tracking-wider mb-2">Course modules</div>
        {BUILD_PARTS.map((p) => {
          const active = p.n === step.part;
          const done = step.part !== undefined && p.n < step.part;
          return (
            <div key={p.n} style={{ opacity: rowFade(p.n) }} className={`flex items-center gap-4 py-[2px] border-b-[2px] border-dotted border-ink-muted ${active ? "text-ink" : done ? "text-ink" : "text-ink-muted"}`}>
              <span className={`inline-flex w-[28px] h-[28px] items-center justify-center text-[18px] font-bold ${active ? "bg-ink text-paper" : done ? "border-[3px] border-stamp-green" : "border-[3px] border-dashed border-ink-muted"}`}>
                {p.n}
              </span>
              <span className={`text-[20px] ${active ? "font-bold" : ""}`}>{p.title}</span>
              <span className="ml-auto text-[18px] text-ink-muted">{p.lessons}</span>
            </div>
          );
        })}
      </div>
      ) : null}
    </>
  );
};
