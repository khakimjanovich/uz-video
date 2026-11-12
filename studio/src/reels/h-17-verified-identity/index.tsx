import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "The lift doors open", "His data", "In the bank", "Who can read it?",
  "Lesson 13", "Verified identity", "Three guards",
  "What it holds", "Protected class", "The identity", "MyID number, identifier", "Images, if kept", "Nothing else", "Other rules",
  "Lesson 6: Vault", "No copies",
  "Who may open it", "One closed part", "Ask with a purpose", "Masked values", "The short list", "Keep a result", "Confirmation screen", "Phone check", "Deletion job", "Cases and reviews",
  "Never", "Identity summary", "Nothing more", "Never to the others",
  "The trace", "Every release", "A case", "Masked values", "Recorded", "Encryption", "The audit trail", "Who · when · why",
  "Check", "His number in the app?", "Summary only",
  "One protected class", "The bank's keys", "Masked and audited",
  "MyID phone number", "An old number", "The phone check",
];

export const H17VerifiedIdentityComposition = createEpisode({
  course: HEEYID,
  id: "h-17-verified-identity",
  number: 14,
  part: 4,
  footer: "Encrypted, masked, audited",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
