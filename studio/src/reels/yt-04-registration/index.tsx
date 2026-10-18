import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { code, diagram, map } from "./steps";

export const Yt04RegistrationComposition = createEpisode({
  id: "yt-04-registration",
  number: 4,
  part: 1,
  footer: "Registration + email OTP",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Whose email?", "Proves nothing", "The contract", "Pending", "OTP starter", "Only a hash", "Mailpit inbox", "Verified", "Attempt limit", "Send limit", "Stable codes", "Under load", "Next: lifecycle"],
  map,
  diagram,
  code,
});
