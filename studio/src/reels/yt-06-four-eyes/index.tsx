import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt06FourEyesComposition = createEpisode({
  id: "yt-06-four-eyes",
  number: 6,
  part: 1,
  footer: "Four-eyes",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["One admin?", "One mistake", "A request", "The checker", "No self-approval", "Expiry", "Sweep + lock", "One pending", "Next: logins"],
  map,
  diagram,
});
