import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "The vendor closes", "Dark office", "Eight o'clock", "Does it work?",
  "Journey, map, words", "Where it runs", "Yes",
  "The bank's perimeter", "The bank operates it", "Installation", "Second bank, second installation",
  "No call to the vendor", "No switch, no data home", "Nothing changes for Aziz", "Not needed at night", "Data stays in Uzbekistan",
  "The edge", "Egress proxy", "Configured host names", "Three names outside", "1 · MyID", "MyID adapter, Vault",
  "2 · SMS vendor", "Delivery reports", "3 · Push service", "Type and reference", "Text over the session",
  "TAF: not on the list", "TAF agent inside", "Nothing to install", "Three names, one gate",
  "Three networks", "Edge", "Application network", "Data network", "No edge connection", "Gateway first",
  "Two zones", "Stage and production", "One host, Docker Compose", "No route between", "Stage: MyID test", "Production: real MyID",
  "Only configuration moves", "No data moves", "Start-up guard", "Test host? No start",
  "Eight o'clock", "Edge, gateway, records", "Code through TAF", "Vendor not needed",
  "What may a push carry?", "Type and reference only",
  "One installation, one bank", "No vendor", "Three names outside", "Two zones",
  "Starts from configuration", "Lesson 4: configuration",
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
