import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence).
const TITLES = [
  "A new SIM", "Aziz's number", "Forgot password", "Every SMS", "Enough?",
  "Lesson 29", "The reset",
  "The phone number", "Login checks", "Known phone", "New phone",
  "Watch him", "The code arrives", "Green, even", "MyID required", "Not his face", "MyID protects",
  "Never at level 2?", "No face on file", "Time", "An active session", "The wait", "The end time", "Reset requested",
  "The owner sees it",
  "Who can cancel?", "Rank 2", "An operator", "Rank 1: no button", "Why so strict?", "The strongest check",
  "Cancel", "No cancel", "New password", "Sessions end", "Password changed",
  "My view", "Never by SMS alone",
  "The honest case", "Aziz forgets", "TAF: green", "MyID offered", "Re-check passed", "No wait", "New password",
  "The deal", "SIM and face", "Full check", "Without MyID: wait", "No session: no wait",
  "Side apps", "Weaker", "SMS reset", "Only if never seen", "Else: mobile bank", "Limited", "Still waits",
  "A real risk", "Accepted",
  "The trail", "Each step", "Counted", "Operator",
  "Recap", "Wait and cancel", "TAF and MyID", "Narrow SMS reset",
  "Back to the stranger", "Not forgotten", "Guessed", "Approve or not", "This was not me?",
  "Next: this was not me",
];

export const H30PasswordResetComposition = createEpisode({
  course: HEEYID,
  id: "h-30-password-reset",
  number: 30,
  part: 7,
  footer: "Wait, unless proven",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
