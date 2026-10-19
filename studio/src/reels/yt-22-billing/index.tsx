import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt22BillingComposition = createEpisode({
  id: "yt-22-billing",
  number: 22,
  part: 4,
  footer: "Daily reports",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["How much do I get?", "Every night", "The business day", "Paid and refunded", "The payout", "Build again, replace", "The nightly job", "The CSV", "Quoted cells", "In the portal", "Next: hardening"],
  map,
  diagram,
  code,
});
