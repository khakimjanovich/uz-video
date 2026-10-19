import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt10CommissionComposition = createEpisode({
  id: "yt-10-commission",
  number: 10,
  part: 2,
  footer: "Commission",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Who decides the fee?", "Negotiated", "Fee rules", "Most specific wins", "The formula", "Fee ≥ amount", "Four eyes", "No overlaps", "Replacing a fee", "Find + history", "One question", "Own schema", "Next: terminals"],
  map,
  diagram,
  code,
});
