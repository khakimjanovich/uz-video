import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A different language", "A plug adapter", "Plug never changes", "Its own protocol",
  "One adapter per centre", "One plug shape", "The same questions",
  "Three outcomes", "Timeout is unknown", "Our own payment id",
  "A new adapter", "Next: keep it safe",
];

export const C08AdaptersComposition = createEpisode({
  id: "c-08-adapters",
  number: 8,
  part: 2,
  footer: "Adapters",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
