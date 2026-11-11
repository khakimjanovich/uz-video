import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "One in the morning", "A push", "Nothing to read", "Little, on purpose", "Codes so far", "Every message",
  "The roads", "No own contract", "SMS and push", "Codes follow the app", "Master app: TAF", "Side apps: bank SMS", "Only code messages",
  "The addresses", "SMS: two numbers", "Push: own devices",
  "Never lost?", "A password change", "One transaction", "Relay and worker", "Crash-safe", "No false message", "Delivery reports", "Retries",
  "Must be sent", "Security notifications", "New session", "Each one goes out",
  "Lesson 31", "This was not me", "Push only", "Who holds the SIM?",
  "What it may say", "No document data", "First name only", "Login details", "Push: no content", "Type and reference", "Pull the text", "Only his devices",
  "The thief sees", "A doorbell", "Outside the perimeter", "Push down: SMS",
  "The words", "Four languages", "Maker-checker", "Version in the audit",
  "Recap", "Nothing lost", "Each one an event", "Friday night", "Prove it", "Next: the audit trail",
];

export const H35NotificationsComposition = createEpisode({
  course: HEEYID,
  id: "h-35-notifications",
  number: 35,
  part: 8,
  footer: "A push is a doorbell, not a letter",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
