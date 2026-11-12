import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Friday night", "Phone gone", "Lock everything", "Who may block?", "A refresh mismatch", "Block and unblock",
  "A short list", "Only two", "One automatic block", "Reassignment: no block", "A failed face", "Counted attempt", "Cool-downs", "Counted", "Not counted",
  "Back to Aziz", "Block, with a reason", "One block", "Grants ended", "Requests refused", "Login refused", "Proofing stopped", "Data kept", "Account blocked", "A case", "Audit and antifraud",
  "At the next request?", "Three writes", "Revocation list", "Next request", "Same writes",
  "The case", "One folder", "What it shows", "Other triggers", "Phone reviews", "Case results",
  "Saturday", "Unblock", "Only an operator", "Trusted again", "The devices", "The thief's too", "Revoke first", "New phone",
  "The exception", "No device back", "Full proofing first", "Which face?",
  "Recap", "What a block does", "Unblock", "Still strange", "Push to a stolen phone", "What can it show?", "Next: notifications",
];

export const H34BlockingComposition = createEpisode({
  course: HEEYID,
  id: "h-34-blocking",
  number: 19,
  part: 6,
  footer: "Two can block, one can unblock",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
