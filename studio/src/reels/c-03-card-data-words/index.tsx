import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "What may you keep?", "Card ending 7890", "Card ending 7890",
  "A pasted number", "Everywhere", "Everywhere", "Like your bank",
  "The PAN", "The PAN", "The code on the back", "The code on the back",
  "The masked number", "The masked number", "The first digits",
  "A card token", "A card token", "Nothing from the number", "A coat-check ticket",
  "Back to the ticket", "Masked or token",
  "Make both", "Six and four", "Sixteen random bytes", "jshell", "Star out the rest", "The prefix", "A different token",
  "Masked and token", "Next: where it lives",
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
  code,
});
