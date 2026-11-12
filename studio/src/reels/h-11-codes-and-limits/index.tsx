import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Two in the morning", "A code", "Another one", "Not asked", "A script", "Who stops it?",
  "Lesson 10: a digest", "Rules around the code",
  "The code", "Random", "A table of codes", "No code inside", "Pepper", "A copy is useless", "Older codes void", "One alive", "Never in clear",
  "Constant time", "Timing tells nothing",
  "Limits on one code", "Bank policy", "Short life", "Few wrong entries", "Tries remain", "Void", "Minimum interval", "Few resends",
  "From outside", "TAF's own lock", "Never looser", "Or TAF locks first",
  "Guessing fails", "It does not guess", "It asks", "Rate limits", "Three counters", "Per number", "Per address", "Per device", "Bank policy",
  "Limit reached", "Too many requests", "Audit and antifraud", "Quiet",
  "Where?", "Valkey", "Cool-downs expire", "Not the only copy", "Rebuilt or expires",
  "The key rule", "App: convenience", "The server counts", "No app at all", "The API says no",
  "MyID attempts", "Three subjects", "One at the limit", "Cap and cool-downs", "Next try at", "Only the person's failure", "Face mismatch counts", "Outage does not", "Operator reset", "Test customers",
  "Recap", "One code", "Rate limits", "Server decides",
  "Monday's code", "Right code", "Which phone?", "Next: the TAF verdict",
];

export const H11CodesAndLimitsComposition = createEpisode({
  course: HEEYID,
  id: "h-11-codes-and-limits",
  number: 9,
  part: 3,
  footer: "One code, few tries, server counts",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 6,
});
