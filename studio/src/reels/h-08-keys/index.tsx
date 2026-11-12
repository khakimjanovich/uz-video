import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A lost disk", "Nobody should have it", "Everything on it", "Aziz too", "What can they read?",
  "Lesson 5: the adapters", "Credentials from Vault", "Vault opens",
  "A safe for keys", "One per zone", "The bank unlocks it", "Never the vendor", "The bank keeps the keys", "Nine kinds", "Three lock the disk",
  "1 · Identity", "Not by the platform", "Vault seals it", "Encryption inside Vault", "No key beside it", "Read: ask Vault", "Open, one request", "Bound to its place", "Each opening recorded", "Nothing opens them",
  "2 · Search", "Find by number", "Encrypted", "Blind index", "Exact search works", "No way back", "No key, no fingerprint",
  "3 · Codes", "Only a fingerprint", "Few digits", "Pepper", "Tries give nothing",
  "Six more kinds", "Audit seal", "Keycloak's keys", "Adapter credentials", "Between the units", "Never code, log, phone",
  "Passwords", "Slow, salted", "Nothing to decrypt",
  "Keys grow old", "Seal again",
  "The disk again", "Readable: the number", "Unreadable: the identity", "Keys stay", "Only lost hardware",
  "A guessed number", "A match?", "No index key, no match",
  "One Vault per zone", "Vault · index · pepper", "No key on a phone", "No key, many calls", "Lesson 7: the API contract",
];

export const H08KeysComposition = createEpisode({
  course: HEEYID,
  id: "h-08-keys",
  number: 6,
  part: 2,
  footer: "The bank keeps the keys",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
