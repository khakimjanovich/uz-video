import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A washing machine", "A screen first", "Before the camera", "Why first?",
  "Lesson 13", "Phone, not person", "The consent gate",
  "The screen", "Four parts", "1 · The data", "2 · The provider", "3 · The purpose", "4 · Who reads later", "The bank's words", "Phone verified",
  "Refuse", "What happens?", "Nothing at MyID", "No session, no attempt", "One event", "Saying no is free",
  "Again", "The screen again", "Nothing pre-selected", "Accept", "Acceptance record", "What it holds", "Then MyID", "One yes, one session", "No second use",
  "Not only registration", "Every MyID call", "A new phone",
  "Versions", "Four languages", "Maker and checker", "Every version kept",
  "The race", "Reading", "A new version", "Accept, old text", "Refused", "Why so strict?", "The version he saw", "Word for word",
  "On the map", "The app",
  "Recap", "Yes", "The camera", "Who opens it?", "The marketplace?",
  "Next: proofing with MyID",
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
