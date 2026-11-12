import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Six months later", "Not me", "What happened?", "Provable truth", "Who can rewrite?", "Lesson 35", "Audit events",
  "One event", "Who and when", "Where", "Result and reason", "Every journey", "Never inside", "No documents", "No secrets", "Masked", "Safe to travel",
  "Nobody changes it", "Add only", "No change, no delete", "No update right", "A chain", "HMAC", "Audit key", "One edit breaks all", "Daily verifier", "Check us",
  "Who reads it", "Bank monitoring", "Kept, then sent", "Antifraud events", "Compliance export",
  "The letter", "That Friday", "Web login", "Approved after theft", "Block, then revoke", "The stolen phone",
  "How long", "A clock for each", "One-time code", "Unfinished registration", "Earlier version", "The customer", "Audit events", "Versions",
  "Backups too", "Deletion report",
  "Recap", "Chain and streams", "Who exported?", "Who checks them?", "Next: the admin panel",
];

export const H36AuditAndRetentionComposition = createEpisode({
  course: HEEYID,
  id: "h-36-audit-and-retention",
  number: 21,
  part: 6,
  footer: "Add only, check daily",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
