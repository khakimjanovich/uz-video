import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "The vendor closes", "Dark office", "Eight o'clock", "Does it work?",
  "Lesson 3", "Where it runs", "Yes",
  "The bank's perimeter", "The bank operates it", "One installation, one bank", "Second bank, second installation",
  "No call to the vendor", "No control plane", "Not needed", "Not needed at night", "Data stays in Uzbekistan",
  "The edge", "What may cross?", "Configured hosts", "1 · Bank services", "2 · TAF", "TAF agent inside", "Nothing to install",
  "3 · MyID", "Pinned, from Vault", "4 · Push service", "Type and reference", "No personal data", "Text over the session",
  "The whole list", "Egress proxy",
  "Zones inside", "One edge", "Application services", "Data zone", "No edge connection", "Gateway first",
  "Two installations", "Stage and production", "No route between", "Stage: MyID test", "Production: real MyID", "Only configuration", "No data moves",
  "Start-up guard", "Test host? No start",
  "Eight o'clock", "The path", "Code through TAF", "Nothing leaves", "Vendor not needed",
  "Recap", "No vendor", "Four outside names", "Zones and installations",
  "One Keycloak", "A leaked token?", "Next: apps and tokens",
];

export const H04PerimeterComposition = createEpisode({
  course: HEEYID,
  id: "h-04-perimeter",
  number: 3,
  part: 2,
  footer: "Inside the bank, no vendor",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
