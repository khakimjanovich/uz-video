import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "7 March, near midnight", "Women's Day", "Five buyers at once", "Together, far over", "A stolen account",
  "Lessons 21 and 27", "Limits that hold", "Two limits", "Set in the deal", "Per payment", "Refused at once",
  "Server or link", "The daily race", "The obvious check", "Looks safe", "All five through", "How to stop five?",
  "An atomic reservation", "One step", "Add if it fits", "One waits", "Fails before money moves",
  "Saved with the charge", "Declined: share back", "Reversed: share back", "Unknown keeps it", "Same business day",
  "The edge", "Modern encryption", "Secure only", "No software name", "Size and rate limits", "Deal terms",
  "Two fields", "Empty means none", "Enter and save", "Limits shown", "Bekzod's link", "Not done",
  "At most one payment", "No link created", "Before midnight", "Five press Pay", "Four fit", "The fifth doesn't",
  "No money taken", "No fortune at once", "Within the deal", "Before the charge", "Recap",
  "The fifth buyer's money?", "Nothing moves", "Next: the keys",
];

export const C35HardeningComposition = createEpisode({
  id: "c-35-hardening",
  number: 37,
  part: 6,
  footer: "Limits and the edge",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
  focus: true,
  hidePanelBefore: 52, // no course panel during the story; it returns on the last beat
});
