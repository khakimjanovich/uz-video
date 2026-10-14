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
export const DURATION_IN_FRAMES = 510;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

// Subtitles exact timings from subtitles.srt
const SUBTITLES = [
  {
    startFrame: 3, // 00:00:00,100
    endFrame: 191, // 00:00:06,432
    prefix: "Yetkazib berish ilovasida 'Kartani saqlash' tugmasini bosganingizda, ",
    highlight: "karta raqamingiz qayerga boradi?",
    suffix: "",
  },
  {
    startFrame: 191, // 00:00:06,382
    endFrame: 332, // 00:00:11,068
    prefix: "Aslida ilovaning o'zi karta raqamingizni ",
    highlight: "umuman ko'rmaydi va saqlamaydi",
    suffix: ".",
  },
  {
    startFrame: 332, // 00:00:11,068
    endFrame: 510, // 00:00:15,977 + padding
    prefix: "Unga ",
    highlight: "faqat maxsus Token beriladi",
    suffix: ", karta esa xavfsiz bank omborida qoladi.",
  },
];

export const CardTokenizationComposition: React.FC = () => {
  return (
    <Composition
      id="card-tokenization"
      component={CardTokenizationVideo}
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

export const CardTokenizationVideo: React.FC<ReelProps> = ({ theme = "dark" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases
  const isPhase1 = frame < 188;
  const isPhase2 = frame >= 188 && frame < 330;
  const isPhase3 = frame >= 330;

  // Active Continuous Theme Tokens (Pure Dark or Pure Light throughout)
  const tokens = getThemeTokens(theme);

  // Springs & Animations
  const headerSpring = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const appCardSpring = spring({ frame: frame - 6, fps, config: { damping: 13, stiffness: 95 } });
  const phase2Spring = spring({ frame: frame - 188, fps, config: { damping: 13, stiffness: 100 } });
  const phase3Spring = spring({ frame: frame - 330, fps, config: { damping: 13, stiffness: 95 } });

  const buttonTapScale = interpolate(frame, [40, 46, 54], [1, 0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardDigitsDisappear = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 85 },
  });

  // Typewriter token animation
  const fullToken = "tok_uz_89f02c19a4e7";
  const tokenLength = Math.min(
    fullToken.length,
    Math.floor(
      interpolate(frame, [345, 385], [0, fullToken.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const displayedToken = fullToken.slice(0, tokenLength);

  const currentSubtitle =
    SUBTITLES.find((s) => frame >= s.startFrame && frame <= s.endFrame) ||
    SUBTITLES[SUBTITLES.length - 1];

  const scanLineY = interpolate((frame - 188) % 60, [0, 60], [0, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="overflow-hidden relative font-sans"
      style={{
        backgroundColor: tokens.background,
        color: tokens.textColor,
      }}
    >
      <Audio src={staticFile("reels/card-tokenization/voiceover.mp3")} premountFor={fps} />

      {/* Decorative Grid & Ambient Glows */}
      <ReelBackground tokens={tokens} isPhase2={isPhase2} />

      {/* 1. Header & Title */}
      <ReelHeader
        tokens={tokens}
        springProgress={headerSpring}
        badgeDotColor={isPhase2 ? "#EF4444" : isPhase3 ? "#0284C7" : "#10B981"}
        badgeText={
          isPhase1
            ? "🔐 FINTECH SIRI • KARTA XAVFSIZLIGI"
            : isPhase2
            ? "⚠️ SHOK HAQIQAT: BAZADA KARTA YO'Q!"
            : "⚡ TOKENIZATSIYA MO'JIZASI"
        }
        title={
          isPhase1 ? (
            <span>
              &apos;Kartani saqlash&apos;da raqam{" "}
              <span className="text-[#0284C7]">qayerga boradi?</span>
            </span>
          ) : isPhase2 ? (
            <span>
              Yetkazib beruvchi kartangizni{" "}
              <span className="text-[#EF4444]">umuman ko&apos;rmaydi!</span>
            </span>
          ) : (
            <span>
              Ilovaga faqat <span className="text-[#0284C7]">xavfsiz TOKEN</span> beriladi
            </span>
          )
        }
      />

      {/* 2. Top UI Card: Food Delivery Checkout */}
      <div
        className="absolute top-[275px] left-[60px] right-[60px]"
        style={{
          transform: `scale(${interpolate(appCardSpring, [0, 1], [0.92, 1])})`,
          opacity: appCardSpring,
        }}
      >
        <UiCard tokens={tokens} className="p-8 flex flex-col gap-5">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#7000FF] text-white flex items-center justify-center text-[22px] font-black">
                🛵
              </div>
              <div>
                <div className="text-2xl font-extrabold" style={{ color: tokens.textColor }}>
                  Yetkazib berish ilovasi
                </div>
                <div className="text-base" style={{ color: tokens.subtextColor }}>
                  Buyurtma: Issiq Lavash + Cola • 85 000 so&apos;m
                </div>
              </div>
            </div>
            <StatusBadge tokens={tokens}>Buyurtma #4821</StatusBadge>
          </div>

          {/* Bank Card Input Box */}
          <div
            className="p-5 px-6 rounded-[22px] text-white flex justify-between items-center shadow-md"
            style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
          >
            <div>
              <div className="text-[13px] tracking-wider text-slate-400 uppercase mb-1.5">
                Kiritilgan Bank Kartasi
              </div>
              <div className="text-[26px] tracking-widest font-bold font-mono">
                {frame < 55 ? (
                  <span>8600 4521 8901 9912</span>
                ) : (
                  <span style={{ opacity: cardDigitsDisappear }}>
                    8600 •••• •••• <span className="text-[#38BDF8]">9912</span>
                  </span>
                )}
              </div>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 text-base font-bold text-[#38BDF8]">
              UZCARD
            </div>
          </div>

          {/* Toggle & Submit Button */}
          <div className="flex items-center justify-between gap-4">
            <div
              className="flex items-center gap-3 p-3 px-4.5 rounded-2xl"
              style={{
                backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC",
                border: tokens.cardBorder,
              }}
            >
              <div className="w-6 h-6 rounded-md bg-[#10B981] text-white flex items-center justify-center text-base font-black">
                ✓
              </div>
              <span className="text-lg font-bold" style={{ color: tokens.textColor }}>
                Kartani saqlash (Eslab qolish)
              </span>
            </div>

            <div
              className="p-4 px-7 rounded-[18px] text-white text-xl font-extrabold flex items-center gap-2.5 shadow-lg"
              style={{
                background: "linear-gradient(135deg, #7000FF 0%, #5800CC 100%)",
                transform: `scale(${buttonTapScale})`,
              }}
            >
              <span>To&apos;lash va Saqlash</span>
              {frame >= 45 && <span>⚡</span>}
            </div>
          </div>
        </UiCard>
      </div>

      {/* 3. Middle Flow: Architecture & Security Reveal */}
      <div className="absolute top-[795px] left-[60px] right-[60px] h-[670px] flex flex-col justify-center">
        {/* PHASE 1: Misconception */}
        {isPhase1 && (
          <UiCard tokens={tokens} variant="middle" className="p-10.5 px-9 text-center">
            <div
              className="text-lg font-bold uppercase tracking-wider mb-3.5"
              style={{ color: tokens.subtextColor }}
            >
              Ko&apos;pchilik o&apos;ylaydigan xato tasavvur
            </div>
            <div
              className="text-[34px] font-extrabold leading-tight mb-7.5"
              style={{ color: tokens.textColor }}
            >
              16 talik raqam yetkazib berish ilovasi serveriga saqlanadimi?
            </div>

            <div className="flex justify-center items-center gap-6 mb-8">
              <div
                className="p-4.5 px-6.5 rounded-[20px] font-bold text-[22px]"
                style={{
                  backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.8)" : "#F1F5F9",
                  border: tokens.cardBorder,
                  color: tokens.textColor,
                }}
              >
                📱 Ilova bazasi
              </div>
              <div className="text-[32px] text-[#EF4444] font-black">❌ ??? ❌</div>
              <StatusBadge tokens={tokens} tone="danger" className="p-4.5 px-6.5 rounded-[20px] text-[22px]">
                👨‍💻 Xakerlar xavfi?
              </StatusBadge>
            </div>

            <StatusBadge tokens={tokens} tone="warning" className="p-3 px-6 rounded-full text-xl font-bold">
              🤔 Haqiqatda qayerda saqlanadi?
            </StatusBadge>
          </UiCard>
        )}

        {/* PHASE 2: Shocking Reality (Merchant Database Inspected) */}
        {isPhase2 && (
          <UiCard
            tokens={tokens}
            variant="danger"
            className="p-10 px-9.5 relative overflow-hidden text-center"
            style={{
              transform: `scale(${interpolate(phase2Spring, [0, 1], [0.92, 1])})`,
              opacity: phase2Spring,
            }}
          >
            {/* Red Laser Scanner */}
            <div
              className="absolute left-0 right-0 h-0.5 shadow-[0_0_12px_#EF4444] opacity-80"
              style={{
                top: 80 + scanLineY,
                background: "linear-gradient(90deg, transparent, #EF4444, transparent)",
              }}
            />

            <div className="mb-6">
              <StatusBadge tokens={tokens} tone="danger" className="mb-4 uppercase tracking-wider text-lg">
                🔍 MERCHANT BAZASI TEKSHIRILGANDA
              </StatusBadge>
              <div className="text-4xl font-extrabold" style={{ color: tokens.textColor }}>
                Ilova bazasida karta ma&apos;lumotlari:
              </div>
            </div>

            <div className="flex flex-col gap-3.5 mb-6">
              <div
                className="flex justify-between items-center p-4.5 px-5.5 rounded-[18px]"
                style={{
                  backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.12)" : "#FFF1F2",
                  border: tokens.isDark ? "1.5px solid rgba(239, 68, 68, 0.35)" : "1.5px solid #FECDD3",
                }}
              >
                <span className="text-xl font-bold" style={{ color: tokens.textColor }}>
                  16 talik Karta Raqami (PAN)
                </span>
                <StatusBadge tokens={tokens} tone="danger" className="text-lg">
                  ❌ SAQLANMAYDI (0 TA)
                </StatusBadge>
              </div>

              <div
                className="flex justify-between items-center p-4.5 px-5.5 rounded-[18px]"
                style={{
                  backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.12)" : "#FFF1F2",
                  border: tokens.isDark ? "1.5px solid rgba(239, 68, 68, 0.35)" : "1.5px solid #FECDD3",
                }}
              >
                <span className="text-xl font-bold" style={{ color: tokens.textColor }}>
                  CVV / CVC Maxfiy Kod
                </span>
                <StatusBadge tokens={tokens} tone="danger" className="text-lg">
                  🚫 QAT&apos;IYAN TAQIQLANGAN
                </StatusBadge>
              </div>
            </div>

            <div
              className="p-4 px-5 rounded-[18px] flex items-center gap-3.5 text-left"
              style={{
                backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.8)" : "#F8FAFC",
                border: tokens.cardBorder,
              }}
            >
              <span className="text-[28px]">🛡️</span>
              <span className="text-lg font-semibold" style={{ color: tokens.subtextColor }}>
                <strong style={{ color: tokens.textColor }}>PCI-DSS Xalqaro qoidasi:</strong>{" "}
                Ilovaga to&apos;liq karta raqamini saqlash taqiqlanadi!
              </span>
            </div>
          </UiCard>
        )}

        {/* PHASE 3: Tokenization & Vault Solution */}
        {isPhase3 && (
          <UiCard
            tokens={tokens}
            variant="accent"
            className="p-9 px-9"
            style={{
              transform: `scale(${interpolate(phase3Spring, [0, 1], [0.92, 1])})`,
              opacity: phase3Spring,
            }}
          >
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-[52px] h-[52px] rounded-2xl bg-[#0284C7] text-white text-[28px] font-black flex items-center justify-center">
                ⚡
              </div>
              <div>
                <div className="text-[32px] font-black" style={{ color: tokens.textColor }}>
                  Tokenizatsiya Jarayoni
                </div>
                <div className="text-[17px] font-semibold" style={{ color: tokens.subtextColor }}>
                  Karta va Ilova o&apos;rtasidagi xavfsiz shlyuz
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Vault Card */}
              <div
                className="p-4.5 px-5.5 rounded-[20px] flex items-center gap-4.5"
                style={{
                  backgroundColor: tokens.isDark ? "rgba(16, 185, 129, 0.12)" : "#F0FDF4",
                  border: tokens.isDark ? "1.5px solid rgba(16, 185, 129, 0.4)" : "1.5px solid #86EFAC",
                }}
              >
                <div className="text-[34px]">🏦</div>
                <div className="flex-1">
                  <div
                    className="text-[19px] font-extrabold mb-0.5"
                    style={{ color: tokens.isDark ? "#4ADE80" : "#166534" }}
                  >
                    PCI-DSS Bank Shlyuzi (Vault)
                  </div>
                  <div className="text-[15px]" style={{ color: tokens.isDark ? "#86EFAC" : "#15803D" }}>
                    Haqiqiy karta faqat bankda <strong>AES-256</strong> bilan shifrlanadi.
                  </div>
                </div>
                <StatusBadge tokens={tokens} tone="success">
                  Maxfiy Ombor 🔐
                </StatusBadge>
              </div>

              {/* Arrow */}
              <div className="text-center text-[22px] font-black text-[#38BDF8]">
                ⬇️ Karta o&apos;rniga Token yaratiladi ⬇️
              </div>

              {/* Merchant Token Card */}
              <div
                className="p-4.5 px-5.5 rounded-[20px] flex items-center gap-4.5"
                style={{
                  backgroundColor: tokens.isDark ? "rgba(56, 189, 248, 0.12)" : "#F0F9FF",
                  border: tokens.isDark ? "1.5px solid rgba(56, 189, 248, 0.4)" : "1.5px solid #7DD3FC",
                }}
              >
                <div className="text-[34px]">📱</div>
                <div className="flex-1">
                  <div
                    className="text-[19px] font-extrabold mb-1"
                    style={{ color: tokens.isDark ? "#38BDF8" : "#075985" }}
                  >
                    Ilova Bazasiga Beriladigan Token:
                  </div>
                  <div
                    className="text-xl font-bold font-mono text-[#0284C7] p-1.5 px-3.5 rounded-xl inline-block"
                    style={{
                      backgroundColor: tokens.isDark ? "rgba(15, 23, 42, 0.8)" : "#E0F2FE",
                      border: "1px solid rgba(56, 189, 248, 0.2)",
                    }}
                  >
                    {displayedToken || "tok_uz_..."}
                  </div>
                </div>
                <StatusBadge tokens={tokens} tone="accent">
                  Xavfsiz ✅
                </StatusBadge>
              </div>
            </div>

            <div
              className="mt-5 text-center text-[17px] font-bold"
              style={{ color: tokens.subtextColor }}
            >
              💡 Ilova buzilsa ham, Token begona joyda <strong>0 so&apos;m</strong> ahamiyatga ega!
            </div>
          </UiCard>
        )}
      </div>

      {/* 4. Synced Subtitle Card (Bottom) */}
      <SubtitleCard currentSubtitle={currentSubtitle} isPhase2={isPhase2} tokens={tokens} />

      {/* 5. Regulatory Footer */}
      <RegulatoryFooter
        tokens={tokens}
        icon="🛡️"
        text="Manba: PCI-DSS (Payment Card Industry Data Security Standard) xavfsizlik standarti"
      />
    </AbsoluteFill>
  );
};
