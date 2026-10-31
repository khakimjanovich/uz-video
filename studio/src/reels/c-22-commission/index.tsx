import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Who decides the fee?", "One number", "A lower rate", "A tangle", "Can't be explained",
  "Price tags", "Item beats aisle", "Most specific wins",
  "Fee rule", "Website, merchant, card, bank", "Most specific wins",
  "Percent plus fixed", "Minor units", "Rounded once",
  "Never edited", "Proposed, approved", "Never at once", "Each payment keeps it", "Always explained",
  "The price in code", "Rounded half up", "Four, two, one",
  "Try it", "One and a half percent", "Rounds up", "The fee", "The rest",
  "Price tags", "Next: e-POS",
];

export const C22CommissionComposition = createEpisode({
  id: "c-22-commission",
  number: 22,
  part: 5,
  footer: "Fee rules",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
