import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence).
const TITLES = [
  "The copy shop", "Never logged out", "A new phone", "End that session", "One wants the other gone", "Who wins?",
  "Lesson 21", "Start time and rank",
  "Rules that fail", "Anyone ends anyone", "The thief keeps the door", "Older wins", "Three months older",
  "The thief again", "Age is not enough", "How strong a check?",
  "Rank", "Green: rank 2", "Yellow and MyID", "Not scored: rank 1", "Everyone else: rank 1",
  "The rule", "Only a lower rank", "Or a younger equal",
  "Back to the shop", "Rank 1", "Rank 2", "Refused", "The list of sessions", "The copy shop", "Ended",
  "Age between equals", "Older ends younger",
  "My view", "The strongest check", "The oldest door", "Rank, then age",
  "Deeper", "Password change", "Whatever the age", "Lesson 30",
  "New session alert", "Never silent",
  "Probation", "The riskiest moment", "Fooled once", "Some actions wait", "Which and how long?",
  "The bank decides", "Not the platform", "It does not know them", "Four facts in the token", "Each app blocks",
  "One shared truth",
  "Recap", "Rank 2", "Lower or younger", "Same or lower", "Probation",
  "A sharper stranger", "A new SIM", "Forgot password", "Aziz is still in", "At once?",
  "Next: password reset",
];

export const H29SessionsAndRankComposition = createEpisode({
  course: HEEYID,
  id: "h-29-sessions-and-rank",
  number: 29,
  part: 7,
  footer: "Rank first, then age",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
