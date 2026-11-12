import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "The first day", "Sunday, week 1", "A phone number", "Number to account?", "Lesson 7: the contract", "The first call",
  "Register · Log in", "A fixed link", "Same for every number", "Register",
  "The terms", "TAF named", "Accepted",
  "Continue", "One request", "The phone", "Network address", "Four checks", "Mobile number", "App active", "Terms version", "Limits: lesson 9",
  "Registration record", "His language", "Device identifier", "Only this phone",
  "One-time code", "Random", "Fingerprint only", "Lifetime and resends",
  "TAF sends the SMS", "This phone, this SIM", "TAF silent: lesson 10",
  "A slow SMS", "Register again", "Second registration", "One open registration", "Two messages", "Code typed",
  "The phone that started", "Another device: wrong", "Fingerprints match", "Number verified",
  "Verdict: Green", "Then the lookup", "A new person", "Nothing before verified",
  "Password?", "A phone call", "App closed", "State?", "Continue, not restart", "Other device: Expired",
  "Password, two times", "Entries differ", "Entries match", "Rules: lesson 11",
  "Four things", "Level 1", "App account", "Device: known", "Session", "Onboarded",
  "Registration complete", "Push after the token",
  "No waiting forever", "Expired", "Data deleted", "Start again",
  "The first message", "Does it work?", "No: wrong entry",
  "Two entries", "Terms, checks, record", "Code through TAF", "One open, resumes", "Level 1, by SMS",
  "Lesson 9: codes and limits",
];

export const H10RegistrationComposition = createEpisode({
  course: HEEYID,
  id: "h-10-registration",
  number: 8,
  part: 3,
  footer: "Number, code, password, level 1",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 4,
});
