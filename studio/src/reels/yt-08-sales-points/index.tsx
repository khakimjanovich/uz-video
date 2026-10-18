import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt08SalesPointsComposition = createEpisode({
  id: "yt-08-sales-points",
  number: 8,
  part: 1,
  footer: "Sales points + site check",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Which website?", "A sales point", "Own domain only", "Draft", "The check", "Findings", "Deal terms", "Switching on", "Frozen", "Suspend + close", "Payable?", "Tests", "Under load", "Two real bugs", "Next: platform libs"],
  map,
  diagram,
  code,
});
