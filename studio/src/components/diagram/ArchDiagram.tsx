import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CrossedOff } from "@remotion/rough-notation";
import { useSubtitlesContext } from "../../hooks/useSubtitles";
import { StatusBadge } from "../StatusBadge";
import { ArchNode, NODE_H, NODE_W, NodeDef } from "./ArchNode";
import { ArchEdge } from "./ArchEdge";
import { Packet } from "./Packet";

export type Slot = [col: number, row: number];

export interface DiagramEdge<Id extends string> {
  from: Id;
  to: Id;
  label?: string;
  broken?: boolean;
}

export interface DiagramPacket<Id extends string> {
  from: Id;
  to: Id;
  label: string;
  delay?: number; // frames after the step starts (default 20)
  duration?: number; // frames to travel (default 30)
  stopAt?: number; // < 1 freezes mid-edge and turns red (timeout, lost request)
}

export interface DiagramStep<Id extends string> {
  cue: number; // subtitle cue index where this step becomes active
  layout: Partial<Record<Id, Slot>>;
  edges?: DiagramEdge<Id>[];
  packets?: DiagramPacket<Id>[];
  accent?: Id[]; // newly introduced service
  danger?: Id[]; // broken / bottleneck
  crossed?: Id[]; // hand-drawn cross-out
  badges?: Partial<Record<Id, string>>;
}

export interface ArchDiagramProps<Id extends string> {
  catalog: Record<Id, NodeDef>;
  steps: DiagramStep<Id>[];
}

// Safe zone between ReelHeader and SubtitleCard on the 1080x1920 canvas.
const ZONE = { x: 60, y: 400, w: 960, h: 1160, cols: 3, rows: 5 };
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Pt = { x: number; y: number };

const toPx = ([col, row]: Slot): Pt => ({
  x: ZONE.x + (col + 0.5) * (ZONE.w / ZONE.cols),
  y: ZONE.y + (row + 0.5) * (ZONE.h / ZONE.rows),
});

// Straight line between two node centres, trimmed to each box's border.
const edgePath = (a: Pt, b: Pt) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.min(
    dx ? (NODE_W / 2 + 10) / Math.abs(dx) : Infinity,
    dy ? (NODE_H / 2 + 10) / Math.abs(dy) : Infinity,
  );
  return `M ${a.x + dx * t} ${a.y + dy * t} L ${b.x - dx * t} ${b.y - dy * t}`;
};

// 30% along the edge, pushed sideways, so labels stay clear of packets
// (which usually pass or freeze around the middle).
const labelPos = (a: Pt, b: Pt): Pt => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: a.x + dx * 0.3 + (-dy / len) * 70, y: a.y + dy * 0.3 + (dx / len) * 70 };
};

const has =<T,>(list: T[] | undefined, item: T) => !!list && list.indexOf(item) !== -1;
const sameEdge = <Id extends string>(a: DiagramEdge<Id>, b: DiagramEdge<Id>) =>
  a.from === b.from && a.to === b.to;

/**
 * One diagram that evolves with the voiceover: each step is keyed to a subtitle
 * cue. On a new step, kept nodes slide to their new slot, new nodes pop in,
 * removed nodes fade out, new edges draw on, and packets travel along edges.
 */
export function ArchDiagram<Id extends string>({ catalog, steps }: ArchDiagramProps<Id>) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const { cueIndex, subtitles } = useSubtitlesContext();

  let i = -1;
  steps.forEach((s, k) => {
    if (s.cue <= cueIndex) i = k;
  });
  if (i === -1) return null;

  const step = steps[i];
  const prev: DiagramStep<Id> | undefined = steps[i - 1];
  const t = frame - (subtitles[step.cue]?.startFrame ?? 0);
  const p = spring({ frame: t, fps, config: { damping: 200 } });
  const drawIn = interpolate(t, [10, 25], [0, 1], CLAMP);

  const ids = Object.keys(step.layout) as Id[];
  const leaving = prev ? (Object.keys(prev.layout) as Id[]).filter((id) => !step.layout[id]) : [];

  const pos = {} as Record<Id, Pt>;
  for (const id of ids) {
    const to = toPx(step.layout[id]!);
    const from = prev?.layout[id] ? toPx(prev.layout[id]!) : to;
    pos[id] = {
      x: interpolate(p, [0, 1], [from.x, to.x]),
      y: interpolate(p, [0, 1], [from.y, to.y]),
    };
  }

  const edges = (step.edges ?? []).filter((e) => pos[e.from] && pos[e.to]);

  return (
    <AbsoluteFill>
      <svg width={width} height={height} className="absolute inset-0">
        <defs>
          {(["accent", "danger"] as const).map((tone) => (
            <marker
              key={tone}
              id={`arrow-${tone}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" style={{ fill: `var(--${tone})` }} />
            </marker>
          ))}
        </defs>
        {edges.map((e) => {
          const isNew = !prev?.edges?.some((pe) => sameEdge(pe, e));
          return (
            <ArchEdge
              key={`${e.from}>${e.to}`}
              path={edgePath(pos[e.from], pos[e.to])}
              progress={isNew ? drawIn : 1}
              broken={e.broken}
            />
          );
        })}
      </svg>

      {edges.map((e) => {
        if (!e.label && !e.broken) return null;
        const at = labelPos(pos[e.from], pos[e.to]);
        return (
          <StatusBadge
            key={`label-${e.from}>${e.to}`}
            tone={e.broken ? "danger" : "neutral"}
            className="absolute"
            style={{
              left: at.x,
              top: at.y,
              translate: "-50% -50%",
              fontSize: 22,
              opacity: prev?.edges?.some((pe) => sameEdge(pe, e)) ? 1 : drawIn,
            }}
          >
            {e.broken ? `✕ ${e.label ?? ""}` : e.label}
          </StatusBadge>
        );
      })}

      {leaving.map((id) => {
        const at = toPx(prev!.layout[id]!);
        return (
          <div
            key={`leaving-${id}`}
            className="absolute"
            style={{ left: at.x, top: at.y, translate: "-50% -50%", opacity: 1 - p }}
          >
            <ArchNode def={catalog[id]} />
          </div>
        );
      })}

      {ids.map((id) => {
        const isNew = !prev?.layout[id];
        const variant = has(step.danger, id) ? "danger" : has(step.accent, id) ? "accent" : "default";
        const node = <ArchNode def={catalog[id]} variant={variant} badge={step.badges?.[id]} />;
        return (
          <div
            key={id}
            className="absolute"
            style={{
              left: pos[id].x,
              top: pos[id].y,
              translate: "-50% -50%",
              scale: isNew ? interpolate(p, [0, 1], [0.6, 1]) : 1,
              opacity: isNew ? p : 1,
            }}
          >
            {has(step.crossed, id) ? (
              <CrossedOff
                progress={interpolate(t, [15, 35], [0, 1], CLAMP)}
                color="#EF4444"
                strokeWidth={6}
              >
                {node}
              </CrossedOff>
            ) : (
              node
            )}
          </div>
        );
      })}

      {(step.packets ?? []).map((pk, k) => {
        if (!pos[pk.from] || !pos[pk.to]) return null;
        const delay = pk.delay ?? 20;
        const end = delay + (pk.duration ?? 30);
        const stopAt = pk.stopAt ?? 1;
        if (t < delay) return null;
        return (
          <Packet
            key={k}
            path={edgePath(pos[pk.from], pos[pk.to])}
            progress={interpolate(t, [delay, end], [0, stopAt], CLAMP)}
            label={pk.label}
            stuck={stopAt < 1 && t >= end}
            opacity={interpolate(t, [delay, delay + 5, end, end + 8], [0, 1, 1, stopAt < 1 ? 1 : 0], CLAMP)}
          />
        );
      })}
    </AbsoluteFill>
  );
}
