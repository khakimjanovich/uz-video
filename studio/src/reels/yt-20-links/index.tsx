import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt20LinksComposition = createEpisode({
  id: "yt-20-links",
  number: 20,
  part: 4,
  footer: "Payment links",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["No checkout?", "A payment link", "Same page, same debit", "No client, no return", "Only the owner", "How long it works", "Shown once", "The buyer pays", "The expiry sweep", "Skip locked again", "Expired is final", "In the portal", "Next: refunds"],
  map,
  diagram,
  code,
});
