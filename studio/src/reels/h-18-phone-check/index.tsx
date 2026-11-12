import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "An old number", "Forgotten", "MyID remembers", "Whose number?",
  "Lesson 17", "The phone check",
  "Why?", "Person + number", "A face", "Not the number", "An impostor", "Level 2?",
  "After confirmation", "Step-up only", "1 · Face confirmation", "The app never sees it", "2 · Compare", "Same: Confirmed", "Different", "3 · Owner?", "TAF compares", "Owner", "Processing", "Owner ✓",
  "Confirmed", "Level 2", "Trusted device", "Linking",
  "Not owner?", "Processing", "Level 1", "Phone review", "What the operator sees", "No timer", "A person decides", "The bravest state", "No guessing", "Approve or reject", "Approve", "Reject", "Notified, audited", "The only alert",
  "Confirmed", "History", "Each check", "SMS", "TAF", "MyID", "How do we know?",
  "Recap", "Confirmed", "A bank customer?", "Not by phone",
  "Next: linking",
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
