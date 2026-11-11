import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A lost disk", "Everything on it", "Aziz too", "What can they read?",
  "Lesson 7", "Where keys live",
  "Vault", "The bank's Vault", "Never the vendor", "The bank keeps the keys", "Six kinds", "Across the disk",
  "1 · Identity", "A data key", "Wrapped", "Never leaves Vault", "Unwrap, one request", "Envelope encryption", "Cannot open", "Each unwrap recorded",
  "2 · Search", "Exact number", "Encrypted", "Blind index", "Exact search works", "No key, no test", "Device binding",
  "3 · Codes", "Pepper", "Short codes", "No check possible",
  "4 · Audit", "HMAC chain", "Change breaks it", "Daily verifier",
  "5 · Signatures", "Realm keys", "Encrypted keystore",
  "6 · Credentials", "Only its adapter", "A file for push", "Never code, phone, log",
  "Passwords?", "Not encrypted", "Slow, salted hash", "Nothing to steal",
  "Keys age", "Rotation", "Re-wrap", "Old chains verify", "Owners approve",
  "The disk again", "What they have", "Keys stay", "Hardware, not identities",
  "Recap", "Six kinds", "Envelope, index, digests", "Never on a phone",
  "The apps", "What may an app keep?", "Next: the API contract",
];

export const H08KeysComposition = createEpisode({
  course: HEEYID,
  id: "h-08-keys",
  number: 8,
  part: 2,
  footer: "The bank keeps the keys",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
