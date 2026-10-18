import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt06FourEyesComposition = createEpisode({
  id: "yt-06-four-eyes",
  number: 6,
  part: 1,
  footer: "Four-eyes",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["One admin?", "One mistake", "A request", "New calls", "The checker", "Decided once", "No self-approval", "Who approved", "Configured expiry", "Sweep + lock", "One pending", "Tests", "Under load", "Next: logins"],
  map,
  diagram,
  code,
});
