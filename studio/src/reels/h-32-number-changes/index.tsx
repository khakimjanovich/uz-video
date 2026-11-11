import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence).
const TITLES = [
  "A new SIM", "A used number", "The old owner", "A new phone", "Looks like a thief", "Owner or thief?",
  "Lesson 31", "Three cases",
  "Reassignment", "Not a registration", "Not his password", "Forgot password", "TAF code", "MyID required",
  "His face", "A different person", "The signal", "A thief fails", "An owner passes",
  "Number removed", "No block", "Nothing wrong", "Sessions end", "Number removed", "The trail",
  "My view", "Normal life",
  "Who gets it?", "The person found", "Listed: level 2", "Not listed: review", "Already a customer",
  "Re-registration",
  "One person, two numbers", "The usual shape", "Level 1, then MyID", "Already exists", "One question",
  "On MyID's list?", "Move the number", "Trusted device", "Earlier devices revoked", "Record closed",
  "SMS to the old number", "Aziz's path", "New phone trusted", "Not listed", "A case", "Limited",
  "Dormant", "A long while", "The dormancy period", "Dormant", "Not on a code alone", "Nobody watching",
  "Ask for more", "MyID again", "Side app: level 1", "Never level 2", "Lock, then new", "Dormant reset",
  "Nothing handed over", "Reassignment again",
  "One transaction", "Never on two",
  "Recap", "No block", "Re-registration", "More than a code",
  "Settled", "The passport", "Level 2?", "Next: identity refresh",
];

export const H32NumberChangesComposition = createEpisode({
  course: HEEYID,
  id: "h-32-number-changes",
  number: 32,
  part: 7,
  footer: "MyID decides the number",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
