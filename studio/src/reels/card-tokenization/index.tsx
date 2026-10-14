import React from "react";
import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getThemeTokens, ReelProps, ThemeName } from "../../themes";

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

  // Header entrance spring
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Top app card entrance
  const appCardSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 95 },
  });

  // Tap button press animation (Frame 42 -> 56)
  const buttonTapScale = interpolate(
    frame,
    [40, 46, 54],
    [1, 0.94, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card digits animation
  const cardDigitsDisappear = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 85 },
  });

  // Phase 2 entrance
  const phase2Spring = spring({
    frame: frame - 188,
    fps,
    config: { damping: 13, stiffness: 100 },
  });

  // Phase 3 entrance
  const phase3Spring = spring({
    frame: frame - 330,
    fps,
    config: { damping: 13, stiffness: 95 },
  });

  // Token string typewriter effect
  const fullToken = "tok_uz_89f02c19a4e7";
  const tokenVisibleLength = Math.min(
    fullToken.length,
    Math.floor(
      interpolate(frame, [345, 385], [0, fullToken.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const displayedToken = fullToken.slice(0, tokenVisibleLength);

  // Active subtitle
  const currentSubtitle =
    SUBTITLES.find((s) => frame >= s.startFrame && frame <= s.endFrame) ||
    SUBTITLES[SUBTITLES.length - 1];

  // Scan line animation in Phase 2
  const scanLineY = interpolate(
    (frame - 188) % 60,
    [0, 60],
    [0, 260],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.background,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", Roboto, sans-serif',
        color: tokens.textColor,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Audio src={staticFile("reels/card-tokenization/voiceover.mp3")} />

      {/* Decorative Grid and Ambient Glows */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(${tokens.gridColor} 1.4px, transparent 1.4px)`,
          backgroundSize: "36px 36px",
          opacity: tokens.gridOpacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -160,
          left: "50%",
          transform: "translateX(-50%)",
          width: 980,
          height: 520,
          background: isPhase2
            ? "radial-gradient(circle, rgba(239,68,68,0.18) 0%, rgba(245,158,11,0.08) 50%, transparent 75%)"
            : `radial-gradient(circle, ${tokens.glowColor1} 0%, ${tokens.glowColor2} 50%, transparent 75%)`,
          filter: "blur(60px)",
        }}
      />

      {/* ============================================================== */}
      {/* 1. TOP HEADER & CATEGORY BADGE                                 */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 86,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${interpolate(headerSpring, [0, 1], [-50, 0])}px)`,
          opacity: headerSpring,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 24px",
            borderRadius: 999,
            backgroundColor: tokens.badgeBg,
            border: tokens.badgeBorder,
            boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: isPhase2 ? "#EF4444" : isPhase3 ? "#0284C7" : "#10B981",
              boxShadow: isPhase2
                ? "0 0 10px #EF4444"
                : isPhase3
                ? "0 0 10px #0284C7"
                : "0 0 10px #10B981",
            }}
          />
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: tokens.badgeText,
              textTransform: "uppercase",
            }}
          >
            {isPhase1 && "🔐 FINTECH SIRI • KARTA XAVFSIZLIGI"}
            {isPhase2 && "⚠️ SHOK HAQIQAT: BAZADA KARTA YO'Q!"}
            {isPhase3 && "⚡ TOKENIZATSIYA MO'JIZASI"}
          </span>
        </div>

        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: tokens.textColor,
          }}
        >
          {isPhase1 && (
            <span>
              &apos;Kartani saqlash&apos;da raqam{" "}
              <span style={{ color: "#0284C7" }}>qayerga boradi?</span>
            </span>
          )}
          {isPhase2 && (
            <span>
              Yetkazib beruvchi kartangizni{" "}
              <span style={{ color: "#EF4444" }}>umuman ko&apos;rmaydi!</span>
            </span>
          )}
          {isPhase3 && (
            <span>
              Ilovaga faqat{" "}
              <span style={{ color: "#0284C7" }}>xavfsiz TOKEN</span> beriladi
            </span>
          )}
        </h1>
      </div>

      {/* ============================================================== */}
      {/* 2. TOP UI CARD: DELIVERY APP CHECKOUT (Uzum Tezkor / Food App) */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 275,
          left: 60,
          right: 60,
          transform: `scale(${interpolate(appCardSpring, [0, 1], [0.92, 1])})`,
          opacity: appCardSpring,
        }}
      >
        <div
          style={{
            backgroundColor: tokens.cardBg,
            borderRadius: 36,
            padding: 32,
            border: tokens.cardBorder,
            boxShadow: tokens.cardShadow,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Top Bar: Food Delivery Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "#7000FF",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                🛵
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: tokens.textColor }}>
                  Yetkazib berish ilovasi
                </div>
                <div style={{ fontSize: 16, color: tokens.subtextColor }}>
                  Buyurtma: Issiq Lavash + Cola • 85 000 so&apos;m
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: 12,
                backgroundColor: tokens.badgeBg,
                border: tokens.badgeBorder,
                fontSize: 16,
                fontWeight: 700,
                color: tokens.subtextColor,
              }}
            >
              Buyurtma #4821
            </div>
          </div>

          {/* Interactive Card Input Preview */}
          <div
            style={{
              padding: "20px 24px",
              borderRadius: 22,
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              color: "#FFFFFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 10px 25px -8px rgba(15,23,42,0.35)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Kiritilgan Bank Kartasi
              </div>
              <div
                style={{
                  fontSize: 26,
                  letterSpacing: "0.15em",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {frame < 55 ? (
                  <span>8600 4521 8901 9912</span>
                ) : (
                  <span style={{ opacity: cardDigitsDisappear }}>
                    8600 •••• ••••{" "}
                    <span style={{ color: "#38BDF8" }}>9912</span>
                  </span>
                )}
              </div>
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                backgroundColor: "rgba(255,255,255,0.12)",
                fontSize: 16,
                fontWeight: 700,
                color: "#38BDF8",
              }}
            >
              UZCARD
            </div>
          </div>

          {/* Checkbox toggle & Action Button */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 18px",
                borderRadius: 16,
                backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC",
                border: tokens.cardBorder,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: "#10B981",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 900,
                }}
              >
                ✓
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: tokens.textColor }}>
                Kartani saqlash (Eslab qolish)
              </span>
            </div>

            <div
              style={{
                padding: "16px 28px",
                borderRadius: 18,
                background: "linear-gradient(135deg, #7000FF 0%, #5800CC 100%)",
                color: "#FFFFFF",
                fontSize: 20,
                fontWeight: 800,
                transform: `scale(${buttonTapScale})`,
                boxShadow: "0 10px 20px -5px rgba(112,0,255,0.35)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span>To&apos;lash va Saqlash</span>
              {frame >= 45 && <span>⚡</span>}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. MIDDLE FLOW: ARCHITECTURE & SECURITY REVEAL                 */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 795,
          left: 60,
          right: 60,
          height: 670,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* PHASE 1: The Question & Misconception */}
        {isPhase1 && (
          <div
            style={{
              backgroundColor: tokens.middleCardBg,
              borderRadius: 36,
              padding: "42px 36px",
              border: tokens.middleCardBorder,
              boxShadow: tokens.middleCardShadow,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: tokens.subtextColor,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              Ko&apos;pchilik o&apos;ylaydigan xato tasavvur
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: tokens.textColor,
                lineHeight: 1.25,
                marginBottom: 30,
              }}
            >
              16 talik raqam yetkazib berish ilovasi serveriga saqlanadimi?
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                marginBottom: 32,
              }}
            >
              <div
                style={{
                  padding: "18px 26px",
                  borderRadius: 20,
                  backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.8)" : "#F1F5F9",
                  border: tokens.cardBorder,
                  fontWeight: 700,
                  fontSize: 22,
                  color: tokens.textColor,
                }}
              >
                📱 Ilova bazasi
              </div>
              <div style={{ fontSize: 32, color: "#EF4444", fontWeight: 900 }}>
                ❌ ??? ❌
              </div>
              <div
                style={{
                  padding: "18px 26px",
                  borderRadius: 20,
                  backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.18)" : "#FEF2F2",
                  color: tokens.isDark ? "#F87171" : "#DC2626",
                  fontWeight: 700,
                  fontSize: 22,
                }}
              >
                👨‍💻 Xakerlar xavfi?
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 24px",
                borderRadius: 999,
                backgroundColor: tokens.isDark ? "rgba(245, 158, 11, 0.2)" : "#FEF3C7",
                color: tokens.isDark ? "#FCD34D" : "#92400E",
                fontSize: 20,
                fontWeight: 700,
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <span>🤔 Haqiqatda qayerda saqlanadi?</span>
            </div>
          </div>
        )}

        {/* PHASE 2: The Shocking Reality (Merchant Database Inspected) */}
        {isPhase2 && (
          <div
            style={{
              backgroundColor: tokens.middleCardBg,
              borderRadius: 36,
              padding: "40px 38px",
              border: "2px solid #EF4444",
              boxShadow: tokens.isDark
                ? "0 25px 50px -12px rgba(239,68,68,0.25), 0 0 25px rgba(239,68,68,0.1)"
                : "0 25px 50px -12px rgba(239,68,68,0.18)",
              transform: `scale(${interpolate(phase2Spring, [0, 1], [0.92, 1])})`,
              opacity: phase2Spring,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 80 + scanLineY,
                left: 0,
                right: 0,
                height: 2,
                background: "linear-gradient(90deg, transparent, #EF4444, transparent)",
                boxShadow: "0 0 12px #EF4444",
                opacity: 0.8,
              }}
            />

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 20px",
                  borderRadius: 999,
                  backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.18)" : "#FEF2F2",
                  color: tokens.isDark ? "#F87171" : "#B91C1C",
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                <span>🔍 MERCHANT BAZASI TEKSHIRILGANDA</span>
              </div>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: tokens.textColor,
                }}
              >
                Ilova bazasida karta ma&apos;lumotlari:
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 22px",
                  borderRadius: 18,
                  backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.12)" : "#FFF1F2",
                  border: tokens.isDark ? "1.5px solid rgba(239, 68, 68, 0.35)" : "1.5px solid #FECDD3",
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 700, color: tokens.textColor }}>
                  16 talik Karta Raqami (PAN)
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: tokens.isDark ? "#F87171" : "#DC2626",
                    backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.22)" : "#FEE2E2",
                    padding: "6px 14px",
                    borderRadius: 10,
                  }}
                >
                  ❌ SAQLANMAYDI (0 TA)
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 22px",
                  borderRadius: 18,
                  backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.12)" : "#FFF1F2",
                  border: tokens.isDark ? "1.5px solid rgba(239, 68, 68, 0.35)" : "1.5px solid #FECDD3",
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 700, color: tokens.textColor }}>
                  CVV / CVC Maxfiy Kod
                </span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: tokens.isDark ? "#F87171" : "#DC2626",
                    backgroundColor: tokens.isDark ? "rgba(239, 68, 68, 0.22)" : "#FEE2E2",
                    padding: "6px 14px",
                    borderRadius: 10,
                  }}
                >
                  🚫 QAT&apos;IYAN TAQIQLANGAN
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "16px 20px",
                borderRadius: 18,
                backgroundColor: tokens.isDark ? "rgba(30, 41, 59, 0.8)" : "#F8FAFC",
                border: tokens.cardBorder,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 28 }}>🛡️</span>
              <span style={{ fontSize: 18, fontWeight: 600, color: tokens.subtextColor }}>
                <strong style={{ color: tokens.textColor }}>PCI-DSS Xalqaro qoidasi:</strong>{" "}
                Ilovaga to&apos;liq karta raqamini saqlash taqiqlanadi!
              </span>
            </div>
          </div>
        )}

        {/* PHASE 3: The Architecture Solution (Tokenization & Vault) */}
        {isPhase3 && (
          <div
            style={{
              backgroundColor: tokens.middleCardBg,
              borderRadius: 36,
              padding: "36px 36px",
              border: "2px solid #0284C7",
              boxShadow: tokens.isDark
                ? "0 25px 50px -12px rgba(14,165,233,0.3), 0 0 30px rgba(14,165,233,0.12)"
                : "0 25px 50px -12px rgba(14,165,233,0.18)",
              transform: `scale(${interpolate(phase3Spring, [0, 1], [0.92, 1])})`,
              opacity: phase3Spring,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: "#0284C7",
                  color: "#FFFFFF",
                  fontSize: 28,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 900, color: tokens.textColor }}>
                  Tokenizatsiya Jarayoni
                </div>
                <div style={{ fontSize: 17, color: tokens.subtextColor, fontWeight: 600 }}>
                  Karta va Ilova o&apos;rtasidagi xavfsiz shlyuz
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Vault Card */}
              <div
                style={{
                  padding: "18px 22px",
                  borderRadius: 20,
                  backgroundColor: tokens.isDark ? "rgba(16, 185, 129, 0.12)" : "#F0FDF4",
                  border: tokens.isDark ? "1.5px solid rgba(16, 185, 129, 0.4)" : "1.5px solid #86EFAC",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div style={{ fontSize: 34 }}>🏦</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: tokens.isDark ? "#4ADE80" : "#166534",
                      marginBottom: 2,
                    }}
                  >
                    PCI-DSS Bank Shlyuzi (Vault)
                  </div>
                  <div style={{ fontSize: 15, color: tokens.isDark ? "#86EFAC" : "#15803D" }}>
                    Haqiqiy karta faqat bankda <strong>AES-256</strong> bilan
                    shifrlanadi.
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 10,
                    backgroundColor: tokens.isDark ? "rgba(16, 185, 129, 0.25)" : "#DCFCE7",
                    color: tokens.isDark ? "#86EFAC" : "#166534",
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  Maxfiy Ombor 🔐
                </div>
              </div>

              {/* Arrow */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#38BDF8",
                }}
              >
                ⬇️ Karta o&apos;rniga Token yaratiladi ⬇️
              </div>

              {/* Merchant Token Card */}
              <div
                style={{
                  padding: "18px 22px",
                  borderRadius: 20,
                  backgroundColor: tokens.isDark ? "rgba(56, 189, 248, 0.12)" : "#F0F9FF",
                  border: tokens.isDark ? "1.5px solid rgba(56, 189, 248, 0.4)" : "1.5px solid #7DD3FC",
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div style={{ fontSize: 34 }}>📱</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: tokens.isDark ? "#38BDF8" : "#075985",
                      marginBottom: 4,
                    }}
                  >
                    Ilova Bazasiga Beriladigan Token:
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      color: "#0284C7",
                      backgroundColor: tokens.isDark ? "rgba(15, 23, 42, 0.8)" : "#E0F2FE",
                      border: "1px solid rgba(56, 189, 248, 0.2)",
                      padding: "6px 14px",
                      borderRadius: 10,
                      display: "inline-block",
                    }}
                  >
                    {displayedToken || "tok_uz_..."}
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 10,
                    backgroundColor: tokens.isDark ? "rgba(56, 189, 248, 0.25)" : "#E0F2FE",
                    color: tokens.isDark ? "#7DD3FC" : "#0369A1",
                    fontSize: 14,
                    fontWeight: 800,
                  }}
                >
                  Xavfsiz ✅
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                textAlign: "center",
                fontSize: 17,
                fontWeight: 700,
                color: tokens.subtextColor,
              }}
            >
              💡 Ilova buzilsa ham, Token begona joyda <strong>0 so&apos;m</strong> ahamiyatga ega!
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. SYNCED SUBTITLE CARD (BOTTOM)                               */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 60,
          right: 60,
        }}
      >
        <div
          style={{
            backgroundColor: tokens.subtitleBg,
            borderRadius: 28,
            padding: "28px 36px",
            border: tokens.subtitleBorder,
            boxShadow: tokens.subtitleShadow,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              backgroundColor: isPhase2
                ? (tokens.isDark ? "rgba(239, 68, 68, 0.2)" : "#FEF2F2")
                : (tokens.isDark ? "rgba(56, 189, 248, 0.15)" : "#F0F9FF"),
              color: isPhase2
                ? (tokens.isDark ? "#F87171" : "#DC2626")
                : (tokens.isDark ? "#38BDF8" : "#0284C7"),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {isPhase2 ? "📢" : "🎙️"}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1.35,
                color: tokens.subtitleTextColor,
              }}
            >
              {currentSubtitle.prefix}<span
                style={{
                  color: isPhase2
                    ? (tokens.isDark ? "#F87171" : "#DC2626")
                    : (tokens.isDark ? "#38BDF8" : "#0284C7"),
                  fontWeight: 900,
                  backgroundColor: isPhase2
                    ? (tokens.isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)")
                    : (tokens.isDark ? "rgba(56,189,248,0.2)" : "rgba(2,132,199,0.15)"),
                  padding: "2px 8px",
                  borderRadius: 6,
                }}
              >{currentSubtitle.highlight}</span>{currentSubtitle.suffix}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. REGULATORY SOURCE FOOTER                                    */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          color: tokens.footerColor,
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        <span>🛡️</span>
        <span>
          Manba: PCI-DSS (Payment Card Industry Data Security Standard) xavfsizlik standarti
        </span>
      </div>
    </AbsoluteFill>
  );
};
