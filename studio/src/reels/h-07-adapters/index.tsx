import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Friday evening", "MyID goes quiet", "A spinner", "What happens?",
  "Lesson 6", "Walls around calls",
  "The domain", "Rules only", "No I/O", "Never calls out", "A port", "Domain words", "An adapter", "Eight ports",
  "Simulators", "Every answer", "Tests, no internet", "Nightly: MyID test", "The skipped part", "Not only good days",
  "The walls", "Timeout", "Breaker", "Breaker opens", "Probe", "Alert", "One fixed behaviour", "No bypass", "Named outcome",
  "Fixed behaviours", "MyID down", "Not counted", "TAF down", "No fallback", "SMS down", "Kafka waits", "Push down", "Lookup down", "Antifraud down",
  "Back to Aziz", "Named outcome", "Level kept", "Not counted", "Breaker open", "Provider status", "MyID back",
  "Two rules", "No bodies in logs", "Reference, outcome, time", "Config and Vault", "Own services",
  "Recap", "Ports and simulators", "Timeout and breaker", "Seconds, not forever",
  "Adapter secrets", "Encrypted passports", "Where are the keys?", "Next: keys",
];

export const H07AdaptersComposition = createEpisode({
  course: HEEYID,
  id: "h-07-adapters",
  number: 7,
  part: 2,
  footer: "A fixed answer for each outage",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
