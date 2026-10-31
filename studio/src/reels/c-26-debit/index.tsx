import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Charged exactly once", "One cashier", "The same way", "One claim", "Terminal and fee",
  "Nothing is charged", "The logbook first", "Charge by token", "Some networks hold", "Approved means paid",
  "Declined is final", "No answer: unknown", "Next: goes silent",
];

export const C26DebitComposition = createEpisode({
  id: "c-26-debit",
  number: 26,
  part: 6,
  footer: "Debit",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
