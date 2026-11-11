import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Thursday, 16:30", "A calm voice", "Install this", "Screen control", "All checks fine", "What can go wrong?",
  "Lesson 24: new phone", "This lesson: the hands",
  "The checks", "Trusted", "Valid grant", "Binding passes", "His own face", "All perfect",
  "Not the request", "The hands", "Guard on the phone",
  "Master app", "Two things", "Only the master app", "Self-protection", "Side apps: no",
  "Screen sharing", "Found", "Screen blocked", "Nothing to see",
  "Tell the platform", "Remote-access event", "Device, time, type", "Software or call",
  "What it does", "Audit event", "Antifraud event", "That is all", "No block", "Nothing changes", "Still valid",
  "Too soft?", "Lock everything?", "My view", "A call is not a crime", "His mother", "Locked out", "Not his fault",
  "The split", "App: the screen", "Platform: the record", "Antifraud: the pattern", "Events only", "No waiting",
  "Back to Aziz", "Screen dark", "Good sign", "Hangs up", "The real bank",
  "Module 5", "Record", "Grant", "Step-up", "Two logins", "The hands",
  "Recap", "Master app detects", "Screen blocked", "Record and forward",
  "The marketplace", "None of this", "How does it log in?", "Next: side-app login",
];

export const H25RemoteAccessComposition = createEpisode({
  course: HEEYID,
  id: "h-25-remote-access",
  number: 25,
  part: 5,
  footer: "Guard the hands",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 6,
});
