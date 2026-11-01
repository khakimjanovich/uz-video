import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "How many ways in?", "Lesson 4: two doors", "Lessons 7 and 11", "This lesson: the doors", "Two kinds of visitor", "Buyers' browsers", "Other products", "One big entrance",
  "Clear text", "The most valuable box", "Two narrow doors", "A counter, a mail slot", "The counter", "The payers' door",
  "An encrypted line", "A trusted certificate", "The request", "A few requests", "Not found", "How fast",
  "Loading the page", "The mail slot", "The callers' door", "Arrives sealed", "The name outside", "Reads only that name",
  "Never opens it", "Still sealed", "Pass-through", "A few names", "Any other name", "Checks the caller",
  "No key needed", "Watch the product", "Each visitor", "The payment page", "Its padlock", "The frame loads",
  "A different address", "Not found", "Nothing is named", "Again and again", "The counter steps in", "Too many tries",
  "Still good", "Not on the list", "The connection closes", "Never reaches it", "A listed name", "Monitoring",
  "An alert", "What it protects", "Every caller's secrets", "One break", "Only frame traffic", "Nothing it can read",
  "No door at all", "The cardholders", "The bank's network", "Two openings", "Back to the bank", "A counter",
  "A mail slot", "Never in clear text", "Next: a certificate",
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
