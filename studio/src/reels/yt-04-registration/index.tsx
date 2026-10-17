import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

export const Yt04RegistrationComposition = createEpisode({
  id: "yt-04-registration",
  number: 4,
  part: 1,
  footer: "Registration + email OTP",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: ["Whose email?", "Proves nothing", "Pending + code", "Code in Redis", "Mailpit inbox", "Verified", "Attempt limit", "Resend limit", "Clean errors", "Next: lifecycle"],
  map,
  diagram,
});
