import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Suppose", "MyID check", "MyID goes quiet", "A spinner", "What happens?",
  "Lessons 3 and 4", "Talking to the outside",
  "The core", "Rules only", "No input, no output", "Never calls out", "A port", "Words of the rules", "An adapter",
  "Four adapters", "TAF inside", "Egress proxy", "Own units",
  "The tests", "One real adapter", "A simulator", "Same API", "Every answer", "No internet", "Each night",
  "Good days only", "Bad days too",
  "The walls", "Timeout", "Breaker", "Breaker opens", "Fail at once", "Test call", "Alert",
  "Installation settings", "New deployment",
  "One fixed behaviour", "No bypass", "One plain answer", "MyID down", "Level kept", "Nothing later",
  "TAF down", "Not an outage", "SMS vendor down", "Kafka waits", "Push down",
  "Back to Aziz", "Plain answer", "Level kept", "Not counted", "Breaker opens", "At once", "MyID back",
  "Two rules", "No bodies in logs", "Reference, outcome, time", "Config and Vault", "Own credential",
  "Check", "Bank SMS, not scored",
  "No input, no output", "Ports and simulators", "Timeout and breaker", "Seconds, not forever",
  "Adapter secrets", "Lesson 6: keys",
];

export const H07AdaptersComposition = createEpisode({
  course: HEEYID,
  id: "h-07-adapters",
  number: 5,
  part: 2,
  footer: "A fixed answer for each outage",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
