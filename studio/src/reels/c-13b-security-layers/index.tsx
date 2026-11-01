import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Monday, 10:14", "Peonies", "Under a minute", "Seven layers", "Since Lesson 4", "This lesson: every layer",
  "A bank vault", "A gate", "Glass at the counter", "A guard", "A safe", "Inner doors", "Cameras", "Keys no one holds",
  "No layer trusted", "The one before", "Defence in depth",
  "1 · The gate", "The only way in", "Not found", "Too fast",
  "2 · The glass", "Its own two files", "A changed file", "A stranger's script", "One page", "No skimming",
  "3 · The guard", "Counted four ways", "Refused", "No card testing",
  "4 · The safe", "Sealed", "Sealed only", "Opened to charge", "No leak",
  "5 · Inner doors", "ecom never sees it", "Only the token", "Two proofs", "Only what it needs", "No stranger",
  "6 · The cameras", "Written down", "First six, last four", "Starred out", "No card data", "No leak",
  "7 · Keyholders", "Starts locked", "Three of five", "No one insider",
  "The buyer's minute", "The padlock", "Groups of four", "A code", "Card accepted", "The masked line", "By token", "Paid",
  "Two fields, a button", "Timur's logs", "Masked only", "Who, what, when",
  "That night", "Locked", "Cards refused", "The keyholders meet", "Not Timur alone",
  "No single layer", "A script slips", "A password leaks", "A copy escapes", "The next one holds",
  "Next: merchants",
];

export const C13bSecurityLayersComposition = createEpisode({
  id: "c-13b-security-layers",
  number: 15,
  part: 3,
  footer: "Security layers",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
