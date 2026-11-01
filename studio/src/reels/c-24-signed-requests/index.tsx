import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Really from the merchant?", "Create a payment", "A token", "Who you are", "Who you are", "Tokens leak",
  "Tokens leak", "A second danger", "A second danger", "Not enough", "A wax seal", "Your own ring", "A broken seal",
  "A date", "A serial number", "Every request", "Request signature", "The method", "The full address", "The token",
  "A fingerprint", "Time and a number", "A signing key", "Only two parties", "The key safe", "Read, never change",
  "A fixed order", "Fresh", "Matches its fingerprint", "The right client", "Seal again, compare", "Spend the number",
  "The nonce", "Spent after the seal", "One more rule", "Its own website", "The merchant's server",
  "Builds the body", "Seals and sends", "Answer at once", "Payment created", "Waiting for the buyer",
  "The same request", "Refused", "Already used", "A changed amount", "Body no longer matches", "Sealed long ago",
  "No longer fresh", "List stays the same", "Nothing new", "What it protects", "A blank cheque",
  "The merchant's name", "A copy machine", "Every number", "Against copies", "The key itself", "Back to the letter",
  "Yours, unopened", "Fresh", "The only one", "Nobody can forge it", "Next: twice on purpose",
];

export const C24SignedRequestsComposition = createEpisode({
  id: "c-24-signed-requests",
  number: 24,
  part: 6,
  footer: "Signed requests",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
