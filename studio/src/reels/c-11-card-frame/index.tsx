import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "No database break-in", "One line of script", "A changed file", "Copies every number", "The page still works",
  "The buyer still pays", "Unnoticed for weeks", "Web skimming", "The card frame", "Its own address", "Like a window",
  "The bank's card reader", "Tamper seals", "Seals too", "Seal one: one page", "A session", "Look-alike refused",
  "Seal two: a policy", "A rule", "Its own two files", "Refused before it runs", "Seal three", "A fingerprint",
  "One character changes", "A token, masked number", "Only that page", "The number never leaves", "It reports it",
  "A trace", "Watched too", "Watch the product", "The payment page", "Two fields", "Groups of four", "Its slash",
  "Send code, Confirm", "Card accepted", "The masked line", "Try to break it", "On its own", "One sentence",
  "No form", "A look-alike site", "A refused box", "Act as a skimmer", "Another address", "A red line", "Nothing loads",
  "A report", "The card zone's logs", "No card data", "What it protects", "In plain view", "At the keyboard",
  "A stranger's script", "A stolen form", "The shop", "The card reader", "The bank's software", "One counter",
  "A broken seal shows", "Next: two doors",
];

export const C11CardFrameComposition = createEpisode({
  id: "c-11-card-frame",
  number: 11,
  part: 2,
  footer: "Card frame",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
