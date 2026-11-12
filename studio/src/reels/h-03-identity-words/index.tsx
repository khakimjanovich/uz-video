import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Saturday", "Password ✓ · code ✓", "Mobile bank open", "Money to his mother", "Money does not move", "Why not enough?",
  "Lesson 1: the journey", "Three words", "Three checks",
  "Authentication", "The owner", "Knows and has", "What it does not say", "Not the state records", "Who registered", "A stranger passes",
  "Identity proofing", "The real person", "MyID, mobile bank", "Face and passport", "One time", "Fast, every login",
  "The common mistake", "Account, not person",
  "Authorisation", "May do what, now", "Money needs level 2", "Money data", "Own data: level 1", "The rule stopped it",
  "Three levels", "Level 0", "Level 1", "Level 2", "Only its check", "No operator, no setting",
  "Person and session", "Level 2: trusted phone", "MyID + SIM", "Only it moves money",
  "Saturday: level 1", "Not refused", "Level and check", "Consent, MyID, phone", "Level 2", "Transfer goes", "Level and phone",
  "Tokens carry the level", "No own format", "Two open standards", "OAuth 2.1", "OpenID Connect", "The app decides",
  "Why no money?", "Only authentication",
  "Authentication: owner", "Proofing: person", "Authorisation: may do", "Today: money phone",
  "Lesson 3: the perimeter",
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
