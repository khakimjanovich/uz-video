import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Web skimming", "One line of script", "A changed file", "Copies every number", "The page still works", "The buyer still pays",
  "Unnoticed for weeks", "Bekzod asks Timur", "Come and try", "Lesson 5: the card reader", "This lesson: the seals",
  "Its own address", "Like a window", "Tamper seals", "Three seals", "Seal one: one page", "A session",
  "Look-alike refused", "Seal two: a policy", "A rule", "Its own two files", "Refused before it runs",
  "Seal three", "A fingerprint", "One character changes", "A token, masked number", "Only that page",
  "The number never leaves", "It reports it", "A trace", "The page is watched", "Break it", "A normal payment",
  "Two fields", "Groups of four", "The slash", "Send code, Confirm", "Card accepted", "The masked line",
  "Opened alone", "One sentence", "No form", "A look-alike site", "A refused box", "Play the thief",
  "Another address", "A red line", "Nothing loads", "Timur's screen", "A report", "In the logs", "No card data",
  "Most people forget", "At the keyboard", "Plain view", "Guard that moment", "The buyer", "The bank", "Malika",
  "Bekzod slept", "Next: two doors",
];

export const C11CardFrameComposition = createEpisode({
  id: "c-11-card-frame",
  number: 11,
  part: 3,
  footer: "Card frame",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
