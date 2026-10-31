import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Charged exactly once?", "Pay, twice", "Charged twice", "Nobody knows",
  "A cash desk", "One slip", "The logbook first", "The same way",
  "The claim", "One caller wins", "Terminal and fee", "Nothing charged",
  "Operation journal", "One debit", "By its token", "Once, even if sent twice",
  "Holds first", "Capture", "Approved: paid", "Declined: final", "Unknown",
  "In the code", "A single update", "Exactly one", "Written first", "One debit each",
  "One slip, one logbook", "Next: silence",
];

export const C26DebitComposition = createEpisode({
  id: "c-26-debit",
  number: 26,
  part: 6,
  footer: "The debit",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
