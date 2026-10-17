import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt23HardeningComposition = createEpisode({
  id: "yt-23-hardening",
  number: 23,
  part: 4,
  footer: "Hardening",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Before production", "Nonce window", "Signature first", "KYB required", "Payment limits", "Your exercises", "Next: Kubernetes"],
  map,
  diagram,
});
