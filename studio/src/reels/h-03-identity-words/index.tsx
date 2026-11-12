import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Sunday evening", "The kettle", "Password ✓", "Order closed", "Approve in the mobile bank", "Why not enough?",
  "Lesson 2", "Three words", "Three questions",
  "Authentication", "The owner?", "Knows and has", "Approve", "Or a code", "What it does not say", "Not the state records", "Only the owner", "A stranger passes",
  "Identity proofing", "The real person?", "MyID, master app", "Face and document", "One time",
  "Slow and rare", "Fast, every login", "The common mistake", "It is not", "Account, not person",
  "Authorisation", "May do what?", "Level 2 for personal data", "The rule",
  "What is a level?", "Three levels", "Level 0", "Level 1", "Level 2", "Only its check", "No shortcut",
  "The surprise", "Two levels", "Person: level 2", "Session: trusted device", "Trusted device", "His phone", "Never a browser", "Approve on the phone",
  "Sunday again", "The request", "Approve", "Order open",
  "Another evening", "No master-app session", "SMS code", "Authenticated", "Level 1: closed", "Not refused", "Step-up",
  "Two answers", "The session decides",
  "Two names", "OAuth 2.1", "OpenID Connect", "No own format", "Standard tokens", "The app decides",
  "Recap", "Proofing", "Authorisation", "Two levels", "Why closed?", "First question only",
  "Passports, phones", "Where does it run?", "Next: the perimeter",
];

export const H03IdentityWordsComposition = createEpisode({
  course: HEEYID,
  id: "h-03-identity-words",
  number: 2,
  part: 1,
  footer: "Owner, person, permission",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  keepLabels: true,
});
