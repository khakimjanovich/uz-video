import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Saturday", "Send", "Money waits", "A screen of text", "Why text?",
  "Since Sunday", "Number · code · password", "Level 1", "Toward level 2",
  "Each app", "Required level", "Mobile bank: level 1", "Own data: level 1", "Money: level 2", "Transfer: level 2",
  "Not allowed?", "Never refused", "Step-up", "Three parts", "Current: 1", "Required: 2", "The checks", "Only MyID", "Nobody else", "The way up",
  "Consent gate", "Before every MyID call", "Four parts", "1 · The data", "2 · The provider", "3 · The purpose", "4 · Who reads later", "TAF: the ID number", "The bank's words",
  "Versions", "Four languages", "Proposer, approver", "Every version kept", "Published version",
  "Refuse", "No session", "No attempt", "One event", "No costs nothing", "A real choice",
  "The rent", "Send again", "Nothing selected", "No earlier yes", "Accept", "Record first", "What it holds", "Then MyID", "One yes, one session", "No second use",
  "One more case", "Reading slowly", "A new version", "Accept, old text", "Refused", "Word for word",
  "On the map", "The app",
  "Your check", "Refuse: attempts?", "None",
  "Required level", "Step-up", "Consent gate", "One yes, one session", "Transfer waits", "Lesson 13: MyID",
];

export const H14ConsentComposition = createEpisode({
  course: HEEYID,
  id: "h-14-consent",
  number: 12,
  part: 4,
  footer: "Consent before every MyID call",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
