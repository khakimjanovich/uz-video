import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Not more than allowed",
  "The last seat",
  "Payment limits",
  "Per payment: refused",
  "The daily limit",
  "Reserve in one step",
  "Wait their turn",
  "Fails before money",
  "The edge",
  "Next: the keys",
];

export const C35HardeningComposition = createEpisode({
  id: "c-35-hardening",
  number: 35,
  part: 7,
  footer: "Limits and the edge",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
