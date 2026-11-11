import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence).
const TITLES = [
  "Last spring", "SMS code and password", "The mobile bank", "Two doors", "Trust it?",
  "Lesson 26", "After the TAF check",
  "Why the mark", "Someone read an SMS", "Nothing more", "No TAF in a browser",
  "Same number", "Number known", "No second customer", "Same password", "Password", "TAF code", "Green",
  "Only now", "Not confirmed",
  "One question", "Also a marketplace account", "Is it yours?", "Link it?", "Yes", "It stays", "Linked",
  "Level of the person", "The easy answer",
  "What if not his?", "Someone else", "One SMS code", "No", "Not at once", "Asked twice", "Continue?",
  "Back", "Back: no change", "My view", "One wrong tap", "Continue", "Sessions end", "Closed", "Not deleted",
  "Reopen with a reason", "A clean page", "New password now", "Why?", "They may know it", "Look again",
  "He never knew it", "Stuck at step 1", "Then what?", "Reset in the mobile bank", "TAF and MyID",
  "Full MyID check", "No wait", "Lesson 30", "Outranks", "Sessions end", "Lesson 29",
  "The trail", "Who did what",
  "Recap", "One question", "Yes: linked", "No: closed",
  "Aziz said Yes", "Level 2", "Delivery", "Registered address", "Just read it?", "Next: address sharing",
];

export const H27AccountLinkComposition = createEpisode({
  course: HEEYID,
  id: "h-27-account-link",
  number: 27,
  part: 6,
  footer: "Is this account yours?",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
