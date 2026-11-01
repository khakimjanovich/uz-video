import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Thursday, 10:50 p.m.", "A wedding bouquet", "Then nothing", "Time runs out", "Already charged?", "Or not",
  "Unknown, our own id", "This lesson: asking", "Three mistakes", "Call it declined", "Send it again", "Wait in memory",
  "The hardest case", "A refusal", "Never declined", "Don't pay again", "A durable workflow", "Remembers where it is",
  "One per payment", "This one charge", "Questions only", "Never moves money", "Longer each wait", "Backoff",
  "Room to recover", "Found: paid", "Not found: declined", "After the page closed", "Money goes back", "The daily cut-off",
  "The same day", "Manual review", "A person checks", "The wedding bouquet", "Don't pay again", "Checking with the bank",
  "No answer", "A little later", "Paid, or declined", "The rare case", "The deadline nears", "Checked by a person",
  "Dilnoza: needs review", "Debited, not debited", "The network's reference", "A note", "Saved for audit", "Resolve",
  "Paid once, or not", "Ships only if paid", "Every charge explained", "Nobody remembering", "Next: the shop hears",
];

export const C27SilenceComposition = createEpisode({
  id: "c-27-silence",
  number: 28,
  part: 5,
  footer: "Silence",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
