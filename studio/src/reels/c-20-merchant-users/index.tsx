import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Early March", "Flowers for the 8th", "A helper for the week", "Lessons 16 and 19",
  "Share one login?", "The costly shortcut", "A refund to a friend", "Change for everyone",
  "Malika opens Users", "Exactly one role", "There are four", "The admin", "The accountant", "The operator", "The observer",
  "Invite a user", "Operator", "Invitation sent", "Never their password", "The helper's inbox",
  "Authenticator app", "Money can go back", "They sign in", "Payments", "No Users item", "Not offered",
  "Roles per action", "Least privilege", "A stolen login", "The Accountant role", "Signed out at once",
  "The ninth of March", "Block the helper", "Asked first", "Still names the helper",
  "Block herself?", "The only admin", "Block stays grey", "Never locked out",
  "A login each", "The same minute", "Next: second website",
];

export const C20MerchantUsersComposition = createEpisode({
  id: "c-20-merchant-users",
  number: 20,
  part: 4,
  footer: "One login each",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
