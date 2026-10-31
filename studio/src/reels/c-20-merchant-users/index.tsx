import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Everyone, everything?", "Each their own badge", "The merchant's team", "Four roles", "An admin invites",
  "Password and phone", "Least privilege", "Blocked at once", "Never the last admin",
  "Next: websites",
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
});
