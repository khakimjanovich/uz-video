import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Tuesday, 13:10", "Three apps", "Two devices", "How many identities?",
  "Lesson 1: the map", "This lesson: the customer",
  "The first model", "A customer per app", "Aziz #1", "Aziz #2", "Aziz #3", "Password and level", "Level 2 here",
  "Level 1 there", "A strange login", "End one app", "Not possible", "Three passwords",
  "One person", "One person", "The person record", "One phone number", "Login for every app", "One password",
  "No app passwords", "One level",
  "App accounts", "App account", "First login", "Three accounts",
  "Sessions", "Mobile bank: 1", "Marketplace: 2", "App and device", "Own app only", "Lesson 5",
  "The operator", "Three choices", "One session", "One app", "The person", "Level stays",
  "Check log", "SMS", "TAF", "MyID", "Provider, app, time", "How it knows",
  "Not every app", "Master app", "Moves money", "Side apps", "No face check", "Password first", "Approve or SMS",
  "No master app needed",
  "One installation", "One realm", "Second bank",
  "Recap", "Accounts and sessions", "Master app proves", "How many identities?", "One",
  "The laptop", "Level 1 session", "A session level", "What is a level?", "Next: identity words",
];

export const H02OneIdentityComposition = createEpisode({
  course: HEEYID,
  id: "h-02-one-identity",
  number: 2,
  part: 1,
  footer: "One person, every app",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 4,
});
