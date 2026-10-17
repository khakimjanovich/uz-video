import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt16DebitComposition = createEpisode({
  id: "yt-16-debit",
  number: 16,
  part: 4,
  footer: "The debit",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Two clicks?", "Both debit", "Atomic claim", "Terminal + fee", "Journal first", "Authorize", "Capture", "Captured + RRN", "State machine", "Next: observability"],
  map,
  diagram,
});
