import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "In a lift", "Check done", "Passed or lost?",
  "Lesson 14", "One session",
  "The marketplace", "Level 2 needed", "Step-up", "Continue in the mobile bank", "No session", "Why?", "The master app", "One door", "One more tap", "Consent there",
  "The backend opens it", "Credentials stay", "Threshold", "Session id", "Proofing session", "One purpose", "Ten minutes", "No second session",
  "Capture", "Live? Matches?", "Result code", "A code, not a result", "A ticket", "Back to the platform", "Only once", "Exchange",
  "Copied code", "Sent again", "Refused", "Security event", "Never stored",
  "Check every field", "Fourteen digits", "Expired document", "Face not matched", "Succeeded", "Confirm",
  "Plain words", "Glare", "Reason key", "No codes", "Counted", "Not counted", "MyID down", "No deferred proofing",
  "The lift", "No code arrived", "Session status", "Code found", "Try again",
  "Recap", "Level 2", "A new phone", "Passport again?",
  "Next: prove once",
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
