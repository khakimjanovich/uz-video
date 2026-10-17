import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
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
  shake?: Partial<Record<Id, number>>; // when each node shakes, as a fraction of the cue (sync to the word that names it)
  badges?: Partial<Record<Id, string>>;
}

export interface ArchDiagramProps<Id extends string> {
  catalog: Record<Id, NodeDef>;
  steps: DiagramStep<Id>[];
}

// Safe zone between ReelHeader and SubtitleCard on the 1080x1920 canvas.
const ZONE = { x: 60, y: 300, w: 960, h: 1120, cols: 3, rows: 5 };
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Pt = { x: number; y: number };

const toPx = ([col, row]: Slot): Pt => ({
  x: ZONE.x + (col + 0.5) * (ZONE.w / ZONE.cols),
  y: ZONE.y + (row + 0.5) * (ZONE.h / ZONE.rows),
});

// Visible part of the line between two node centres: trimmed to each box's border.
const trim = (a: Pt, b: Pt): [Pt, Pt] => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (!dx && !dy) return [a, { x: a.x, y: a.y + 1 }]; // nodes overlap mid-slide: keep a valid 1px path
  const t = Math.min(
    dx ? (NODE_W / 2 + 10) / Math.abs(dx) : Infinity,
    dy ? (NODE_H / 2 + 10) / Math.abs(dy) : Infinity,
  );
  return [
    { x: a.x + dx * t, y: a.y + dy * t },
    { x: b.x - dx * t, y: b.y - dy * t },
  ];
};

const edgePath = (a: Pt, b: Pt) => {
  const [p, q] = trim(a, b);
  return `M ${p.x} ${p.y} L ${q.x} ${q.y}`;
};

// Labels sit beside the visible line, clear of packets: centred under mostly-horizontal edges
// (packets are short, so 70px is enough), 30% along mostly-vertical ones (packets are wide).
const labelPos = (a: Pt, b: Pt): Pt => {
  const [p, q] = trim(a, b);
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  const len = Math.hypot(dx, dy) || 1;
  const t = Math.abs(dx) > Math.abs(dy) ? 0.5 : 0.3;
  return { x: p.x + dx * t + (-dy / len) * 70, y: p.y + dy * t + (dx / len) * 70 };
};

// Remotion's hosted SFX, fetched at render time (no audio files in git).
const SFX = {
  pop: { src: "https://remotion.media/whoosh.wav", volume: 0.3 },
  packet: { src: "https://remotion.media/mouse-click.wav", volume: 0.5 },
  error: { src: "https://remotion.media/record-scratch.wav", volume: 0.35 },
  success: { src: "https://remotion.media/ding.wav", volume: 0.3 },
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
  // A box is named only in the step where it first appears in this video; after that, image only.
  const introduced = (id: Id) => steps.findIndex((st) => st.layout[id]) === i;
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

  // Sound cues derived from what changed in this step (frame offsets from step start).
  const stepStart = subtitles[step.cue]?.startFrame ?? 0;
  const sfx: { at: number; sound: (typeof SFX)[keyof typeof SFX] }[] = [];
  if (ids.some((id) => !prev?.layout[id])) sfx.push({ at: 0, sound: SFX.pop });
  const newlyBroken = edges.some((e) => e.broken && !prev?.edges?.some((pe) => pe.broken && sameEdge(pe, e)));
  const newlyCrossed = (step.crossed ?? []).some((id) => !has(prev?.crossed, id));
  if (newlyBroken || newlyCrossed) sfx.push({ at: 10, sound: SFX.error });
  if ((step.accent ?? []).some((id) => !has(prev?.accent, id))) sfx.push({ at: 15, sound: SFX.success });
  (step.packets ?? []).forEach((pk) => sfx.push({ at: pk.delay ?? 20, sound: SFX.packet }));

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
            <ArchNode def={catalog[id]} showLabel={false} />
          </div>
        );
      })}

      {ids.map((id) => {
        const isNew = !prev?.layout[id];
        const variant = has(step.danger, id) ? "danger" : has(step.accent, id) ? "accent" : "default";
        // A node shakes for a moment so the eye lands on it: at its `shake` time, or when it first turns red.
        const cueLen = (subtitles[step.cue]?.endFrame ?? 0) - stepStart;
        const shakeAt =
          step.shake?.[id] !== undefined ? step.shake[id]! * cueLen : has(step.danger, id) && !has(prev?.danger, id) ? 4 : null;
        const shake =
          shakeAt === null || t < shakeAt ? 0 : Math.sin((t - shakeAt) * 1.4) * interpolate(t, [shakeAt, shakeAt + 22], [12, 0], CLAMP);
        const node = (
          <ArchNode def={catalog[id]} variant={variant} badge={step.badges?.[id]} showLabel={introduced(id)} />
        );
        return (
          <div
            key={id}
            className="absolute"
            style={{
              left: pos[id].x,
              top: pos[id].y,
              translate: `calc(-50% + ${shake}px) -50%`,
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
            // A blocked packet hits the gate and bounces back a little before it settles.
            progress={
              stopAt < 1
                ? interpolate(t, [delay, end, end + 6, end + 14], [0, stopAt, stopAt - 0.12, stopAt - 0.08], CLAMP)
                : interpolate(t, [delay, end], [0, stopAt], CLAMP)
            }
            label={pk.label}
            danger={(stopAt < 1 && t >= end) || edges.some((e) => e.broken && e.from === pk.from && e.to === pk.to)}
            opacity={interpolate(t, [delay, delay + 5, end, end + 8], [0, 1, 1, stopAt < 1 ? 1 : 0], CLAMP)}
          />
        );
      })}
      {sfx.map(({ at, sound }, k) => (
        <Sequence key={`sfx-${i}-${k}`} from={stepStart + at} layout="none">
          <Audio src={sound.src} volume={sound.volume} premountFor={fps} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
