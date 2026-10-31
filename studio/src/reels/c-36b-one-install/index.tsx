import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Laptop and bank",
  "One recipe",
  "Same install",
  "Only the values",
  "Card zone first",
  "A preflight",
  "Vault, then settings",
  "Start and check",
  "A new value",
  "Next: releases",
];

export const C36bOneInstallComposition = createEpisode({
  id: "c-36b-one-install",
  number: "36b",
  part: 8,
  footer: "One install",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
