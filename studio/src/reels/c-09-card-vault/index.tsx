import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "The worst day", "One card number", "A second", "Two seconds", "Looks finished", "Never next to it",
  "Lesson 6: Vault", "This lesson: sealing", "Hands it to Vault", "A sealed value", "Only the sealed value", "Never leaves Vault",
  "Its own card", "Will not open", "No shuffling", "A puzzle", "Find a card again", "Without opening",
  "A fingerprint", "Same number, same stamp", "One way", "A blind index", "Look up the fingerprint",
  "Guards its door", "Not sealed? Refused", "Even a mistake", "Vault down?", "The card vault stops", "Never guesses",
  "Fail closed", "Opened for a charge", "Written down", "Removed", "A short note",
  "None of this", "Confirms the code", "Card accepted", "The masked line", "Network and bank", "All anyone sees",
  "Vault stopped", "Refused", "Nothing saved", "An alert", "Names the part", "Goes through",
  "The report", "Sealed values", "Fingerprints", "Masked numbers", "No keys", "Kept apart",
  "All noise", "Never a card number", "Next: first digits",
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
