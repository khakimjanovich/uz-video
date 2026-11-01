import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Never answers", "Charge a card", "Slow, or lost", "Time runs out", "Already charged?", "Or not", "Three mistakes",
  "Call it declined", "Send it again", "Wait in memory", "A parcel", "Tracking says nothing", "No second parcel",
  "Wait a little longer", "Ask a person", "The same way", "Never declined", "Don't pay again", "A durable workflow",
  "Remembers where it is", "One per payment", "This one charge", "Questions only", "Never moves money",
  "Longer each wait", "Backoff", "Room to recover", "Found: paid", "Not found: declined", "After the page closed",
  "Money goes back", "The daily cut-off", "The same day", "Manual review", "A person checks", "Watch the product",
  "Don't pay again", "Checking with the bank", "No answer", "The workflow's answer", "Paid, or declined",
  "The rare case", "The deadline nears", "Checked by a person", "Needs review", "Debited, not debited",
  "The network's reference", "A note", "Saved for audit", "Resolve", "What it protects", "Paying twice",
  "Shipping goods", "A charge explained", "Nobody remembering", "Back to the parcel", "Keep checking",
  "Next: the shop hears",
];

export const C27SilenceComposition = createEpisode({
  id: "c-27-silence",
  number: 27,
  part: 6,
  footer: "Silence",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
