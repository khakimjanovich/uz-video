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
  titles: ["Whose email?", "Proves nothing", "The contract", "Pending", "OTP library", "Only hashes", "Mailpit inbox", "Verified", "Window lockout", "Send limit", "Retry-After", "Fail closed", "Stable codes", "Library defaults", "Next: lifecycle"],
  map,
  diagram,
  code,
});
