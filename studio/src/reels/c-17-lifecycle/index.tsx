import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Monday morning", "Lesson 16: a merchant",
  "Documents", "Company documents", "Required", "If it applies",
  "Who it does business with", "Know your business", "Payments by lunch", "Who let it in?",
  "Choose file, Upload", "Uploaded", "Waiting for review",
  "The file store", "The real type", "A trick", "Only looks at the name", "The server refuses",
  "A checksum", "A swapped file caught",
  "Dilnoza at the bank", "Merchants", "Verify and Reject", "Say what is wrong", "Verifies both",
  "Company verified", "Approve documents grey", "Approve documents", "Sign contract", "A unique number",
  "History", "From, to, who, why", "The status history", "Add it first", "No move without a record",
  "One screen, months later",
  "Know your business", "It protects Dilnoza", "Papers and a contract", "Still no money",
  "Next: two people",
];

export const C17LifecycleComposition = createEpisode({
  id: "c-17-lifecycle",
  number: 17,
  part: 4,
  footer: "Checked papers first",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
