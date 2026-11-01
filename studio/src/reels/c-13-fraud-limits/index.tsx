import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Sunday, 3 a.m.", "Malika is asleep", "Ten thousand numbers", "Most are dead", "A small shop", "Card testing",
  "A card network", "A real phone", "Money, codes, a list", "Lessons 9 and 10", "This lesson: counters",
  "A few tries", "The session ends", "A new session", "Nearly useless", "The next door",
  "Count the keys", "Written first", "Speed doesn't help", "Four ways", "By the card", "By the first digits",
  "By the address", "By the shop", "A limit and a window", "So many tries", "A velocity limit", "Refused first",
  "No code sent", "No attempt spent", "No new session", "What counts", "A wrong code", "The bank refuses",
  "An expiry typo", "Our own failures", "An alert", "Saturday afternoon", "The wrong code", "Tries left",
  "Out of tries", "A yellow note", "A fresh form", "Sunday, 3 a.m.", "Simply refused", "A counter's limit",
  "Too many attempts", "Try again later", "No network asked", "No phone buzzed", "Timur's team", "A velocity rule",
  "The counter that tripped", "Where to look", "Ordinary orders", "No testing bench", "Quiet phones", "The bank pays nothing",
  "Next: all the layers",
];

export const C13FraudLimitsComposition = createEpisode({
  id: "c-13-fraud-limits",
  number: 14,
  part: 3,
  footer: "Fraud limits",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
