import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Without breaking in", "One line of script", "Web skimming", "Seals on the reader",
  "Only its own page", "Its own two files", "A fingerprint each", "Token, masked number",
  "It reports it", "The page watched too", "Next: two doors",
];

export const C11CardFrameComposition = createEpisode({
  id: "c-11-card-frame",
  number: 11,
  part: 2,
  footer: "Card frame",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
