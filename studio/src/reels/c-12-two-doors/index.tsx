import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "How many ways in?", "Two kinds of visitor", "Two kinds of visitor", "Two kinds of visitor",
  "One big proxy", "The most valuable box", "Two narrow doors",
  "A counter and a mail slot", "A counter and a mail slot", "A counter and a mail slot",
  "The payers' door", "Opens the envelope", "Only the frame", "Not found", "Submits, not pages", "Submits, not pages",
  "The callers' door", "Name on the outside", "Still sealed", "Pass-through", "Pass-through",
  "Only four names", "Refused", "No clear-text box",
  "The mail slot's rules", "One short list", "Nothing listens",
  "Check the counter", "200", "404", "Port 8443",
  "Counter and mail slot", "Next: the certificate",
];

export const C12TwoDoorsComposition = createEpisode({
  id: "c-12-two-doors",
  number: 12,
  part: 2,
  footer: "Two doors",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
