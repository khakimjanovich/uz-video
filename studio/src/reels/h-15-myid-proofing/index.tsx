import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Saturday afternoon", "In a lift", "No network", "Check done", "Passed or lost?",
  "One yes, one session", "This hour",
  "After the yes", "The phone first", "Root? Emulator?", "No session", "Not possible here", "The app checks", "A clean phone",
  "Only the mobile bank", "The MyID part", "One door",
  "The backend opens it", "His login", "SIM match", "No match: no call", "Match", "Credentials stay", "Minimum face match",
  "Session id", "Proofing session", "One purpose", "Ten minutes", "No second session", "Other phone: no",
  "Capture", "Live? Matches?", "Result code", "A code, not a result", "A ticket", "Back to the platform", "Only once", "Exchange",
  "Copied code", "Sent again", "Refused", "Security event", "Never stored",
  "Check every field", "Fourteen digits", "Minimum age", "Expired document", "Face not matched",
  "Plain words", "Glare", "Poor image", "Try again now", "No codes",
  "The limits", "Three counters", "Counted", "Not counted", "MyID down", "Cool-downs", "Daily cap", "Configured", "Operator reset", "A new yes",
  "The lift", "No code arrived", "Session status", "Code found", "Still busy", "No code: not counted",
  "Succeeded", "Masked data", "Confirmed",
  "A check", "An attempt lost?", "Not lost",
  "Mobile bank only", "Platform opens", "One-use code", "Plain words, limits",
  "Not level 2 yet", "One step left", "Lesson 14: the identity",
];

export const H15MyIdProofingComposition = createEpisode({
  course: HEEYID,
  id: "h-15-myid-proofing",
  number: 13,
  part: 4,
  footer: "One session, one-use code",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
