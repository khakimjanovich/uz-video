import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt25ExtractionComposition = createEpisode({
  id: "yt-25-extraction",
  number: 25,
  part: 5,
  footer: "Extract a module",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Its own service?", "Stricter rules", "Clean boundary", "Same port, REST", "Own database", "Same flow", "The whole system"],
  map,
  diagram,
});
