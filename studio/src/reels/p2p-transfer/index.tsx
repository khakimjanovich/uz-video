import { Sequence } from "remotion";
import { ReelProps } from "../../themes";
import { ReelScaffold } from "../../components";
import { createReelComposition } from "../../utils/createReelComposition";
import { useSubtitles } from "../../hooks/useSubtitles";
import rawSubtitles from "./subtitles.json";
import { SubtitleCue } from "../../components/SubtitleCard";
import { SenderReceiverCards } from "./scenes/SenderReceiverCards";
import { HookScene } from "./scenes/HookScene";
import { RealityScene } from "./scenes/RealityScene";
import { ClearingScene } from "./scenes/ClearingScene";

const subtitles = rawSubtitles as SubtitleCue[];

export const P2PTransferComposition = createReelComposition({
  id: "p2p-transfer",
  component: P2PVideo,
  subtitles,
});

export function P2PVideo({ theme = "dark" }: ReelProps) {
  const { subtitles: cues } = useSubtitles(subtitles);

  return (
    <ReelScaffold
      theme={theme}
      reelId="p2p-transfer"
      subtitles={subtitles}
      badgeDotColor={(idx) => (idx === 1 ? "#EF4444" : idx >= 2 ? "#0284C7" : "#10B981")}
      badgeText={(idx) =>
        idx === 0
          ? "⚡ TEZKOR O'TKAZMA • P2P SIRLARI"
          : idx === 1
          ? "⚠️ BANKLARARO SIR FOSh BO'LDI"
          : "🤔 QAYERDAN KELDI BU PUL?"
      }
      title={(idx) =>
        idx === 0 ? (
          <span>
            Payme orqali 500 000 so&apos;m yubordingiz:{" "}
            <span className="text-[#00BFA5]">u bir zumda yetib bordi!</span>
          </span>
        ) : idx === 1 ? (
          <span>
            Lekin banklar orasida hali{" "}
            <span className="text-danger">1 tiyin ham ko&apos;chmadi!</span>
          </span>
        ) : (
          <span>Pul qayerdan paydo bo&apos;ldi?</span>
        )
      }
      lawCitation="Manba: O'zbekiston Respublikasi Markaziy Banki Kliring va Hisob-kitob qoidalari"
      citationIcon="🏛️"
    >
      {/* Top Phone Cards (Active across reel) */}
      <SenderReceiverCards />

      {/* Cue 0: Hook Scene */}
      <Sequence
        from={cues[0]?.startFrame ?? 0}
        durationInFrames={(cues[0]?.endFrame ?? 150) - (cues[0]?.startFrame ?? 0)}
        layout="none"
      >
        <HookScene />
      </Sequence>

      {/* Cue 1: Reality Scene */}
      <Sequence
        from={cues[1]?.startFrame ?? 150}
        durationInFrames={(cues[1]?.endFrame ?? 250) - (cues[1]?.startFrame ?? 150)}
        layout="none"
      >
        <RealityScene />
      </Sequence>

      {/* Cue 2: Clearing Scene */}
      <Sequence
        from={cues[2]?.startFrame ?? 250}
        durationInFrames={(cues[2]?.endFrame ?? 345) - (cues[2]?.startFrame ?? 250)}
        layout="none"
      >
        <ClearingScene />
      </Sequence>
    </ReelScaffold>
  );
}
