import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt21RefundsComposition = createEpisode({
  id: "yt-21-refunds",
  number: 21,
  part: 4,
  footer: "Refunds and reversals",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Money back", "The day decides", "Reversal", "Refund", "Settlement time zone", "The refund window", "Always the whole amount", "One claim wins", "Journal first", "Three outcomes", "An event, a webhook", "Server or portal", "Next: daily reports"],
  map,
  diagram,
  code,
});
