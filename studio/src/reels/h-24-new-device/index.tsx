import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A new phone", "SIM moved", "Number and password", "Enough?", "A stranger has the same",
  "Lesson 23: known phone", "This lesson: new phone",
  "Password first", "Nothing before it", "Not known", "New-device request",
  "The code", "Through TAF", "Login, new model", "Lands on the SIM", "Proves the SIM", "Not the person",
  "The old phone", "Still a session", "Rank 2", "Lesson 29", "Trusted to answer",
  "Push signal", "No code", "Pull", "Model, address, time", "The warning", "Approve or not",
  "My view", "A friendly voice", "Nothing to read out",
  "Approve + code", "Both needed", "Silent: code after wait", "No rank 2: code", "Rank 1: notice",
  "Verdict", "Green",
  "Account check", "What kind?", "Dormant", "Lesson 32", "Never level 2", "Step-up later",
  "Was level 2", "MyID re-check", "Full proofing", "Face matches",
  "The guard", "SIM, password, code", "Not his face",
  "Complete", "New record", "Trusted", "Else Known", "New grant", "The notice", "Push and SMS", "Events",
  "The other button", "Number on hold", "Lesson 31",
  "Side apps", "Approval, no code", "Bank SMS, level 1", "Lesson 26",
  "Recap", "Not enough", "Code: the SIM", "Old phone approves", "MyID: the face",
  "Safe from strangers", "A caller?", "Next: remote access",
];

export const H24NewDeviceComposition = createEpisode({
  course: HEEYID,
  id: "h-24-new-device",
  number: 24,
  part: 5,
  footer: "Code, approval, face",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 5,
});
