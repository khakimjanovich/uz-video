import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { useSubtitlesContext } from "../hooks";
import { ScreenBox } from "./ScreenCard";

// What the buyer sees on their own screen, beside the system map: the shop's page, then the bank's real payment page.
export type BuyerScreen = "shop" | "pay-typed" | "pay-paid" | "off";

export interface BuyerStep {
  cue: number;
  screen: BuyerScreen;
  dim?: boolean; // the buyer is not the one acting in this sentence
  focus?: ScreenBox[]; // elements to mark, in the screenshot's 1440 × 900 page pixels
}

const SHOTS: Record<"pay-typed" | "pay-paid", { src: string; title: string }> = {
  "pay-typed": { src: "screens/c-02-card-payment/pay-typed.png", title: "The bank's payment page" },
  "pay-paid": { src: "screens/c-02-card-payment/pay-paid.png", title: "The bank's payment page" },
};

const PAGE = { w: 1440, h: 900 };
const REGION: ScreenBox = [440, 40, 560, 640]; // the payment card inside the page
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const BOX = { x: 1250, y: 250, w: 480, h: 540 };
const DIM = 0.35;

export const buyerStepAt = (steps: BuyerStep[], cue: number) => steps.reduce<BuyerStep | undefined>((found, s) => (s.cue <= cue ? s : found), undefined);
export const buyerViewShown = (steps: BuyerStep[], cue: number) => {
  const s = buyerStepAt(steps, cue);
  return !!s && s.screen !== "off";
};

const Shop: React.FC<{ pressed: boolean }> = ({ pressed }) => (
  <div className="font-mono text-ink" style={{ padding: 28 }}>
    <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 2, borderBottom: "3px solid var(--ink)", paddingBottom: 12 }}>TOY CORNER</div>
    <svg width={424} height={150} viewBox="0 0 424 150" style={{ marginTop: 18 }}>
      <rect x={1.5} y={1.5} width={421} height={147} rx={10} fill="none" stroke="var(--ink-muted)" strokeWidth={3} strokeDasharray="8 6" />
      <g transform="translate(0 -26)" fill="none" stroke="var(--ink)" strokeWidth={5} strokeLinejoin="round">
        <rect x={110} y={84} width={80} height={52} rx={4} />
        <rect x={198} y={64} width={64} height={72} rx={4} />
        <rect x={214} y={36} width={32} height={28} rx={3} />
        <rect x={270} y={100} width={44} height={36} rx={4} />
        <circle cx={132} cy={146} r={14} fill="var(--paper)" />
        <circle cx={176} cy={146} r={14} fill="var(--paper)" />
        <circle cx={226} cy={146} r={14} fill="var(--paper)" />
        <circle cx={292} cy={146} r={14} fill="var(--paper)" />
      </g>
    </svg>
    <div style={{ fontSize: 28, fontWeight: 700, marginTop: 14 }}>Wooden train set</div>
    <div style={{ fontSize: 30, marginTop: 6 }}>2,499.00</div>
    <div className="flex" style={{ gap: 16, marginTop: 20 }}>
      <div style={{ flex: 1, border: "3px solid var(--ink)", padding: "14px 0", textAlign: "center", fontSize: 24, fontWeight: 700 }}>ADD TO CART</div>
      <div style={{ flex: 1, border: "3px solid var(--ink)", background: pressed ? "var(--ink)" : "var(--paper)", color: pressed ? "var(--paper)" : "var(--ink)", padding: "14px 0", textAlign: "center", fontSize: 24, fontWeight: 700 }}>PAY</div>
    </div>
  </div>
);

export const BuyerView: React.FC<{ steps: BuyerStep[] }> = ({ steps }) => {
  const frame = useCurrentFrame();
  const { cueIndex, subtitles } = useSubtitlesContext();
  const now = buyerStepAt(steps, cueIndex);
  if (!now || now.screen === "off") return null;
  const prev = buyerStepAt(steps, now.cue - 1);
  const t = interpolate(frame - (subtitles[now.cue]?.startFrame ?? 0), [0, 10], [0, 1], CLAMP);
  const level = (s?: BuyerStep) => (s && s.screen !== "off" ? (s.dim ? DIM : 1) : 0);
  const opacity = level(prev) + (level(now) - level(prev)) * t;
  const bar = 44;
  const scale = Math.min(BOX.w / REGION[2], (BOX.h - bar) / REGION[3]);
  const shot = now.screen === "shop" ? undefined : SHOTS[now.screen];

  return (
    <div className="absolute border-[3px] border-ink bg-paper overflow-hidden" style={{ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h, opacity }}>
      <div className="flex items-center gap-3 px-4 font-mono text-[18px] tracking-wider border-b-[3px] border-ink" style={{ height: bar }}>
        <span className="inline-block w-3 h-3 rounded-full border-2 border-ink" />
        <span className="inline-block w-3 h-3 rounded-full border-2 border-ink" />
        <span className="ml-2 uppercase">{shot ? shot.title : "The shop's website"}</span>
      </div>
      <div className="relative overflow-hidden" style={{ width: BOX.w, height: BOX.h - bar }}>
        {shot ? (
          <div style={{ position: "absolute", left: (BOX.w - REGION[2] * scale) / 2 - REGION[0] * scale, top: -REGION[1] * scale, width: PAGE.w * scale, height: PAGE.h * scale }}>
            <Img src={staticFile(shot.src)} style={{ width: "100%", height: "100%" }} />
            {(now.focus ?? []).map(([fx, fy, fw, fh], i) => (
              <div key={i} className="absolute" style={{ left: fx * scale - 6, top: fy * scale - 6, width: fw * scale + 12, height: fh * scale + 12, border: "5px solid var(--marker)", borderRadius: 8, opacity: t }} />
            ))}
          </div>
        ) : (
          <Shop pressed={!now.dim} />
        )}
      </div>
    </div>
  );
};
