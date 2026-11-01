import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "What may you keep?", "Card ending 7890", "The digits on the back",
  "A pasted card number", "Backups, search, readers", "Like your bank",
  "The PAN", "The card zone", "The code on the back", "The masked number",
  "A card token", "Tells a thief nothing", "Masked or token",
  "Never the PAN", "Next: where it lives",
];

export const C03CardDataWordsComposition = createEpisode({
  id: "c-03-card-data-words",
  number: 3,
  part: 0,
  footer: "PAN · masked · token",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
