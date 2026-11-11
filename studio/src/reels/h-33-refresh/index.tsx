import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Sunday", "A yellow line", "Nothing changed", "Why a date?", "Proofing and versions", "Documents expire",
  "The date", "Expiry date", "Document status", "Expiring, expired", "Daily job", "Document expiring", "Asked at each start", "The yellow line",
  "Later", "Expired", "What does not happen", "Grant stays valid", "No block", "Restricted flag", "Document expired", "Audit event", "The app applies it", "Only a refresh",
  "What is a refresh?", "Not an edit", "A full proofing", "Three starts", "Aziz", "The app", "An operator",
  "Trusted device", "Module 4", "Consent", "Number preset", "Live face", "Confirm", "No phone check",
  "The result", "New version", "Old version kept", "New reusable identifier", "Valid again", "Identity refreshed",
  "The rule", "Only a live face", "No other door", "Ask, never type", "Attempt limits", "Not counted",
  "Recap", "Asks, restricts", "Only a live face", "A different number", "Block?", "Next: blocks",
];

export const H33RefreshComposition = createEpisode({
  course: HEEYID,
  id: "h-33-refresh",
  number: 33,
  part: 8,
  footer: "Expired restricts, never blocks",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
