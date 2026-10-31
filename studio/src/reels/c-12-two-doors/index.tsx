import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Ways into the room", "Two kinds of visitor", "Buyers' browsers", "Services from other units",
  "One big entrance", "Two narrow doors", "Counter and mail slot",
  "Payers' door: counter", "Not found", "How fast",
  "Callers' door: mail slot", "Arrives sealed", "Pass-through", "Only a few names",
  "Never in clear text", "Next: its certificate",
];

export const C12TwoDoorsComposition = createEpisode({
  id: "c-12-two-doors",
  number: 12,
  part: 2,
  footer: "Two doors",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
