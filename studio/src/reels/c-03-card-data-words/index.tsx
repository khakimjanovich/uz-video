import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "What may you keep?", "Card ending 7890", "Never the whole number", "The digits on the back",
  "A support engineer", "A support ticket", "Lives in the ticket", "Backups, search, readers", "Many places",
  "Like your bank", "The words",
  "The PAN", "A thief needs it most", "The card zone",
  "The security code", "Nobody may keep it", "Never even asks",
  "The masked number", "First six, last four", "Which bank", "Your own card", "Cannot be used to pay",
  "A card token", "A random name", "Nothing from the number", "Two tokens", "Tells a thief nothing",
  "Three rules", "The PAN", "May be shown", "May be kept", "Never kept",
  "Watch the product", "The payment page", "Card details", "Number and date", "No code box", "Types the card",
  "One short line", "Gone from the screen",
  "Bank admin portal", "A Card column", "A masked number", "No full card number", "No more",
  "What does it protect?", "Leaks nothing useful", "Only a random name", "The PAN, if it leaks", "One room",
  "The buyer first",
  "The support ticket", "Masked or token", "Leaks nothing", "Never the PAN", "Next: where it lives",
];

export const C03CardDataWordsComposition = createEpisode({
  id: "c-03-card-data-words",
  number: 3,
  part: 1,
  footer: "PAN · masked · token",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
