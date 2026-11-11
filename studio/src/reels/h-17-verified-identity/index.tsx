import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A stolen disk", "The identity table", "What can he read?",
  "Lesson 16", "How it is protected",
  "Protected", "The identity", "MyID phone number", "Reusable identifier", "Images, if kept", "Nothing else", "Other rules",
  "The keys", "A key per record", "Wrapped", "The bank's Vault", "One request", "No copies", "Ciphertext",
  "Find by number?", "Blind index", "A keyed digest", "Look it up", "Useless without the key",
  "One module", "Others ask", "Masked by default", "The short list", "Keep a result", "Confirmation screen", "Phone check", "Customer lookup", "Cases and reviews", "Compliance export", "Deletion job", "Shared address",
  "Never", "Apps: a summary", "Never to antifraud", "Other apps",
  "Every release", "A case", "Masked values", "Recorded", "The audit line", "Thief and insider", "Who read what",
  "History", "Only a refresh", "A new version", "Same number",
  "Recap", "MyID phone number", "An old number?", "His number?",
  "Next: the phone check",
];

export const H17VerifiedIdentityComposition = createEpisode({
  course: HEEYID,
  id: "h-17-verified-identity",
  number: 17,
  part: 4,
  footer: "Encrypted, masked, audited",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
