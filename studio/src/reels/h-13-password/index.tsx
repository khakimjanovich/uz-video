import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Thursday night", "A leaked list", "Aziz is asleep", "His password", "Check, never read?",
  "Sunday: two times", "Monday: password first", "The password box",
  "Where it lives", "One number, one password", "One row", "The gateway's row", "Keycloak never sees it", "Why not Keycloak?", "Password before code", "Code first: no",
  "What is in the row", "Not the password", "Argon2id", "Memory-hard", "One check per login", "A stolen copy", "Salt", "Same password, new digest",
  "One string", "Settings: configuration", "No old passwords", "Not bcrypt",
  "Thursday again", "Password first", "Constant time", "A detail", "Fake digest", "Same answer, same time", "Nothing learned",
  "Wrong: +1", "Audit and antifraud", "The lock", "Locked", "Aziz is told", "Too many wrong passwords", "Ends by itself",
  "Friday morning", "It works", "Lock, not block", "Renewal: no password", "Breached list",
  "Never", "Not shown, not logged", "Masked, not kept", "Not the app PIN",
  "A check", "Nobody's number?", "Same time",
  "Salted Argon2id", "Checked first", "Lock, not block", "Level 1", "Phone, not person", "Lesson 12: Saturday",
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
