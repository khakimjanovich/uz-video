import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Breakfast", "Lunch, night", "No password", "What lets him in?",
  "Lesson 20: the device", "This lesson: the grant",
  "Access grant", "One app, one device", "Level 1 first", "Each login",
  "Two jobs", "Gateway decides", "The checks", "Keycloak issues", "A signed note", "Three things", "Short, one use", "Two tokens",
  "My view", "Tokens only", "Rules in the gateway",
  "The token", "Its own app", "Lesson 5", "Session level", "Level 2 rule", "Level 1", "MyID: new token", "At once", "Read the level",
  "Breakfast", "Short token", "Nothing asked", "Refresh token", "Renewal", "Same device, same app", "Binding check",
  "Revocation list", "Every call", "Fresh tokens", "Used up", "Reuse seen",
  "No password", "Not a login", "Continues",
  "One more limit", "App PIN", "Grant continues", "Unlock only", "Policies",
  "How a grant ends", "The tablet", "Lost", "Revoked", "Next request", "Refused", "No renewal", "Other ends",
  "Grant ended", "Try renewal", "Log in again",
  "Recap", "Decide, issue", "App and level", "Renewal", "Revocation",
  "The marketplace", "Level 1", "Refuse?", "Too low?", "Next: step-up",
];

export const H21AccessGrantsComposition = createEpisode({
  course: HEEYID,
  id: "h-21-access-grants",
  number: 17,
  part: 5,
  footer: "Gateway decides, Keycloak issues",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 4,
});
