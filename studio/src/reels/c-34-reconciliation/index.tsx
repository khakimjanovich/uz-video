import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Do records match?",
  "Tick each line",
  "Reconciliation",
  "Our side",
  "Their side",
  "Paired lines",
  "A break",
  "An exception",
  "Someone else decides",
  "Never ignored",
  "Next: the last seat",
];

export const C34ReconciliationComposition = createEpisode({
  id: "c-34-reconciliation",
  number: 34,
  part: 7,
  footer: "Reconciliation",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
