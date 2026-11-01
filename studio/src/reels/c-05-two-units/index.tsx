import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Without seeing the card", "The bank's card reader", "Only a receipt", "The payment page",
  "A card-entry session", "An address", "A frame", "Straight to the card zone", "Only the token",
  "Charge by token", "A contract", "Only what it allows", "ecom still guards it",
  "Next: settings",
];

export const C05TwoUnitsComposition = createEpisode({
  id: "c-05-two-units",
  number: 5,
  part: 1,
  footer: "The bank's card reader",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
