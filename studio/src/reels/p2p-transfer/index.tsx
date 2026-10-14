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
        theme: "xray" as ThemeName,
      }}
    />
  );
};

export const P2PVideo: React.FC<ReelProps> = ({ theme = "xray" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases
  const isPhase1 = frame < 145;
  const isPhase2 = frame >= 145 && frame < 252;
  const isPhase3 = frame >= 252;
  const isBackendPhase = !isPhase1;

  // Active theme tokens
  const tokens = getThemeTokens(theme, isBackendPhase);

  // Header spring
  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Cards entrance
  const cardsEntrance = spring({
    frame: frame - 6,
    fps,
    config: { damping: 13, stiffness: 95 },
  });

  // Pill transfer animation (Frame 28 -> 70)
  const transferProgress = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 75, mass: 0.9 },
  });

  // Balances
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

  // Phase springs
  const phase2Spring = spring({
    frame: frame - 145,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const phase3Spring = spring({
    frame: frame - 252,
    fps,
    config: { damping: 12, stiffness: 95 },
  });

  // Active subtitle
  const currentSubtitle =
    SUBTITLES.find((s) => frame >= s.startFrame && frame <= s.endFrame) ||
    SUBTITLES[SUBTITLES.length - 1];

  // Currency formatter
  const formatUZS = (val: number) => {
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
  };

  // Lock pulse animation in Phase 2
  const lockPulse = 1 + Math.sin(frame * 0.25) * 0.08;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.background,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", Roboto, sans-serif',
        color: tokens.textColor,
        overflow: "hidden",
        position: "relative",
        transition: "background-color 0.4s ease",
      }}
    >
      <Audio src={staticFile("reels/p2p-transfer/voiceover.mp3")} />

      {/* Decorative Grid and Soft Glows */}
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
          top: -180,
          left: "50%",
          transform: "translateX(-50%)",
          width: 960,
          height: 550,
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
              backgroundColor: isPhase2 ? "#EF4444" : "#10B981",
              boxShadow: isPhase2 ? "0 0 10px #EF4444" : "0 0 10px #10B981",
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
            {isPhase1 && "⚡ P2P O'TKAZMA ANATOMIYASI"}
            {isPhase2 && "⚠️ BANKLARARO SIR FOSh BO'LDI"}
            {isPhase3 && "🤔 QAYERDAN KELDI BU PUL?"}
          </span>
        </div>

        <h1
          style={{
            fontSize: 54,
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
              500 000 so&apos;m{" "}
              <span style={{ color: "#00BFA5" }}>bir zumda</span> o&apos;tdi
            </span>
          )}
          {isPhase2 && (
            <span>
              Banklararo{" "}
              <span style={{ color: "#EF4444" }}>0 SO&apos;M</span> ko&apos;chgan!
            </span>
          )}
          {isPhase3 && <span>Pul qayerdan paydo bo&apos;ldi?</span>}
        </h1>
      </div>

      {/* ============================================================== */}
      {/* 2. TWO PHONE UI CARDS (SENDER & RECEIVER)                      */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 275,
          left: 54,
          right: 54,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: 24,
          transform: `scale(${interpolate(cardsEntrance, [0, 1], [0.9, 1])})`,
          opacity: cardsEntrance,
        }}
      >
        {/* SENDER PHONE CARD (Payme / Kapitalbank) */}
        <div
          style={{
            flex: 1,
            backgroundColor: tokens.cardBg,
            borderRadius: 36,
            padding: 30,
            border: tokens.cardBorder,
            boxShadow: tokens.cardShadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            transition: "all 0.3s ease",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: "#00BFA5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 900,
                    fontSize: 20,
                  }}
                >
                  P
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: tokens.textColor }}>
                    Payme
                  </div>
                  <div style={{ fontSize: 16, color: tokens.subtextColor }}>
                    Alisher M.
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  backgroundColor: tokens.badgeBg,
                  border: tokens.badgeBorder,
                  fontSize: 16,
                  fontWeight: 700,
                  color: tokens.subtextColor,
                }}
              >
                HUMO
              </div>
            </div>

            {/* Virtual Card */}
            <div
              style={{
                borderRadius: 20,
                padding: "20px 22px",
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                color: "#FFFFFF",
                marginBottom: 20,
                boxShadow: "0 10px 25px -8px rgba(15,23,42,0.3)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Kapitalbank
              </div>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  marginBottom: 14,
                }}
              >
                9860 •••• •••• 4210
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8" }}>Karta balansi</div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                {formatUZS(senderBalance)}
              </div>
            </div>
          </div>

          {/* Action Status */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 18,
              backgroundColor: frame >= 38 ? "#FEF2F2" : tokens.background === "#090D16" ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC",
              border: `1.5px solid ${frame >= 38 ? "#FCA5A5" : tokens.cardBorder.replace(/^1\.5px solid /, "")}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{frame >= 38 ? "📤" : "💳"}</span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: frame >= 38 ? "#DC2626" : tokens.subtextColor,
                }}
              >
                {frame >= 38 ? "-500 000 UZS" : "O'tkazma tayyor"}
              </span>
            </div>
            {frame >= 38 && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#DC2626",
                  backgroundColor: "#FEE2E2",
                  padding: "4px 10px",
                  borderRadius: 8,
                }}
              >
                Yuborildi
              </span>
            )}
          </div>
        </div>

        {/* RECEIVER PHONE CARD (Click / Ipak Yo'li) */}
        <div
          style={{
            flex: 1,
            backgroundColor: tokens.cardBg,
            borderRadius: 36,
            padding: 30,
            border: tokens.cardBorder,
            boxShadow: tokens.cardShadow,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            transition: "all 0.3s ease",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: "#0077FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontWeight: 900,
                    fontSize: 20,
                  }}
                >
                  C
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: tokens.textColor }}>
                    Click
                  </div>
                  <div style={{ fontSize: 16, color: tokens.subtextColor }}>
                    Jasur K.
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  backgroundColor: tokens.badgeBg,
                  border: tokens.badgeBorder,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0077FF",
                }}
              >
                UZCARD
              </div>
            </div>

            {/* Virtual Card */}
            <div
              style={{
                borderRadius: 20,
                padding: "20px 22px",
                background: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
                color: "#FFFFFF",
                marginBottom: 20,
                boxShadow: "0 10px 25px -8px rgba(3,105,161,0.35)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: "#BAE6FD",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Ipak Yo&apos;li Bank
              </div>
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "0.15em",
                  fontWeight: 600,
                  fontFamily: "monospace",
                  marginBottom: 14,
                }}
              >
                8600 •••• •••• 8820
              </div>
              <div style={{ fontSize: 13, color: "#BAE6FD" }}>Karta balansi</div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                {formatUZS(receiverBalance)}
              </div>
            </div>
          </div>

          {/* Action Status */}
          <div
            style={{
              padding: "16px 20px",
              borderRadius: 18,
              backgroundColor: frame >= 60 ? "#ECFDF5" : tokens.background === "#090D16" ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC",
              border: `1.5px solid ${frame >= 60 ? "#6EE7B7" : tokens.cardBorder.replace(/^1\.5px solid /, "")}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>{frame >= 60 ? "📥" : "⏳"}</span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: frame >= 60 ? "#059669" : tokens.subtextColor,
                }}
              >
                {frame >= 60 ? "+500 000 UZS" : "Kutilmoqda..."}
              </span>
            </div>
            {frame >= 60 && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#059669",
                  backgroundColor: "#D1FAE5",
                  padding: "4px 10px",
                  borderRadius: 8,
                }}
              >
                0.4 soniya! ⚡
              </span>
            )}
          </div>
        </div>
      </div>

      {/* FLYING 500,000 SO'M PILL BADGE */}
      {frame >= 28 && frame <= 100 && (
        <div
          style={{
            position: "absolute",
            top: 725,
            left: interpolate(transferProgress, [0, 1], [270, 810]),
            transform: `translate(-50%, -50%) scale(${interpolate(
              transferProgress,
              [0, 0.5, 1],
              [0.9, 1.08, 1]
            )})`,
            padding: "16px 30px",
            borderRadius: 999,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
            boxShadow:
              "0 18px 36px -6px rgba(16, 185, 129, 0.45), 0 0 0 4px rgba(255,255,255,0.95)",
            whiteSpace: "nowrap",
            zIndex: 100,
          }}
        >
          <span>⚡</span>
          <span>500 000 so&apos;m</span>
          <span>➔</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MIDDLE FLOW (CENTRAL CLEARING / INTERBANK REALITY)           */}
      {/* ============================================================== */}
      <div
        style={{
          position: "absolute",
          top: 790,
          left: 54,
          right: 54,
          height: 680,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* PHASE 1: Processing Switch (Instant appearance) */}
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
                marginBottom: 12,
              }}
            >
              Foydalanuvchi ko&apos;zidagi holat
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: tokens.textColor,
                marginBottom: 32,
              }}
            >
              To&apos;lov shlyuzi tranzaksiyani bir zumda tasdiqladi
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  padding: "18px 28px",
                  borderRadius: 20,
                  backgroundColor: tokens.background === "#090D16" ? "rgba(30, 41, 59, 0.8)" : "#F1F5F9",
                  border: tokens.cardBorder,
                  fontWeight: 700,
                  fontSize: 22,
                  color: tokens.textColor,
                }}
              >
                Kapitalbank (HUMO)
              </div>
              <div
                style={{
                  fontSize: 28,
                  color: "#10B981",
                  fontWeight: 900,
                }}
              >
                ➔ ⚡ ➔
              </div>
              <div
                style={{
                  padding: "18px 28px",
                  borderRadius: 20,
                  backgroundColor: tokens.background === "#090D16" ? "rgba(30, 41, 59, 0.8)" : "#F1F5F9",
                  border: tokens.cardBorder,
                  fontWeight: 700,
                  fontSize: 22,
                  color: tokens.textColor,
                }}
              >
                Ipak Yo&apos;li (UZCARD)
              </div>
            </div>

            <div
              style={{
                marginTop: 36,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 28px",
                borderRadius: 999,
                backgroundColor: tokens.background === "#090D16" ? "rgba(16, 185, 129, 0.2)" : "#ECFDF5",
                color: tokens.background === "#090D16" ? "#4ADE80" : "#065F46",
                fontWeight: 700,
                fontSize: 20,
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <span>⏱️ Tranzaksiya tezligi:</span>
              <span style={{ fontWeight: 900, color: "#10B981" }}>
                0.38 soniya
              </span>
            </div>
          </div>
        )}

        {/* PHASE 2: Interbank Reality (0 so'm moved!) */}
        {isPhase2 && (
          <div
            style={{
              backgroundColor: tokens.middleCardBg,
              borderRadius: 36,
              padding: "44px 38px",
              border: "2px solid #EF4444",
              boxShadow: "0 25px 50px -12px rgba(239,68,68,0.25), 0 0 25px rgba(239,68,68,0.1)",
              textAlign: "center",
              transform: `scale(${interpolate(phase2Spring, [0, 1], [0.92, 1])})`,
              opacity: phase2Spring,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 20px",
                borderRadius: 999,
                backgroundColor: "#FEF2F2",
                color: "#B91C1C",
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              <span>⚠️ PARDA ORTIDAGI HAQIQAT</span>
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: tokens.textColor,
                lineHeight: 1.25,
                marginBottom: 26,
              }}
            >
              Banklar hisob raqamlari o&apos;rtasida:
            </div>

            {/* BIG HIGHLIGHT COUNTER */}
            <div
              style={{
                padding: "26px 36px",
                borderRadius: 24,
                backgroundColor: tokens.background === "#090D16" ? "rgba(239, 68, 68, 0.15)" : "#FFF1F2",
                border: "2.5px dashed #EF4444",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  fontSize: 74,
                  fontWeight: 900,
                  color: "#DC2626",
                  letterSpacing: "-0.03em",
                }}
              >
                0 SO&apos;M
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: tokens.background === "#090D16" ? "#FCA5A5" : "#991B1B",
                  marginTop: 6,
                }}
              >
                Hozirgacha bir so&apos;m ham o&apos;tkazilmagan!
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px 24px",
                borderRadius: 20,
                backgroundColor: tokens.background === "#090D16" ? "rgba(30, 41, 59, 0.8)" : "#F8FAFC",
                border: tokens.cardBorder,
              }}
            >
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 16, color: tokens.subtextColor, fontWeight: 600 }}>
                  Bank A Nostro
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: tokens.textColor }}>
                  Kapitalbank
                </div>
              </div>
              <div
                style={{
                  padding: "10px 20px",
                  borderRadius: 14,
                  backgroundColor: "#FEE2E2",
                  color: "#DC2626",
                  fontWeight: 800,
                  fontSize: 18,
                  transform: `scale(${lockPulse})`,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>🔒</span>
                <span>Qatnov yo&apos;q</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, color: tokens.subtextColor, fontWeight: 600 }}>
                  Bank B Nostro
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: tokens.textColor }}>
                  Ipak Yo&apos;li Bank
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE 3: The Mystery & Explanation (Pul qayerdan keldi?) */}
        {isPhase3 && (
          <div
            style={{
              backgroundColor: tokens.middleCardBg,
              borderRadius: 36,
              padding: "40px 36px",
              border: "2px solid #0284C7",
              boxShadow: "0 25px 50px -12px rgba(14,165,233,0.3), 0 0 30px rgba(14,165,233,0.12)",
              transform: `scale(${interpolate(phase3Spring, [0, 1], [0.92, 1])})`,
              opacity: phase3Spring,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  backgroundColor: "#0284C7",
                  color: "#FFFFFF",
                  fontSize: 32,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ?
              </div>
              <div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: tokens.textColor,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Pul qayerdan keldi?
                </div>
                <div style={{ fontSize: 18, color: tokens.subtextColor, fontWeight: 600 }}>
                  Fintech arxitekturasining 3 asosiy qoidasi:
                </div>
              </div>
            </div>

            {/* 3 Staggered Explanation Pillars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      padding: "16px 20px",
                      borderRadius: 20,
                      backgroundColor: tokens.background === "#090D16" ? "rgba(30, 41, 59, 0.7)" : "#F8FAFC",
                      border: tokens.cardBorder,
                      transform: `translateY(${interpolate(itemSpring, [0, 1], [20, 0])}px)`,
                      opacity: itemSpring,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 14,
                        backgroundColor: tokens.background === "#090D16" ? "#38BDF8" : "#0F172A",
                        color: tokens.background === "#090D16" ? "#0F172A" : "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      {item.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: tokens.textColor,
                          marginBottom: 4,
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: 16, color: tokens.subtextColor }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
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
          left: 54,
          right: 54,
        }}
      >
        <div
          style={{
            backgroundColor: tokens.subtitleBg,
            borderRadius: 28,
            padding: tokens.showSubtitleHeader ? "24px 36px" : "28px 36px",
            border: tokens.subtitleBorder,
            boxShadow: tokens.subtitleShadow,
            display: "flex",
            alignItems: "center",
            gap: 20,
            transition: "all 0.3s ease",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              backgroundColor: isPhase2 ? "#FEF2F2" : tokens.background === "#090D16" ? "rgba(0,191,165,0.15)" : "#ECFDF5",
              color: isPhase2 ? "#DC2626" : "#059669",
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
            {tokens.showSubtitleHeader && (
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 6,
                }}
              >
                Ovozli matn (Uzbek TTS)
              </div>
            )}
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
                  color: isPhase2 ? "#DC2626" : "#00BFA5",
                  fontWeight: 900,
                  backgroundColor: isPhase2
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(0,191,165,0.15)",
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
        <span>🏛️</span>
        <span>
          Manba: O&apos;zbekiston Respublikasi Markaziy Banki to&apos;lov tizimlari reglamenti
        </span>
      </div>
    </AbsoluteFill>
  );
};
