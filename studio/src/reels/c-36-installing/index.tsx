import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Monday, 7 a.m.", "A fresh server", "Five colleagues", "Dilnoza",
  "Lesson 6: Vault", "Lesson 9: sealed", "This lesson: opening Vault",
  "The easier way", "A text file", "Timur leaves", "A disk fails", "Can't be read", "Lost or leaked", "Strangers", "The bigger risk",
  "A different way", "Five key shares", "A key share", "Any three shares", "Not one, not two", "A keyholder",
  "Their password manager", "No one holds two", "Nothing written down",
  "Vault locks itself", "Sealed", "Unseal it", "Until then",
  "A master key", "Always revoked", "Nothing to steal",
  "Backups", "Sealed by Vault", "Unreadable", "Backed up together",
  "The installer", "Checks the machine", "Vault is new", "Press Enter", "Timur presses Enter", "On the people",
  "Each saves their own", "Every share saved", "The screen cleared", "Three keyholders", "Starts the services", "Revokes the master key",
  "Day one", "A restart", "The installer's check", "Vault is sealed", "Three called", "Dilnoza first", "Two more", "The check passes",
  "Nine o'clock", "No one alone", "Loses nothing", "Nothing readable", "A restore works",
  "Next: one install",
];

export const C36InstallingComposition = createEpisode({
  id: "c-36-installing",
  number: 38,
  part: 7,
  footer: "Keyholders",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
