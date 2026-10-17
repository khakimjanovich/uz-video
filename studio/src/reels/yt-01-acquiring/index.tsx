import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt01AcquiringComposition = createEpisode({
  id: "yt-01-acquiring",
  number: 1,
  part: 0,
  footer: "Acquiring in 5 minutes",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Card payments?", "Five players", "Acquirer + issuer", "MID + TID", "Authorization", "Hold", "Capture", "Reversal + refund", "Settlement", "Commission + T+1", "Your vocabulary"],
  map,
  diagram,
});
