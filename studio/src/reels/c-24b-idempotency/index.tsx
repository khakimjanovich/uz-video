import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "The same payment twice", "No answer", "The same request again", "Two payment pages", "A lift button",
  "Idempotency key", "Same key, same request", "A different request", "At the same moment", "One payment",
  "Next: the page",
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
});
