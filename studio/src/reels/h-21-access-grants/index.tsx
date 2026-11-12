import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Sunday breakfast", "Lunch, night", "No password", "What lets him in?",
  "Lesson 16: the money phone", "Between two logins",
  "Access grant", "One app, one device", "Level 1 first", "Each login",
  "Two jobs", "Gateway decides", "The checks", "Keycloak issues", "Gateway only", "A signed note", "Three things", "Short, one use", "Two tokens",
  "Knows no rules", "Rules in the gateway",
  "The token", "Its app, two times", "The mobile bank", "Own tokens only", "Different app", "Signed, not a header",
  "Session level", "Level 2 rule", "Level 1", "MyID: new token", "At once", "Money phone", "Read from the token",
  "Breakfast", "Short token", "Nothing asked", "Refresh token", "Renewal", "Same device, same app", "Binding check",
  "Ended grants", "Fresh tokens", "Used up",
  "No password", "Not a login", "Lock: grant goes on",
  "Inactivity", "App PIN", "Grant goes on", "Policies",
  "How a grant ends", "Lifetime", "Block: lesson 19", "Next request", "Binding mismatch", "Closure",
  "Grant ended", "Log in again",
  "A check", "At lunch?", "The app PIN",
  "Decide, issue", "App and level", "Renewal", "Next request",
  "Lesson 18: log in again",
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
