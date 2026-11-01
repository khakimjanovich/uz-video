import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Monday", "One more door?", "Timur says no", "Lessons 11 and 7", "This lesson: two doors",
  "Two kinds of visitor", "Buyers' browsers", "Other products", "One big entrance", "Clear text", "The most valuable box",
  "A counter, a mail slot", "The payers' door", "An encrypted line", "A trusted certificate", "A few requests", "Not found",
  "How fast", "Loading the page", "The callers' door", "Arrives sealed", "The name outside", "Reads only that name",
  "Still sealed", "Pass-through", "A few names", "Any other name", "Checks the caller", "No key needed",
  "Each visitor", "Malika's page", "Its padlock", "The frame loads", "An admin page", "Not found", "Nothing is named",
  "Again and again", "The counter steps in", "Too many tries", "Still works", "Not on the list", "The connection closes",
  "Never reaches it", "A listed name", "An alert", "Every convenient door", "Only frame traffic", "Nothing it can read",
  "No door at all", "Two openings", "The admin portal", "Next: a certificate",
];

export const C12TwoDoorsComposition = createEpisode({
  id: "c-12-two-doors",
  number: 12,
  part: 3,
  footer: "Two doors",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
