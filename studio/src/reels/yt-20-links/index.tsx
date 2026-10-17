import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt20LinksComposition = createEpisode({
  id: "yt-20-links",
  number: 20,
  part: 4,
  footer: "Payment links",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["No checkout?", "Create a link", "Any chat", "Claimed once", "Expiry", "Next: refunds"],
  map,
  diagram,
});
