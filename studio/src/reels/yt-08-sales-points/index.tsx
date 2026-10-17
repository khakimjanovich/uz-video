import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt08SalesPointsComposition = createEpisode({
  id: "yt-08-sales-points",
  number: 8,
  part: 1,
  footer: "Sales points + site check",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Which website?", "A sales point", "Draft", "Two checks", "Failed", "Active", "URL locked", "Is it active?", "Next: starters"],
  map,
  diagram,
});
