import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Testing stolen cards", "A bag of keys", "A bag of keys", "The next door", "Keys and doors",
  "Card testing", "Card testing", "A real person's phone",
  "A few tries", "A new session",
  "Written down first", "Never the number", "Address and shop", "Four counters",
  "Velocity limit", "Refused", "A wrong code counts", "Our failures don't",
  "An alert",
  "The rules", "What is counted", "Before any network", "Never counted", "No new session",
  "Count the keys", "Next: ecom",
];

export const C13FraudLimitsComposition = createEpisode({
  id: "c-13-fraud-limits",
  number: 13,
  part: 2,
  footer: "Velocity limits",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
