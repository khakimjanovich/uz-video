import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A Friday", "The bazaar", "Pocket empty", "Phone gone", "Lock everything", "Who may lock him out?",
  "Lesson 18: same phone", "Lesson 15: phone review", "The operator panel",
  "The people", "Staff identity", "No staff passwords", "Staff session", "One role", "Checked on the server", "Exact number only",
  "Four actions", "1. Phone review", "Approve", "Reject", "2. Block", "3. Unblock", "4. Reset", "Reason and audit",
  "Back to Friday", "Block", "One operator", "What a block does", "Grants end", "No money", "Requests refused", "Login refused", "MyID check stops",
  "Nothing deleted", "A pause", "Account blocked", "Audit and antifraud", "Not a lock", "Only operators lift it", "Only an operator", "Never by itself",
  "Saturday", "Sunday", "The second call", "Unblock asked", "A proposal", "Second operator", "Not his own", "Maker-checker", "Two people",
  "Unblock starts", "Devices back", "Money phone again", "Account unblocked", "Same rule", "Rejection: one",
  "Why two?", "Access back",
  "Staff identity", "Four actions", "One blocks, two unblock", "Reason and audit",
  "One night", "Lesson 20: the push",
];

export const H34BlockingComposition = createEpisode({
  course: HEEYID,
  id: "h-34-blocking",
  number: 19,
  part: 6,
  footer: "One blocks, two unblock",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 6,
});
