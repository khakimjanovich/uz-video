import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt21RefundsComposition = createEpisode({
  id: "yt-21-refunds",
  number: 21,
  part: 4,
  footer: "Refunds and reversals",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Today or next week?", "Reversal", "Refund", "Partial", "Never more", "Refund window", "Next: billing"],
  map,
  diagram,
});
