import React from "react";
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { getThemeTokens, ReelProps, ThemeName } from "../../themes";
import {
  ReelBackground,
  ReelHeader,
  SubtitleCard,
  RegulatoryFooter,
  UiCard,
  StatusBadge,
} from "../../components";

export const FPS = 30;
export const DURATION_IN_FRAMES = 345;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// Subtitles exact timings from subtitles.srt
const SUBTITLES = [
  {
    startFrame: 3, // 00:00:00,100
    endFrame: 151, // 00:00:05,086
    text: "Do'stingizga Payme yoki Click orqali pul yubordingiz, u bir zumda keldi.",
    prefix: "Do'stingizga Payme yoki Click orqali pul yubordingiz, u ",
    highlight: "bir zumda keldi",
    suffix: ".",
  },
  {
    startFrame: 151, // 00:00:05,036
    endFrame: 254, // 00:00:08,537
    text: "Lekin banklar orasida hali bir so'm ham ko'chmagan.",
    prefix: "Lekin banklar orasida hali ",
    highlight: "bir so'm ham ko'chmagan",
    suffix: ".",
  },
  {
    startFrame: 254, // 00:00:08,537
    endFrame: 345, // 00:00:10,477 + padding
    text: "Pul qayerdan keldi?",
    prefix: "",
    highlight: "Pul qayerdan keldi?",
    suffix: "",
  },
];

export const P2PTransferComposition: React.FC = () => {
  return (
    <Composition
      id="p2p-transfer"
      component={P2PVideo}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={{
        theme: "dark" as ThemeName,
      }}
    />
  );
};

export const P2PVideo: React.FC<ReelProps> = ({ theme = "dark" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases
  const isPhase1 = frame < 145;
  const isPhase2 = frame >= 145 && frame < 252;
  const isPhase3 = frame >= 252;

  // Active Continuous Theme Tokens (Pure Dark or Pure Light throughout)
  const tokens = getThemeTokens(theme);

  // Springs & Animations
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const cardsEntrance = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 95 } });
  const phase2Spring = spring({ frame: frame - 145, fps, config: { damping: 12, stiffness: 100 } });
  const phase3Spring = spring({ frame: frame - 252, fps, config: { damping: 12, stiffness: 95 } });

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

  const formatUZS = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
  };

  const currentSubtitle =
    SUBTITLES.find((s) => frame >= s.startFrame && frame <= s.endFrame) ||
    SUBTITLES[SUBTITLES.length - 1];

  const lockPulse = 1 + Math.sin(frame * 0.25) * 0.08;

  return (
    <AbsoluteFill
      className="overflow-hidden relative font-sans"
      style={{
        backgroundColor: tokens.background,
        color: tokens.textColor,
      }}
    >
      <Audio src={staticFile("reels/p2p-transfer/voiceover.mp3")} premountFor={fps} />

      {/* Decorative Grid & Ambient Glows */}
      <ReelBackground tokens={tokens} isPhase2={isPhase2} />

      {/* 1. Header & Title */}
      <ReelHeader
        tokens={tokens}
        springProgress={headerSpring}
        badgeDotColor={isPhase2 ? "#EF4444" : "#10B981"}
        badgeText={
          isPhase1
            ? "⚡ P2P O'TKAZMA ANATOMIYASI"
            : isPhase2
            ? "⚠️ BANKLARARO SIR FOSh BO'LDI"
            : "🤔 QAYERDAN KELDI BU PUL?"
        }
        title={
          isPhase1 ? (
            <span>
              Payme orqali 500 000 so&apos;m yubordingiz:{" "}
              <span className="text-[#00BFA5]">u bir zumda yetib bordi!</span>
            </span>
          ) : isPhase2 ? (
            <span>
              Lekin banklar orasida hali{" "}
              <span className="text-[#EF4444]">1 tiyin ham ko&apos;chmadi!</span>
            </span>
          ) : (
            <span>Pul qayerdan paydo bo&apos;ldi?</span>
          )
        }
      />

      {/* 2. Top Phone Cards (Sender & Receiver) */}
      <div
        className="absolute top-[280px] left-[60px] right-[60px] h-[450px] flex gap-6"
        style={{
          transform: `scale(${interpolate(cardsEntrance, [0, 1], [0.9, 1])})`,
          opacity: cardsEntrance,
        }}
      >
        {/* SENDER PHONE CARD (Payme / Kapitalbank) */}
        <UiCard tokens={tokens} className="flex-1 p-7.5 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9.5 h-9.5 rounded-xl bg-[#00BFA5] text-white font-black text-xl flex items-center justify-center">
                  P
                </div>
                <div>
                  <div className="text-[22px] font-extrabold" style={{ color: tokens.textColor }}>
                    Payme
                  </div>
                  <div className="text-base" style={{ color: tokens.subtextColor }}>
                    Alisher M.
                  </div>
                </div>
              </div>
              <StatusBadge tokens={tokens}>HUMO</StatusBadge>
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
            className="p-4 px-5 rounded-[18px] flex items-center justify-between"
            style={{
              backgroundColor:
                frame >= 38
                  ? tokens.isDark
                    ? "rgba(239, 68, 68, 0.15)"
                    : "#FEF2F2"
                  : tokens.isDark
                  ? "rgba(30, 41, 59, 0.7)"
                  : "#F8FAFC",
              border: `1.5px solid ${
                frame >= 38
                  ? tokens.isDark
                    ? "rgba(239, 68, 68, 0.4)"
                    : "#FCA5A5"
                  : tokens.isDark
                  ? "rgba(56, 189, 248, 0.22)"
                  : "#E2E8F0"
              }`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[22px]">{frame >= 38 ? "📤" : "💳"}</span>
              <span
                className="text-lg font-bold"
                style={{
                  color: frame >= 38 ? (tokens.isDark ? "#F87171" : "#DC2626") : tokens.subtextColor,
                }}
              >
                {frame >= 38 ? "-500 000 UZS" : "O'tkazma tayyor"}
              </span>
            </div>
            {frame >= 38 && (
              <StatusBadge tokens={tokens} tone="danger">
                Yuborildi
              </StatusBadge>
            )}
          </div>
        </UiCard>

        {/* RECEIVER PHONE CARD (Click / Ipak Yo'li) */}
        <UiCard tokens={tokens} className="flex-1 p-7.5 flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-4.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9.5 h-9.5 rounded-xl bg-[#0284C7] text-white font-black text-xl flex items-center justify-center">
                  C
                </div>
                <div>
                  <div className="text-[22px] font-extrabold" style={{ color: tokens.textColor }}>
                    Click
                  </div>
                  <div className="text-base" style={{ color: tokens.subtextColor }}>
                    Bobur T.
                  </div>
                </div>
              </div>
              <StatusBadge tokens={tokens}>UZCARD</StatusBadge>
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
            className="p-4 px-5 rounded-[18px] flex items-center justify-between"
            style={{
              backgroundColor:
                frame >= 60
                  ? tokens.isDark
                    ? "rgba(16, 185, 129, 0.15)"
                    : "#ECFDF5"
                  : tokens.isDark
                  ? "rgba(30, 41, 59, 0.7)"
                  : "#F8FAFC",
              border: `1.5px solid ${
                frame >= 60
                  ? tokens.isDark
                    ? "rgba(16, 185, 129, 0.4)"
                    : "#6EE7B7"
                  : tokens.isDark
                  ? "rgba(56, 189, 248, 0.22)"
                  : "#E2E8F0"
              }`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[22px]">{frame >= 60 ? "📥" : "⏳"}</span>
              <span
                className="text-lg font-bold"
                style={{
                  color: frame >= 60 ? (tokens.isDark ? "#34D399" : "#059669") : tokens.subtextColor,
                }}
              >
                {frame >= 60 ? "+500 000 UZS" : "Kutilmoqda..."}
              </span>
            </div>
            {frame >= 60 && (
              <StatusBadge tokens={tokens} tone="success">
                0.4 soniya! ⚡
              </StatusBadge>
            )}
          </div>
        </UiCard>

        {/* Moving Money Pill Animation */}
        {frame >= 28 && frame <= 74 && (
          <div
            className="absolute top-1/2 z-30 p-2.5 px-5 rounded-full text-white font-extrabold text-lg shadow-xl flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              left: `${interpolate(transferProgress, [0, 1], [180, 720])}px`,
              transform: `translateY(-50%) scale(${interpolate(
                transferProgress,
                [0, 0.5, 1],
                [0.85, 1.15, 0.95]
              )})`,
            }}
          >
            <span>💸</span>
            <span>500 000 UZS</span>
          </div>
        )}
      </div>

      {/* 3. Middle Flow (Architecture / Reality / Explanation) */}
      <div className="absolute top-[780px] left-[60px] right-[60px] h-[690px] flex flex-col justify-center">
        {/* PHASE 1: User's Illusion */}
        {isPhase1 && (
          <UiCard tokens={tokens} variant="middle" className="p-11 px-9 text-center">
            <div
              className="text-lg font-bold uppercase tracking-wider mb-3"
              style={{ color: tokens.subtextColor }}
            >
              Foydalanuvchi ko&apos;zidagi holat
            </div>
            <div
              className="text-[34px] font-extrabold mb-8"
              style={{ color: tokens.textColor }}
            >
              To&apos;lov shlyuzi tranzaksiyani bir zumda tasdiqladi
            </div>

            <div className="flex items-center justify-center gap-5">
              <div
                className="p-4.5 px-7 rounded-[20px] font-bold text-[22px]"
                style={{
                  backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.8)" : "#F1F5F9",
                  border: tokens.cardBorder,
                  color: tokens.textColor,
                }}
              >
                Kapitalbank (HUMO)
              </div>
              <div className="text-[28px] text-[#10B981] font-black">➔ ⚡ ➔</div>
              <div
                className="p-4.5 px-7 rounded-[20px] font-bold text-[22px]"
                style={{
                  backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.8)" : "#F1F5F9",
                  border: tokens.cardBorder,
                  color: tokens.textColor,
                }}
              >
                Ipak Yo&apos;li (UZCARD)
              </div>
            </div>

            <div className="mt-9">
              <StatusBadge tokens={tokens} tone="success" className="p-3.5 px-7 rounded-full text-xl font-bold">
                <span>⏱️ Tranzaksiya tezligi:</span>
                <span className="font-black text-[#10B981]">0.38 soniya</span>
              </StatusBadge>
            </div>
          </UiCard>
        )}

        {/* PHASE 2: Interbank Reality (0 so'm moved!) */}
        {isPhase2 && (
          <UiCard
            tokens={tokens}
            variant="danger"
            className="p-11 px-9.5 text-center"
            style={{
              transform: `scale(${interpolate(phase2Spring, [0, 1], [0.92, 1])})`,
              opacity: phase2Spring,
            }}
          >
            <StatusBadge tokens={tokens} tone="danger" className="mb-5 uppercase tracking-wider text-lg">
              ⚠️ PARDA ORTIDAGI HAQIQAT
            </StatusBadge>

            <div
              className="text-[38px] font-extrabold leading-tight mb-6.5"
              style={{ color: tokens.textColor }}
            >
              Banklar hisob raqamlari o&apos;rtasida:
            </div>

            {/* BIG HIGHLIGHT COUNTER */}
            <div
              className="p-6.5 px-9 rounded-3xl mb-7"
              style={{
                backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.15)" : "#FFF1F2",
                border: "2.5px dashed #EF4444",
              }}
            >
              <div className="text-[74px] font-black text-[#DC2626] tracking-tight">
                0 SO&apos;M
              </div>
              <div
                className="text-[22px] font-bold mt-1.5"
                style={{ color: tokens.isDark ? "#FCA5A5" : "#991B1B" }}
              >
                Hozirgacha bir so&apos;m ham o&apos;tkazilmagan!
              </div>
            </div>

            <div
              className="flex justify-between items-center p-5 px-6 rounded-[20px]"
              style={{
                backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.8)" : "#F8FAFC",
                border: tokens.cardBorder,
              }}
            >
              <div className="text-left">
                <div className="text-base font-semibold" style={{ color: tokens.subtextColor }}>
                  Bank A Nostro
                </div>
                <div className="text-xl font-extrabold" style={{ color: tokens.textColor }}>
                  Kapitalbank
                </div>
              </div>
              <StatusBadge
                tokens={tokens}
                tone="danger"
                className="p-2.5 px-5 rounded-2xl text-lg flex items-center gap-2"
                style={{ transform: `scale(${lockPulse})` }}
              >
                <span>🔒</span>
                <span>Qatnov yo&apos;q</span>
              </StatusBadge>
              <div className="text-right">
                <div className="text-base font-semibold" style={{ color: tokens.subtextColor }}>
                  Bank B Nostro
                </div>
                <div className="text-xl font-extrabold" style={{ color: tokens.textColor }}>
                  Ipak Yo&apos;li Bank
                </div>
              </div>
            </div>
          </UiCard>
        )}

        {/* PHASE 3: The Mystery & Explanation */}
        {isPhase3 && (
          <UiCard
            tokens={tokens}
            variant="accent"
            className="p-10 px-9"
            style={{
              transform: `scale(${interpolate(phase3Spring, [0, 1], [0.92, 1])})`,
              opacity: phase3Spring,
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0284C7] text-white text-[32px] font-black flex items-center justify-center">
                ?
              </div>
              <div>
                <div className="text-4xl font-black tracking-tight" style={{ color: tokens.textColor }}>
                  Pul qayerdan keldi?
                </div>
                <div className="text-lg font-semibold" style={{ color: tokens.subtextColor }}>
                  Fintech arxitekturasining 3 asosiy qoidasi:
                </div>
              </div>
            </div>

            {/* 3 Staggered Explanation Pillars */}
            <div className="flex flex-col gap-4">
              {[
                {
                  num: "1",
                  title: "Markaziy Protsessing Kafolati",
                  desc: "HUMO & UZCARD banklar o'rtasida to'lov kafolatini oladi.",
                  startAt: 254,
                },
                {
                  num: "2",
                  title: "Ichki Daftardagi Yozuv (Ledger)",
                  desc: "Qabul qiluvchi bank o'z hisobidan mijozga kredit yozadi.",
                  startAt: 268,
                },
                {
                  num: "3",
                  title: "Kechki Kliring & Netting (17:00)",
                  desc: "Real pul Markaziy Bank kliring tizimi orqali kechqurun to'planadi.",
                  startAt: 282,
                },
              ].map((item, idx) => {
                const itemSpring = spring({
                  frame: frame - item.startAt,
                  fps,
                  config: { damping: 14, stiffness: 100 },
                });
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4.5 p-4 px-5 rounded-[20px]"
                    style={{
                      backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC",
                      border: tokens.cardBorder,
                      transform: `translateY(${interpolate(itemSpring, [0, 1], [20, 0])}px)`,
                      opacity: itemSpring,
                    }}
                  >
                    <div
                      className="w-10.5 h-10.5 rounded-2xl flex items-center justify-center font-extrabold text-xl shrink-0"
                      style={{
                        backgroundColor: tokens.isDark ? "#38BDF8" : "#0F172A",
                        color: tokens.isDark ? "#0F172A" : "#FFFFFF",
                      }}
                    >
                      {item.num}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-extrabold mb-1" style={{ color: tokens.textColor }}>
                        {item.title}
                      </div>
                      <div className="text-base" style={{ color: tokens.subtextColor }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </UiCard>
        )}
      </div>

      {/* 4. Synced Subtitle Card */}
      <SubtitleCard currentSubtitle={currentSubtitle} isPhase2={isPhase2} tokens={tokens} />

      {/* 5. Regulatory Footer */}
      <RegulatoryFooter
        tokens={tokens}
        icon="🏛️"
        text="Manba: O'zbekiston Respublikasi Markaziy Banki Kliring va Hisob-kitob qoidalari"
      />
    </AbsoluteFill>
  );
};
