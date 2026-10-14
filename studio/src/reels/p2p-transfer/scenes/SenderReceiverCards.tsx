import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { UiCard, StatusBadge, MotionBox } from "../../../components";

export const SenderReceiverCards: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transferProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 75, mass: 0.9 },
  });

  const senderBalance = Math.round(
    interpolate(frame, [38, 62], [1200000, 700000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const receiverBalance = Math.round(
    interpolate(frame, [60, 84], [250000, 750000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const formatUZS = (val: number) =>
    val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";

  return (
    <MotionBox enter="pop" delay={2} className="absolute top-[280px] left-[60px] right-[60px] h-[450px]">
      <div className="w-full h-full flex gap-6">
        {/* SENDER PHONE CARD (Payme / Kapitalbank) */}
        <UiCard className="flex-1 p-7.5 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9.5 h-9.5 rounded-xl bg-[#00BFA5] text-white font-black text-xl flex items-center justify-center">
                  P
                </div>
                <div>
                  <div className="text-[22px] font-extrabold text-primary">Payme</div>
                  <div className="text-base text-secondary">Alisher M.</div>
                </div>
              </div>
              <StatusBadge>HUMO</StatusBadge>
            </div>

            {/* Virtual Card */}
            <div
              className="p-5 px-5.5 rounded-[20px] text-white mb-5 shadow-md"
              style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
            >
              <div className="text-sm tracking-wider text-slate-400 uppercase mb-1.5">
                Kapitalbank
              </div>
              <div className="text-lg tracking-widest font-semibold font-mono mb-3.5">
                9860 •••• •••• 4210
              </div>
              <div className="text-[13px] text-slate-400">Karta balansi</div>
              <div className="text-[30px] font-extrabold tracking-tight">
                {formatUZS(senderBalance)}
              </div>
            </div>
          </div>

          {/* Action Status */}
          <div
            className={`p-4 px-5 rounded-[18px] flex items-center justify-between border ${
              frame >= 38 ? "bg-danger-subtle border-danger/40" : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[22px]">{frame >= 38 ? "📤" : "💳"}</span>
              <span
                className={`text-lg font-bold ${frame >= 38 ? "text-danger" : "text-secondary"}`}
              >
                {frame >= 38 ? "-500 000 UZS" : "O'tkazma tayyor"}
              </span>
            </div>
            {frame >= 38 && <StatusBadge tone="danger">Yuborildi</StatusBadge>}
          </div>
        </UiCard>

        {/* RECEIVER PHONE CARD (Click / Ipak Yo'li) */}
        <UiCard className="flex-1 p-7.5 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9.5 h-9.5 rounded-xl bg-[#0284C7] text-white font-black text-xl flex items-center justify-center">
                  C
                </div>
                <div>
                  <div className="text-[22px] font-extrabold text-primary">Click</div>
                  <div className="text-base text-secondary">Bobur T.</div>
                </div>
              </div>
              <StatusBadge>UZCARD</StatusBadge>
            </div>

            {/* Virtual Card */}
            <div
              className="p-5 px-5.5 rounded-[20px] text-white mb-5 shadow-md"
              style={{ background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)" }}
            >
              <div className="text-sm tracking-wider text-sky-200 uppercase mb-1.5">
                Ipak Yo&apos;li Bank
              </div>
              <div className="text-lg tracking-widest font-semibold font-mono mb-3.5">
                8600 •••• •••• 9912
              </div>
              <div className="text-[13px] text-sky-200">Karta balansi</div>
              <div className="text-[30px] font-extrabold tracking-tight">
                {formatUZS(receiverBalance)}
              </div>
            </div>
          </div>

          {/* Action Status */}
          <div
            className={`p-4 px-5 rounded-[18px] flex items-center justify-between border ${
              frame >= 60 ? "bg-success-subtle border-success/40" : "bg-card border-border"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[22px]">{frame >= 60 ? "📥" : "⏳"}</span>
              <span
                className={`text-lg font-bold ${frame >= 60 ? "text-success" : "text-secondary"}`}
              >
                {frame >= 60 ? "+500 000 UZS" : "Kutilmoqda..."}
              </span>
            </div>
            {frame >= 60 && <StatusBadge tone="success">0.4 soniya! ⚡</StatusBadge>}
          </div>
        </UiCard>

        {/* Moving Money Pill Animation */}
        {frame >= 28 && frame <= 74 && (
          <div
            className="absolute top-1/2 z-30 p-2.5 px-5 rounded-full text-white font-extrabold text-lg shadow-xl flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              left: `${interpolate(transferProgress, [0, 1], [180, 720], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}px`,
              translate: "0 -50%",
              scale: interpolate(transferProgress, [0, 0.5, 1], [0.85, 1.15, 0.95], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span>💸</span>
            <span>500 000 UZS</span>
          </div>
        )}
      </div>
    </MotionBox>
  );
};
