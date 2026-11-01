import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Monday, 2 p.m.", "Vault is open", "Lesson 38: keyholders", "Everything else", "Bekzod's laptop", "This lesson: one install",
  "Installed by hand", "Which values?", "Nobody understands",
  "Identical steps", "Only the values", "A value",
  "The card zone's values", "Callers and roles", "Fraud limits", "Sessions and tries", "The bank's choice", "No defaults",
  "Nobody decided", "Kept in Vault",
  "Order matters", "The card zone first", "Its certificate",
  "A preflight", "Before any work", "Tools and ports", "What to fix", "Settings from Vault", "Services in order",
  "A later change", "A health check",
  "The installer", "The preflight first", "Most lines pass", "One line fails", "Fixed", "Everything passes",
  "The release", "The bank's values", "Where doors listen", "Which callers", "For each caller", "Malika's shop",
  "Fraud, alerts, certificate", "Every answer checked", "Asked again", "A certificate's key", "Every value is there",
  "Every service healthy",
  "ecom's installer", "Its certificate request", "Signed", "ecom healthy too",
  "By evening", "No guess", "Bekzod tests the same",
  "Next: releases",
];

export const C36bOneInstallComposition = createEpisode({
  id: "c-36b-one-install",
  number: 39,
  part: 7,
  footer: "One install",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
