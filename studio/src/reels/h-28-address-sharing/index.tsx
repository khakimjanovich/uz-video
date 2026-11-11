import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence).
const TITLES = [
  "A bookshelf", "Add address", "From MyID", "Same bank, same person", "Why ask?",
  "Lesson 27", "Verified identity",
  "What it can see", "Own tokens only", "Lesson 5", "The summary", "No address", "Protected record", "Keys and audit",
  "One way out",
  "How it runs", "Sharing request", "Two checks", "Level 2?", "Linked?", "If not", "Go to the mobile bank",
  "Both yes", "Push signal", "Request id only", "One question", "Share your address?", "Share",
  "One purpose", "Audit", "One time", "Delivered",
  "Other answers", "Refuse", "No answer", "Audited too",
  "Next month", "Asks again", "No standing consent", "My view", "Ticked once", "Aziz decides",
  "Moving out", "Delete it there", "No part in it", "The marketplace's copy",
  "What it cannot do", "No key", "No passport data", "Not at level 1", "Cannot skip",
  "Recap", "Level 2 and linked", "Each time, each read",
  "Many sessions", "A stranger", "Who wins?", "Next: sessions and rank",
];

export const H28AddressSharingComposition = createEpisode({
  course: HEEYID,
  id: "h-28-address-sharing",
  number: 28,
  part: 6,
  footer: "Ask each time",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
