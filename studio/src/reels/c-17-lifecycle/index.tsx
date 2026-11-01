import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Right to take payments", "Lesson 16: a merchant", "No money yet", "This lesson: earning it", "Monday to Tuesday", "Nobody saw the papers", "Who let it in?",
  "A driving licence", "Its own number", "Earning its states", "How it works",
  "Company documents", "Who it does business with", "Know your business", "The file store",
  "The real type", "A fake charter refused", "A checksum", "A changed file caught",
  "Every document checked", "Verified or rejected", "Company verified", "A contract",
  "A unique number", "Every move written down", "The status history", "No move without a record",
  "Watch the product", "Documents", "Company documents", "Required",
  "If it applies", "Choose file, Upload", "Uploaded", "Waiting for review",
  "Now the trick", "A file that lies", "Only looks at the name", "The server refuses",
  "The bank admin portal", "Merchants", "Verify and Reject", "Say what is wrong",
  "Verifies both", "Approve documents grey", "Approve documents", "Sign contract",
  "History", "From, to, who, reason", "What does this protect?", "Who it is paying",
  "Without a fingerprint", "Without the history", "Know your business", "The people who checked",
  "Like a driving licence", "Next: two people",
];

export const C17LifecycleComposition = createEpisode({
  id: "c-17-lifecycle",
  number: 17,
  part: 4,
  footer: "Earning a licence",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
