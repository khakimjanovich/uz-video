import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Thursday night", "A leaked list", "Aziz is asleep", "His password", "Check, never read?",
  "Lesson 10: two times", "Lessons 11 and 12", "The password box",
  "Where it lives", "One row", "The gateway's row", "Keycloak never sees it", "Why not Keycloak?", "Password before code", "Code first: no",
  "What is in the row", "Not the password", "Argon2id", "Memory-hard", "One check per login", "A stolen copy", "Salt", "Same password, new digest",
  "One string", "Settings: configuration", "No old digests", "Not bcrypt",
  "Thursday again", "Password first", "Constant time", "A detail", "Dummy digest", "Same answer, same time", "Nothing learned",
  "Wrong: +1", "Audit and antifraud", "Locked", "Aziz is told", "Too many wrong passwords", "Try later",
  "Friday morning", "It works", "Lock, not block", "Renewal: no password", "When the lock ends",
  "The change", "Current, new, new", "Same rules", "Wrong current counts", "New digest", "Counter zero", "Nothing half done", "Weaker sessions end", "Laptop ends", "Log in again", "Password changed",
  "Never", "Not shown, not logged", "Masked, not kept", "Not the app PIN",
  "Recap", "Salted Argon2id", "Checked first", "Lock, not block", "Change ends sessions",
  "Level 1", "Phone, not person", "MyID", "Agree to what?", "Next: consent",
];

export const H13PasswordComposition = createEpisode({
  course: HEEYID,
  id: "h-13-password",
  number: 11,
  part: 3,
  footer: "One row, slow digest, checked first",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 5,
});
