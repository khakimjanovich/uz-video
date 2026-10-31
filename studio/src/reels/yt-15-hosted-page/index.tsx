import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt15HostedPageComposition = createEpisode({
  id: "yt-15-hosted-page",
  number: 15,
  part: 4,
  footer: "The payment page",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Whose page?", "Shops with cards", "The bank's page", "Token = credential", "A session per page", "Live schemes only", "The card frame", "One parent, two files", "Script inventory", "Scheme first", "Token, not number", "Bound to this payment", "Confirm, then debit", "Attempts per session", "Claimed first", "A fresh session", "Card testing", "Card entry limited", "One at a time", "Next: the debit"],
  map,
  diagram,
  code,
});
