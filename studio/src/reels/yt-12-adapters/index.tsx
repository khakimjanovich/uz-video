import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt12AdaptersComposition = createEpisode({
  id: "yt-12-adapters",
  number: 12,
  part: 3,
  footer: "Uzcard + Humo adapters",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Two languages", "REST vs SOAP", "Knows too much", "One port", "Two adapters", "Same command", "Same errors", "Test environments", "Next: BIN + vault"],
  map,
  diagram,
});
