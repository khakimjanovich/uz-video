import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Friday afternoon", "A private key", "Email it?", "Never", "Lesson 12: the mail slot", "This lesson: the certificate",
  "That email", "Another product's inbox", "Pretend to be the caller", "A key that travelled", "A passport application", "Only the photo",
  "Its own Vault", "The key stays", "An application form", "The public half", "Signing request", "The only thing sent",
  "Certificate authority", "Checks the form", "Well made?", "The right name?", "On the list?", "Signs it", "Calling in only",
  "One folder", "The certificate", "The authority's seal", "A login secret", "The addresses",
  "Stored in Vault", "Deletes the file", "Two proofs", "Watched",
  "That Friday", "One small form", "Only that form", "Timur signs", "A clear refusal", "A folder for ecom",
  "Carried back", "Separately", "Reads the folder", "Into ecom's Vault", "The first call",
  "Months later", "Retires on time", "Nobody woken",
  "Its own key", "No cross leak", "Who may call", "Never touched", "One owner, one signer", "Next: stolen cards",
];

export const C12bCertificateExchangeComposition = createEpisode({
  id: "c-12b-certificate-exchange",
  number: 13,
  part: 3,
  footer: "Certificate exchange",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
