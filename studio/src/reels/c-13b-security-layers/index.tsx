import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "How deep?", "A bank vault", "A gate", "A guard", "Inner doors", "A safe", "Cameras", "No one layer", "Might fail",
  "Defence in depth", "The same way", "Layer by layer", "1: the gate", "Only this door", "Not found", "Too fast",
  "2: the glass", "Its own two files", "A changed file", "A stranger's script", "Its session names", "Stops a skimmer",
  "3: the guard", "Counted first", "Past the limits", "Stops card testing", "4: the safe", "Vault seals",
  "Refuses unsealed", "Opened for the network", "Not a single card", "5: the inner doors", "Never sees the number",
  "Only the token", "Two proofs", "Its role", "Stops a stranger", "6: the cameras", "Written down", "First six, last four",
  "Starred out", "No card data", "Not a leak", "7: the keyholders", "Starts locked", "Three of five", "Not alone",
  "One insider", "Watch the product", "The payment page", "The padlock", "Groups of four", "Send code", "Card accepted",
  "The masked line", "By token", "Paid", "Seven layers", "The card zone's logs", "Never the whole one", "Who, what, when",
  "Vault restarts", "Back locked", "Refuses new cards", "The keyholders meet", "What it protects", "Any layer can fail",
  "A script slips", "A password leaks", "A copy escapes", "The next one holds", "Cardholders, shops, bank",
  "Back to the vault", "Every layer", "Beat every one", "Only has to hold", "Next: sign-up",
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
