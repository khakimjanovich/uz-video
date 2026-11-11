import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence).
const TITLES = [
  "Saturday", "A washing machine", "Mother's laptop", "Never seen him", "No face, no SIM", "Really Aziz?",
  "Lesson 24", "Side apps",
  "What a side app lacks", "No TAF part", "No MyID", "Master app only", "Password and SMS", "And the master app",
  "A new customer", "Phone number", "SMS code", "Password two times", "Level 1", "Never trusted", "Not confirmed",
  "Until a TAF check", "Hold that mark",
  "Aziz logs in", "Number and password", "Password first", "Nothing before it",
  "A master-app session?", "Yes", "No code", "Approval request", "Request id only", "Pull, not push", "What it shows", "Two buttons",
  "Approve", "Level of the approver", "Level 2", "The only way",
  "My view", "A trusted session", "No code to steal",
  "Other paths", "No answer", "The configured time", "SMS code", "Level 1", "No master app",
  "This was not me", "Number on hold", "Lesson 31",
  "Marketplace app", "Approval replaces SMS", "Or SMS, level 1",
  "Never MyID at login", "Level 1 first", "Level 2 by approval",
  "New web login",
  "Back to the credit", "Needs level 2", "No MyID here", "Go to the mobile bank",
  "Recap", "Approval or SMS", "Only the approval",
  "Not confirmed", "Web first", "Whose account?", "Next: account link",
];

export const H26SideAppLoginComposition = createEpisode({
  course: HEEYID,
  id: "h-26-side-app-login",
  number: 26,
  part: 6,
  footer: "Password first, then approve",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
