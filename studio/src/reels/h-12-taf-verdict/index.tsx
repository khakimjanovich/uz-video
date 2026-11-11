import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Monday, a café", "Café Wi-Fi", "The code", "Refused", "Why?",
  "Lesson 11: counters", "No counter can", "Where it arrived", "Master app only",
  "What TAF is", "A state service", "TAF sends the code", "This phone, this SIM", "A verdict",
  "Recommendation", "Advice", "The platform decides",
  "The app's job", "Start the part", "Send its id", "Code to TAF first", "Tell at logout", "Skipped: negative",
  "Two verdicts", "Basic: seven answers", "Risk: a colour", "The waiting time", "Basic decides", "All yes: Green", "One no: Red",
  "Back to the café", "Not in time", "Device and SIM", "Red: refuse", "Attempt ends", "Nothing blocked", "Mobile network", "Wi-Fi off", "Green", "Stronger rank",
  "Yellow", "Was at level 2: MyID", "Pass: trusted", "Fail: refuse", "Others: refuse", "No MyID yet",
  "Fast forward", "Level 2, Green", "Phone biometric", "Not MyID", "Face confirmation", "The platform sends it", "TAF fails: continue", "Level 1: none",
  "TAF down?", "Health and timeout", "Bank SMS", "Not scored", "No checks", "Audit and alert", "Weaker rank", "TAF back",
  "No fallback here", "One trusted bank", "Another bank", "Not an outage", "Stop", "Change it there",
  "What TAF gets", "Only these", "Personal ID: two uses", "Never",
  "Recap", "Code and verdict", "The platform decides", "Down: not scored", "Other bank: nothing",
  "Password first", "Check, never read?", "Next: the password",
];

export const H12TafVerdictComposition = createEpisode({
  course: HEEYID,
  id: "h-12-taf-verdict",
  number: 12,
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
