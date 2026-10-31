import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Secure on its own?",
  "Says compliant",
  "The assessor asks",
  "None of them",
  "Room and building",
  "The guide",
  "Twelve requirements",
  "The network",
  "The keys",
  "Where it falls short",
  "Not certified alone",
  "Room and building",
  "The whole course",
];

export const C38ResponsibilityComposition = createEpisode({
  id: "c-38-responsibility",
  number: 38,
  part: 8,
  footer: "The room and the building",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
