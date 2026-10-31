import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Never alone", "Two signatures", "Four eyes", "The maker", "Nothing changes yet",
  "The checker", "Not your own request", "Expires", "Documents again", "Both people named",
  "Next: server login",
];

export const C18FourEyesComposition = createEpisode({
  id: "c-18-four-eyes",
  number: 18,
  part: 4,
  footer: "Two signatures",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
