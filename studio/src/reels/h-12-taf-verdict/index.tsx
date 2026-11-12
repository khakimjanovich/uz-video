import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Monday, a café", "Café Wi-Fi", "Password, then code", "Refused", "Why?",
  "Lesson 9: counters", "Where it arrived", "Master app only",
  "What TAF is", "A state service", "Through its adapter", "TAF sends the code", "This phone, this SIM", "A verdict",
  "Recommendation", "Advice", "The platform decides",
  "The app's job", "Start the part", "Send its identifier", "Code to TAF first", "Tell at logout", "Skipped: negative",
  "Two verdicts", "Basic: seven answers", "Risk: a colour", "The waiting time", "Basic decides", "All yes: Green", "One no: Red",
  "Recorded", "Lesson 16: SIM match",
  "Back to the café", "Not in time", "Device and SIM", "Red: refuse", "Attempt ends", "Nothing blocked", "Mobile network", "Wi-Fi off", "Green", "SIM match on record",
  "Yellow", "Yellow: refuse", "The bank's texts",
  "Level 1: nothing more", "Level 2: phone face", "Not MyID", "Fails: stop", "No face biometric: continue",
  "Face confirmation", "The platform sends it", "TAF silent: next login", "Lesson 15: ownership",
  "TAF down", "Health and timeout", "SMS vendor", "Not scored", "No checks", "Audit and alert", "TAF back",
  "Not an outage", "One trusted bank", "Another bank", "Change it there",
  "What TAF gets", "Only these", "Personal ID: one use", "Ownership: part identifier", "Never",
  "Suppose", "SMS instead?", "No code at all",
  "Code and verdict", "The platform decides", "Down: not scored", "Other bank: no code",
  "Password first", "Lesson 11: the password",
];

export const H12TafVerdictComposition = createEpisode({
  course: HEEYID,
  id: "h-12-taf-verdict",
  number: 10,
  part: 3,
  footer: "TAF advises, the platform decides",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 5,
});
