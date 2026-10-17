import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt17ObservabilityComposition = createEpisode({
  id: "yt-17-observability",
  number: 17,
  part: 4,
  footer: "Observability",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["How would you know?", "Logs aren't enough", "Metrics", "Dashboards", "Traces", "Logs in Loki", "Find the stuck one", "Next: silence"],
  map,
  diagram,
});
