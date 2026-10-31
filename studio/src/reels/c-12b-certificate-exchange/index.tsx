import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Without its secret key", "A passport", "Checks and stamps", "Only the photo",
  "A caller", "In its own Vault", "Signing request", "Certificate authority",
  "One folder", "Stored in its Vault", "No private key crosses", "Before it expires",
  "Next: stolen cards",
];

export const C12bCertificateExchangeComposition = createEpisode({
  id: "c-12b-certificate-exchange",
  number: "12b",
  part: 2,
  footer: "Certificates",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
