import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Money back", "The tab book", "A reversal", "A refund", "The day decides", "Cap and window", "One claim", "Refused",
  "No answer", "On request", "Next: one payment",
];

export const C30RefundsComposition = createEpisode({
  id: "c-30-refunds",
  number: 30,
  part: 6,
  footer: "Refunds",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
