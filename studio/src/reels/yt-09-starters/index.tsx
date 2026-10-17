import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt09StartersComposition = createEpisode({
  id: "yt-09-starters",
  number: 9,
  part: 1,
  footer: "Extract the starters",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Same code twice?", "Copied code", "Starters", "error-starter", "security-starter", "otp + redis", "Free for new modules", "Fix once", "Next: commission"],
  map,
  diagram,
});
