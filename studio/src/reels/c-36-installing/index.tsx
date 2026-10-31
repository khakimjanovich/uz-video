import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "No single person",
  "A torn map",
  "Any three",
  "Vault",
  "Five key shares",
  "Nothing written down",
  "Sealed after restart",
  "A master key",
  "Backed up together",
  "Next: one install",
];

export const C36InstallingComposition = createEpisode({
  id: "c-36-installing",
  number: 36,
  part: 8,
  footer: "Keyholders",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
