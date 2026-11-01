import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Really from ecom?", "I am ecom", "Anyone can type it", "Proves nothing",
  "The staff entrance", "An ID card", "A day pass", "Only those floors", "Two proofs",
  "A certificate", "Shows its certificate", "Shows one back", "Each side knows", "Mutual TLS", "Refused unread",
  "An access token", "A day pass", "Its own login server", "Trusts only that one", "Worth nothing here",
  "Who, and its roles", "A role is a floor", "Bind a card", "Read a card", "Charge a card", "A role each",
  "Only what roles allow", "No admin role",
  "Watch the product", "How it behaves", "No certificate", "Closed at once", "Nothing answered",
  "The wrong login server", "Unauthorized", "Counts for nothing",
  "The real ecom", "Charge by token", "Goes through", "An admin operation", "Both proofs pass", "Forbidden",
  "Three refusals", "No connection", "Unauthorized", "Forbidden", "Which check stopped it",
  "Its own pass office", "Not shared with ecom",
  "What does it protect?", "Only the certificate", "Only the pass", "Steal both", "Only the card zone grants",
  "Every card in the room",
  "The staff entrance", "Only your floors", "Next: card networks",
];

export const C07IdentityComposition = createEpisode({
  id: "c-07-identity",
  number: 7,
  part: 1,
  footer: "Two proofs",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
