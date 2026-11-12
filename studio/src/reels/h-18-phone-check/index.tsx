import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "An old number", "Forgotten", "MyID remembers", "Whose number?",
  "Lesson 14", "The phone check",
  "Level 2", "Person + number", "A face", "Not the number", "An impostor", "Why the check",
  "After confirmation", "1 · Face confirmation", "The app never sees it", "2 · Compare", "Same: Confirmed", "Different", "No number", "3 · Owner?", "TAF compares", "Owner", "Not owner", "Processing", "Owner ✓",
  "Confirmed", "Identity verified",
  "Not owner?", "Record closed", "SMS and a count",
  "No answer?", "Processing", "The app shows it", "Phone review", "What the operator sees", "No timer", "No guessing", "Review list", "Alert by age", "Approve or reject", "Second operator", "Level 2", "Reject: at once", "Audited",
  "Confirmed", "Each check", "TAF code", "MyID", "TAF owner", "How the bank knows",
  "Check", "Same number?", "No question to TAF",
  "Person and number", "MyID first", "Three answers", "Two operators, one",
  "Level 2", "The money phone",
];

export const H18PhoneCheckComposition = createEpisode({
  course: HEEYID,
  id: "h-18-phone-check",
  number: 15,
  part: 4,
  footer: "Person and number, together",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
