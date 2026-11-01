import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Without the secret key", "The wrong way", "Emails it across", "Another product's inbox", "Pretend to be the caller",
  "Never cross", "A passport office", "An application", "Checks and stamps", "Only the photo", "The caller does the same",
  "Its own Vault", "The key stays", "An application form", "The public half", "Signing request", "Sends only that",
  "The passport office", "Certificate authority", "Checks the form", "Well made?", "The right name?", "On the list?",
  "Signs it", "Calling in only", "One folder", "Four things", "The signed certificate", "The office's seal",
  "A login secret", "The addresses", "Checks the folder", "Stores it in Vault", "Deletes the secret file",
  "Two proofs", "No private key crosses", "A warning", "Watch it happen", "Two operators", "One small form",
  "Only that form", "Signs it", "A clear refusal", "A folder appears", "Carries it back", "A secure channel",
  "Reads the folder", "Removes the secret file", "The first call", "Its end date", "Retires on time", "Nobody woken",
  "What it protects", "Another's secret", "Expose both", "Its own key", "Who, how long", "Never touches",
  "Sharing nothing", "One owner, one signer", "Back to the passport", "A stamped photo", "The face never does",
  "Next: stolen cards",
];

export const C12bCertificateExchangeComposition = createEpisode({
  id: "c-12b-certificate-exchange",
  number: "12b",
  part: 2,
  footer: "Certificate exchange",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
