import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "The same payment twice?", "No answer", "Sent again", "Two payment pages",
  "A lift button", "One lift comes",
  "Idempotency key", "The first answer", "Idempotent replay", "Refused",
  "At the same moment", "The unique key",
  "In the code", "The record", "Never stored twice", "Look first", "Replayed", "The winner's answer",
  "One payment comes", "Next: the payment page",
];

export const C24bIdempotencyComposition = createEpisode({
  id: "c-24b-idempotency",
  number: "24b",
  part: 6,
  footer: "Idempotency",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
