import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt23HardeningComposition = createEpisode({
  id: "yt-23-hardening",
  number: 23,
  part: 4,
  footer: "Hardening: limits",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Before production", "Two limits", "Valid limits", "One payment", "The race", "One statement", "The row lock", "Reserve before the call", "Give it back", "The business day", "In the portal", "Next: Kubernetes"],
  map,
  diagram,
  code,
});
