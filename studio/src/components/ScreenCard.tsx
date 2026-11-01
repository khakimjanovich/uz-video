import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useSubtitlesContext } from "../hooks";

// A box on a screenshot, in the page's own pixels (screenshots are taken at 1440 × 900).
export type ScreenBox = [x: number, y: number, w: number, h: number];

// A later cue of the same screenshot: zoom to another part, mark other elements.
export interface ScreenBeat {
  cue: number;
  region?: ScreenBox;
  focus?: ScreenBox[];
}

// One real product screen (ecom-front, taken by screens/), shown on a "watch the product" beat.
export interface ScreenStep {
  cue: number;
  src: string; // under studio/public, e.g. "screens/c-16-registration/signup.png" (generated, git-ignored)
  title: string; // the window's title bar: which portal, which page
  region?: ScreenBox; // the part of the page to fill the card with (default: the whole page)
  focus?: ScreenBox[]; // elements to mark
  beats?: ScreenBeat[];
}

const PAGE = { w: 1440, h: 900 };
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// The screenshot in a plain window; the region eases in when a beat changes it, marked elements get the marker box.
export const ScreenCard: React.FC<{ step: ScreenStep; x: number; y: number; w: number; h: number }> = ({ step, x, y, w, h }) => {
  const frame = useCurrentFrame();
  const { subtitles, cueIndex } = useSubtitlesContext();
  const states = [{ cue: step.cue, region: step.region, focus: step.focus }, ...(step.beats ?? [])];
  const k = states.reduce((found, s, i) => (s.cue <= cueIndex ? i : found), 0);
  const now = states[k];
  const before = states[Math.max(0, k - 1)];
  const full: ScreenBox = [0, 0, PAGE.w, PAGE.h];
  const t = interpolate(frame - (subtitles[now.cue]?.startFrame ?? 0), [0, 12], [0, 1], CLAMP);
  const ease = (a: number, b: number) => a + (b - a) * (1 - Math.pow(1 - t, 3));
  const from = before.region ?? full;
  const to = now.region ?? full;
  const region = to.map((v, i) => ease(from[i], v)) as ScreenBox;
  const bar = 44;
  const scale = Math.min(w / region[2], (h - bar) / region[3]);
  const fade = interpolate(frame - (subtitles[step.cue]?.startFrame ?? 0), [0, 8], [0, 1], CLAMP);

  return (
    <div className="absolute border-[3px] border-ink bg-paper overflow-hidden" style={{ left: x, top: y, width: w, height: h, opacity: fade }}>
      <div className="flex items-center gap-3 px-4 font-mono text-[18px] tracking-wider border-b-[3px] border-ink" style={{ height: bar }}>
        <span className="inline-block w-3 h-3 rounded-full border-2 border-ink" />
        <span className="inline-block w-3 h-3 rounded-full border-2 border-ink" />
        <span className="ml-2 uppercase">{step.title}</span>
      </div>
      <div className="relative overflow-hidden" style={{ width: w, height: h - bar }}>
        <div style={{ position: "absolute", left: -region[0] * scale, top: -region[1] * scale, width: PAGE.w * scale, height: PAGE.h * scale }}>
          <Img src={staticFile(step.src)} style={{ width: "100%", height: "100%" }} />
          {(now.focus ?? []).map(([fx, fy, fw, fh], i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: fx * scale - 6,
                top: fy * scale - 6,
                width: fw * scale + 12,
                height: fh * scale + 12,
                border: "5px solid var(--marker)",
                borderRadius: 8,
                opacity: t,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
