import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt15HostedPageComposition = createEpisode({
  id: "yt-15-hosted-page",
  number: 15,
  part: 4,
  footer: "Hosted page: card → OTP",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Whose page?", "Shops with cards", "The bank page", "Hashed session", "Token at once", "One-time code", "One at a time", "Attempt limits", "Next: the debit"],
  map,
  diagram,
});
