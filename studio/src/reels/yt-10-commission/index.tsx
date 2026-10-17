import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt10CommissionComposition = createEpisode({
  id: "yt-10-commission",
  number: 10,
  part: 2,
  footer: "Commission",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Who decides the fee?", "Not hardcoded", "Commission rules", "Most specific wins", "Priority", "One question", "Fee too high", "Maker-checker", "History", "Next: terminals"],
  map,
  diagram,
});
