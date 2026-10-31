import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "What is running?",
  "A printed edition",
  "Releases",
  "Version numbers",
  "Fixed once made",
  "Pinned versions",
  "An upgrade",
  "Forward only",
  "Next: who does what",
];

export const C37ReleasesComposition = createEpisode({
  id: "c-37-releases",
  number: 37,
  part: 8,
  footer: "Releases",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
