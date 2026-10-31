import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Every website?", "Each stall inspected", "A draft sales point", "Return addresses", "The site check",
  "The deal", "Switched on", "One question",
  "Next: the bank's fee",
];

export const C21SalesPointsComposition = createEpisode({
  id: "c-21-sales-points",
  number: 21,
  part: 4,
  footer: "Stalls at a market",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
