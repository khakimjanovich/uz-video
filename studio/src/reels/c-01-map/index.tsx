import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A fee change", "Your first ticket", "One big service", "A card security review",
  "Split in two", "A unit", "ecom, the shop", "The cards unit",
  "Three kinds of people", "Three kinds of people", "Three kinds of people", "Three kinds of people",
  "A module", "A module",
  "The only place", "The only place",
  "Share nothing", "Share nothing",
  "One line", "One line", "Installed first",
  "Back to the ticket", "The shop alone", "Locked room first",
  "On your laptop", "On your laptop", "On your laptop", "On your laptop",
  "Two lists", "Two lists", "Two lists", "Two lists",
  "Two units, running", "Next: a card payment",
];

export const C01MapComposition = createEpisode({
  id: "c-01-map",
  number: 1,
  part: 0,
  footer: "The map",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  code,
});
