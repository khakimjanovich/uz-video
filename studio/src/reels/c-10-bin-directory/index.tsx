import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Which network?", "A phone code", "Its BIN", "Lists of BINs", "Copied in",
  "Keeps its old list", "Longest prefix wins", "Before any code", "Refused early",
  "The first eight digits", "Next: the card form",
];

export const C10BinDirectoryComposition = createEpisode({
  id: "c-10-bin-directory",
  number: 10,
  part: 2,
  footer: "First digits",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
