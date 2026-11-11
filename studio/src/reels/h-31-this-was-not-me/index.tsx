import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence).
const TITLES = [
  "11 p.m.", "A buzz", "A login request", "Two buttons", "This was not me", "One tap", "Now what?",
  "Lesson 30", "The other try",
  "How it arrived", "Number and password", "Password first", "Code to the SIM", "Aziz's session", "Rank 2",
  "No code in the push", "Code and approval",
  "Aziz refuses", "Step 1", "Refused",
  "What it means", "Password first", "Password known", "SIM held?", "Every code at risk",
  "Step 2: hold", "No code logins", "No SMS", "Push only", "Web too", "Aziz still in",
  "Step 3", "New password now", "Old, then new", "Same or lower end", "Every other session",
  "Step 4", "SIM still works?", "Yes", "Hold ends", "No", "The number goes", "MyID re-check", "Removed",
  "Never blocked", "The trail", "Number on hold",
  "Why a hold?", "My view", "Wrong taps", "Only login gone", "Easy to undo", "The SIM decides",
  "The price", "No SMS alerts", "No session", "Operator ends it",
  "One more detail", "Only rank 2", "Rank 1: notice", "Why",
  "Recap", "On hold", "New password", "The SIM question",
  "Aziz said no", "A free number", "A new holder", "Next: numbers change",
];

export const H31ThisWasNotMeComposition = createEpisode({
  course: HEEYID,
  id: "h-31-this-was-not-me",
  number: 31,
  part: 7,
  footer: "Hold, then ask",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
