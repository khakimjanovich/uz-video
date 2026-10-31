import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useSubtitlesContext } from "../hooks";

// A later cue of the same card: show more lines, move the marker. Lines are 1-based positions in `lines` (or `table.rows`).
export interface CodeBeat {
  cue: number;
  upTo?: number; // lines 1..upTo are visible from this cue on (default: all)
  highlight?: number[];
}

// One real file, config or terminal session, shown on a code beat.
export interface CodeStep {
  cue: number;
  file: string; // path inside the repo, e.g. cards-infra/docker-compose.yml, or "terminal · cards-infra"
  lines?: string[]; // "$ …" lines are commands; "…" is an elision
  table?: { columns: string[]; rows: string[][] }; // the table variant, instead of lines
  at?: number | (number | null)[]; // real line numbers: the first one, or one per line (null = no number); the title shows the range
  highlight?: number[];
  upTo?: number; // lines visible at `cue` (default: all); later beats reveal the rest
  beats?: CodeBeat[];
  blur?: string[]; // names that must not show on screen (blurred wherever they appear)
  small?: boolean; // long commands: a smaller font, so a whole command fits on one line
  columns?: 2; // a long list (a whole table's columns) flows into two columns
}

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const numbersOf = (step: CodeStep, count: number): (number | null)[] =>
  Array.isArray(step.at) ? step.at : step.at === undefined ? [] : Array.from({ length: count }, (_, k) => (step.at as number) + k);

const titleOf = (step: CodeStep, numbers: (number | null)[]) => {
  const real = numbers.filter((n): n is number => n !== null);
  // Lines picked from across a file (out of order) show the file only; the gutter has their numbers.
  if (!real.length || real.some((n, k) => k > 0 && n < real[k - 1])) return step.file;
  const [a, b] = [Math.min(...real), Math.max(...real)];
  return `${step.file}:${a === b ? a : `${a}–${b}`}`;
};

const Blurred: React.FC<{ text: string; names?: string[] }> = ({ text, names }) => {
  if (!names?.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`));
  return (
    <>
      {parts.map((p, k) => (names.includes(p) ? <span key={k} style={{ filter: "blur(9px)" }}>{p}</span> : p))}
    </>
  );
};

// Lines type in one after another as they become visible; highlighted lines get the marker.
export const CodeCard: React.FC<{ step: CodeStep; x: number; y: number; w: number; h: number }> = ({ step, x, y, w, h }) => {
  const frame = useCurrentFrame();
  const { subtitles, cueIndex } = useSubtitlesContext();
  const count = step.table?.rows.length ?? step.lines?.length ?? 0;
  const states = [{ cue: step.cue, upTo: step.upTo, highlight: step.highlight }, ...(step.beats ?? [])];
  const now = states.filter((s) => s.cue <= cueIndex).pop() ?? states[0];
  const highlight = now.highlight ?? [];
  // The frame each line starts typing: the start of the first beat that shows it, then two frames per line within that beat.
  const shownAt = (i: number) => {
    const k = states.findIndex((s) => (s.upTo ?? count) > i);
    const prevUpTo = k > 0 ? states[k - 1].upTo ?? count : 0;
    return (subtitles[states[k].cue]?.startFrame ?? 0) + (i - prevUpTo) * 2;
  };
  const style = (i: number): React.CSSProperties => {
    const marked = highlight.includes(i + 1);
    return {
      opacity: (now.upTo ?? count) > i ? interpolate(frame - shownAt(i), [0, 6], [0, 1], CLAMP) : 0,
      background: marked ? "rgba(255, 210, 63, 0.18)" : undefined,
      borderLeft: marked ? "5px solid var(--marker)" : "5px solid transparent",
    };
  };
  const numbers = numbersOf(step, count);

  return (
    <div className="absolute bg-ink text-paper font-mono overflow-hidden" style={{ left: x, top: y, width: w, height: h }}>
      <div className="px-6 py-3 text-[20px] tracking-wider border-b-[2px] border-dotted" style={{ color: "var(--marker)", borderColor: "var(--ink-muted)" }}>
        {titleOf(step, numbers)}
      </div>
      {step.table ? (
        <table className="w-full text-[22px] leading-[1.35] border-collapse" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              {step.table.columns.map((c) => (
                <th key={c} className="text-left uppercase tracking-wider px-5 py-3 border-b-[2px] border-dotted" style={{ color: "var(--marker)", borderColor: "var(--ink-muted)" }}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {step.table.rows.map((row, i) => (
              <tr key={i} style={style(i)}>
                {row.map((cell, k) => (
                  <td key={k} className="align-top px-5 py-3 border-b-[2px] border-dotted" style={{ borderColor: "var(--ink-muted)" }}>
                    <Blurred text={cell} names={step.blur} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          className={`px-6 py-4 whitespace-pre ${step.columns === 2 || step.small ? "text-[19px] leading-[1.4]" : "text-[24px] leading-[1.45]"}`}
          style={step.columns === 2 ? { columnCount: 2, columnGap: 28, columnFill: "auto", height: h - 70 } : undefined}
        >
          {(step.lines ?? []).map((line, i) => (
            <div key={i} style={{ ...style(i), paddingLeft: 12, breakInside: "avoid" }}>
              {numbers.length ? (
                <span style={{ color: "var(--ink-muted)", marginRight: 20 }}>{String(numbers[i] ?? "").padStart(3, " ")}</span>
              ) : null}
              {line.startsWith("$ ") ? (
                <>
                  <span style={{ color: "var(--marker)" }}>$ </span>
                  <Blurred text={line.slice(2)} names={step.blur} />
                </>
              ) : (
                <span style={{ color: line === "…" ? "var(--ink-muted)" : undefined }}>
                  <Blurred text={line || " "} names={step.blur} />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
