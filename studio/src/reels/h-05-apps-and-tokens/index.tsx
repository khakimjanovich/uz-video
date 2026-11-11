import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "A debug log", "Tokens in the log", "Sent to the mobile bank", "Real and signed", "Why refused?",
  "Lesson 4", "Apps kept apart",
  "The realm", "One space", "One realm, one bank", "One client per app",
  "Two names", "aud: audience", "azp: authorised party", "Same app", "Marketplace only",
  "The rule", "Own tokens only", "Refused", "E-APP-02", "Nothing but the marketplace",
  "heeyID's door", "Request guard", "aud and azp", "Device binding", "Why not a header?", "Anyone writes headers", "Wants to be vs is", "App = verified token",
  "No token yet", "App id of the build",
  "Deeper", "Each row: its app", "The query filter", "A bug cannot cross", "Cache and events", "Sharing: customer answers",
  "The leak again", "What do they get?", "Marketplace, short time", "Short life", "Refresh rotated", "Bound to the device", "An incident, not a theft",
  "How do we know?", "Each release", "Release stops",
  "New apps", "One more client", "Own required level", "Level 2 or level 1",
  "Recap", "Two names", "Door and queries", "Leak contained",
  "The values", "Who sets them?", "Next: configuration",
];

export const H05AppsAndTokensComposition = createEpisode({
  course: HEEYID,
  id: "h-05-apps-and-tokens",
  number: 5,
  part: 2,
  footer: "Each app, its own tokens",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
});
