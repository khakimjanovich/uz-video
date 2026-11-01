import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Testing stolen cards", "A bag of keys", "Key after key", "Three wrong keys", "The next door", "Stolen card numbers",
  "Payment sessions", "Ten thousand numbers", "Most are dead", "A small shop", "Card testing", "Every try",
  "A code to a phone", "Costs the bank", "A few tries", "The session ends", "A new session", "Not enough",
  "Count the keys", "Every attempt", "The same moment", "Four things", "Its fingerprint", "First digits",
  "The buyer's address", "The shop", "A limit, a window", "So many failed tries", "The bank's chosen limits",
  "A velocity limit", "Refused first", "No code is sent", "No attempt spent", "No new session", "Failures that count",
  "A wrong code", "The bank refuses", "A mistyped expiry", "Never against anyone", "An alert", "Watch the product",
  "The wrong code", "Tries left", "Out of tries", "The form clears", "A yellow note", "A fresh form", "A bad day",
  "Card after card", "Just refused", "A counter's limit", "Too many attempts", "Too many attempts", "No network asked",
  "No phone buzzes", "An alert email", "A velocity rule", "The counter that tripped", "Where to look", "What it protects",
  "Cardholders", "A testing bench", "The bank", "The bag of keys", "The same keys", "Keys, not doors", "Next: the layers",
];

export const C13FraudLimitsComposition = createEpisode({
  id: "c-13-fraud-limits",
  number: 13,
  part: 2,
  footer: "Fraud limits",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
