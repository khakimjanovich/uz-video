import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Six years", "A card, a deposit", "One week", "The same man?",
  "Lesson 18", "Linking",
  "Two records", "Identity", "Money", "One thread", "One value out", "Nothing else",
  "Five answers", "Found: Linked", "Aziz", "Not found", "The bank's process", "Closed or blocked", "More than one", "No answer: Pending",
  "Identifier only", "Extra fields deleted", "Never a copy", "Why?", "Copies go old",
  "Comparison", "Another spelling", "A note", "No stop",
  "The rule", "Never by phone", "Nobody", "Number only", "Why?", "Numbers move", "A stranger", "Aziz's deposit?", "A contact channel",
  "Lookup down?", "Maintenance", "Pending", "Retries", "Refused, a case", "Access stays", "A separate fact", "The app decides",
  "Still ends well", "The operator", "Set by operator",
  "Recap", "Step-up complete", "Module 4 ends", "The phone", "Trusted?",
  "Next: the trusted device",
];

export const H19LinkingComposition = createEpisode({
  course: HEEYID,
  id: "h-19-linking",
  number: 19,
  part: 4,
  footer: "Link by number, never by phone",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
