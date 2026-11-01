import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Everyone, everything?", "One portal login", "A refund to a friend", "Change for everyone",
  "Their own badge", "Only the doors needed", "A merchant's team", "How it works",
  "Four merchant roles", "The admin", "The accountant", "The operator",
  "The observer", "Invites by email", "Never their password", "Authenticator app",
  "Roles per action", "Least privilege", "Signed out at once", "Blocking",
  "History stays", "The last admin", "Name a new admin", "Never locked out",
  "Watch the product", "Users", "Exactly one role", "Invite a user",
  "Operator", "Invitation sent", "The new person's inbox", "A link",
  "Own password, own app", "They sign in", "Payments", "No Users item",
  "Not offered", "Back as the admin", "Change a role", "Block",
  "Signed out at once", "The only admin", "Block stays grey", "What does this protect?",
  "Who did what", "A badge each", "Least privilege", "Blocked at once",
  "The last-admin rule", "Like staff badges", "Next: websites",
];

export const C20MerchantUsersComposition = createEpisode({
  id: "c-20-merchant-users",
  number: 20,
  part: 4,
  footer: "Staff badges",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
