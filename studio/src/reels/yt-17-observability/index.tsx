import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt17ObservabilityComposition = createEpisode({
  id: "yt-17-observability",
  number: 17,
  part: 4,
  footer: "Observability",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["How would you know?", "Logs can't follow", "The agent", "Traced for free", "One trace", "Logs with trace ids", "Metrics", "Debit outcomes", "Scheme answer time", "One stack", "The dashboard", "When it went silent", "Sampling + load", "Next: silence"],
  map,
  diagram,
  code,
});
