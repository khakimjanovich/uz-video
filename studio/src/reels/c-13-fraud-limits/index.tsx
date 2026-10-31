import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Testing stolen cards", "A bag of keys", "The next door", "Keys and doors",
  "Ten thousand numbers", "Card testing", "A real person's phone",
  "Count every attempt", "A velocity limit", "Refused", "Failures about the card",
  "An alert", "Count the keys", "Next: a merchant signs up",
];

export const C13FraudLimitsComposition = createEpisode({
  id: "c-13-fraud-limits",
  number: 13,
  part: 2,
  footer: "Fraud limits",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
