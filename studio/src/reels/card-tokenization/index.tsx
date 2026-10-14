import { Sequence } from "remotion";
import { ReelProps } from "../../themes";
import { ReelScaffold } from "../../components";
import { createReelComposition } from "../../utils/createReelComposition";
import { useSubtitles } from "../../hooks/useSubtitles";
import rawSubtitles from "./subtitles.json";
import { SubtitleCue } from "../../components/SubtitleCard";
import { DeliveryCheckoutCard } from "./scenes/DeliveryCheckoutCard";
import { MisconceptionScene } from "./scenes/MisconceptionScene";
import { DatabaseScanScene } from "./scenes/DatabaseScanScene";
import { VaultTokenScene } from "./scenes/VaultTokenScene";

const subtitles = rawSubtitles as SubtitleCue[];

export const CardTokenizationComposition = createReelComposition({
  id: "card-tokenization",
  component: CardTokenizationVideo,
  subtitles,
});

export function CardTokenizationVideo({ theme = "dark" }: ReelProps) {
  const { subtitles: cues } = useSubtitles(subtitles);

  return (
    <ReelScaffold
      theme={theme}
      reelId="card-tokenization"
      subtitles={subtitles}
      badgeDotColor={(idx) => (idx === 1 ? "#EF4444" : idx >= 2 ? "#0284C7" : "#10B981")}
      badgeText={(idx) =>
        idx === 0
          ? "🔐 FINTECH SIRI • KARTA XAVFSIZLIGI"
          : idx === 1
          ? "⚠️ SHOK HAQIQAT: BAZADA KARTA YO'Q!"
          : "⚡ TOKENIZATSIYA MO'JIZASI"
      }
      title={(idx) =>
        idx === 0 ? (
          <span>
            &apos;Kartani saqlash&apos;da raqam{" "}
            <span className="text-[#0284C7]">qayerga boradi?</span>
          </span>
        ) : idx === 1 ? (
          <span>
            Yetkazib beruvchi kartangizni{" "}
            <span className="text-danger">umuman ko&apos;rmaydi!</span>
          </span>
        ) : (
          <span>
            Ilovaga faqat <span className="text-[#0284C7]">xavfsiz TOKEN</span> beriladi
          </span>
        )
      }
      lawCitation="Manba: PCI-DSS (Payment Card Industry Data Security Standard) xavfsizlik standarti"
      citationIcon="🛡️"
    >
      {/* Top UI Card (Checkout screen active across reel) */}
      <DeliveryCheckoutCard />

      {/* Cue 0: Misconception Scene */}
      <Sequence
        from={cues[0]?.startFrame ?? 0}
        durationInFrames={(cues[0]?.endFrame ?? 191) - (cues[0]?.startFrame ?? 0)}
        layout="none"
      >
        <MisconceptionScene />
      </Sequence>

      {/* Cue 1: Database Scan Scene */}
      <Sequence
        from={cues[1]?.startFrame ?? 191}
        durationInFrames={(cues[1]?.endFrame ?? 332) - (cues[1]?.startFrame ?? 191)}
        layout="none"
      >
        <DatabaseScanScene />
      </Sequence>

      {/* Cue 2: Vault & Tokenization Solution Scene */}
      <Sequence
        from={cues[2]?.startFrame ?? 332}
        durationInFrames={(cues[2]?.endFrame ?? 510) - (cues[2]?.startFrame ?? 332)}
        layout="none"
      >
        <VaultTokenScene />
      </Sequence>
    </ReelScaffold>
  );
}
