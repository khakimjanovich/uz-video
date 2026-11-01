import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "A stolen database", "The worst day", "A copy leaks", "Every card is gone", "A key next to them", "Never next to the data",
  "The locked room", "A sealed bag", "Only one machine", "Never lends its key", "Vault", "The card vault",
  "A sealed value", "Only the sealed value", "Key never leaves", "Tied to its own card", "Will not open",
  "No shuffling bags", "A puzzle", "Find a card again", "Without opening", "A fingerprint", "Same fingerprint",
  "Cannot be turned back", "A blind index", "Never the number", "The database guards", "Not sealed: refused",
  "Even a mistake", "Vault is down?", "The card vault stops", "It never guesses", "Fail closed", "One reason only",
  "Written down", "Removed", "A short note", "Watch the product", "Each side sees", "Confirms the code",
  "Card accepted", "One line", "Network and bank", "The masked line", "Vault stops", "The form refuses",
  "Nothing is saved", "An alert", "The part that failed", "Vault is back", "The leaked copy", "An attacker opens it",
  "Sealed values", "No keys there", "A backup", "What it protects", "Every cardholder", "All see noise",
  "Not a leak of cards", "The sealed bags", "Keeps its key", "A stamp", "Refuses unsealed", "Just noise",
  "Next: first digits",
];

export const C09CardVaultComposition = createEpisode({
  id: "c-09-card-vault",
  number: 9,
  part: 3,
  footer: "Card vault",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
