import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "The operator", "One button", "A lot of power", "Who watches?", "Every action an event", "The panel",
  "The door", "Bank staff identity", "No staff passwords", "Session limits", "Admin gateway", "One copy of the rules",
  "Four roles", "Where roles come from", "Viewer", "Operator", "Operator, more", "Security admin", "Compliance", "What is missing", "Checked on the server",
  "The screen", "Exact search", "No name search", "One view", "Masked", "Never shown", "A reason", "Audit and notice", "Cases and reviews",
  "Maker-checker", "Monday", "Not yet", "A proposal", "Second admin", "Never your own", "Approved", "New version", "Rejected, kept", "Every rule", "No one alone",
  "Recap", "Four roles", "Two people", "Real customers", "Without a real person?", "Next: test identities",
];

export const H37AdminPanelComposition = createEpisode({
  course: HEEYID,
  id: "h-37-admin-panel",
  number: 37,
  part: 9,
  footer: "One role each, two people per rule",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
