import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "I never bought this",
  "Small-claims court",
  "A dispute",
  "Where it comes from",
  "Registered",
  "Banking days",
  "Won",
  "Lost: a chargeback",
  "Written down",
  "Next: checking books",
];

export const C33DisputesComposition = createEpisode({
  id: "c-33-disputes",
  number: 33,
  part: 7,
  footer: "Disputes",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
