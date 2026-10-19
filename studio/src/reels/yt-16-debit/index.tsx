import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt16DebitComposition = createEpisode({
  id: "yt-16-debit",
  number: 16,
  part: 4,
  footer: "The debit",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Two clicks?", "Both would debit", "One claim", "Losers wait", "The route", "The fee", "Fail before money", "Journal first", "Ask the scheme", "Paid + RRN", "Declined", "Unknown, never declined", "Status table", "Both sides see it", "Next: observability"],
  map,
  diagram,
  code,
});
