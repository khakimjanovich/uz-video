import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt22BillingComposition = createEpisode({
  id: "yt-22-billing",
  number: 22,
  part: 4,
  footer: "Billing and reports",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Bills + books", "Usage counters", "Batch flush", "Daily report", "Books match", "Next: hardening"],
  map,
  diagram,
});
