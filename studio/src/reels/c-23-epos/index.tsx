import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Which machine?", "A licence plate", "The e-POS terminal", "One website, one card", "One live terminal",
  "The centre accepts", "Every change written", "Ask for the terminal", "No terminal, no charge",
  "Next: really the merchant?",
];

export const C23EposComposition = createEpisode({
  id: "c-23-epos",
  number: 23,
  part: 5,
  footer: "A taxi's licence plate",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
