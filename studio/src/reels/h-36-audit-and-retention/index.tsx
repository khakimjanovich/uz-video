import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A letter", "From Aziz", "Friday to Sunday", "Anyone?", "Prove it",
  "Lesson 19: the block", "Lesson 20: the messages", "A record stays", "The audit trail",
  "One event", "What, where, when", "Who acted", "Device and result", "Every step",
  "No secrets", "Never inside", "Masked number", "Safe to travel",
  "Outbox", "Two readers", "Bank monitoring", "Waits, then in order", "Audit module",
  "Only grows", "No change, no delete", "The database refuses", "Full access?", "A chain",
  "Next number", "HMAC seal", "What the seal covers", "Audit key", "One holder",
  "HMAC chain", "One change", "Every seal after", "No key, no fit", "Daily check", "Alert",
  "Back to the letter", "Friday to Sunday",
  "Friday: block", "Access ended", "Weekend: refused", "Nothing moved", "Sunday: two operators", "Unblocked",
  "No break", "The answer",
  "Not forever", "Retention", "One-time code", "Unfinished registration", "Customer record", "After closure",
  "Audit events", "Versions", "Retention job", "Nothing early",
  "A question", "One event deleted", "The next seal",
  "One event per step", "Within seconds", "Only grows, sealed", "Data goes, events stay",
  "In the bank", "Lesson 22: installing",
];

export const H36AuditAndRetentionComposition = createEpisode({
  course: HEEYID,
  id: "h-36-audit-and-retention",
  number: 21,
  part: 6,
  footer: "Sealed in a chain, kept on a clock",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
