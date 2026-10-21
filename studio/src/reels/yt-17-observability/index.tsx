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
  titles: ["How would you know?", "Logs can't follow", "One library", "Traced everywhere", "One trace", "X-Request-Id", "Logs with trace ids", "Masked everywhere", "Metrics", "Debit outcomes", "Scheme answer time", "Health as a gauge", "One stack", "The dashboard", "Alerts as code", "When it goes silent", "Next: silence"],
  map,
  diagram,
  code,
});
