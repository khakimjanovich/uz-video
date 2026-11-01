import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Friday, 11 p.m.", "A call", "I am ecom", "Anyone can type it", "Proves nothing", "Lesson 6: keys from Vault", "This lesson: proof",
  "Timur's morning", "An ID card", "A day pass", "Two proofs",
  "A certificate", "Shows its certificate", "Shows one back", "Each side knows", "Mutual TLS", "Refused unread",
  "An access token", "Its own login server", "Trusts only that one", "Worth nothing here",
  "Who, and its roles", "A role is a floor", "Bind a card", "Read a card", "Charge a card", "A role each",
  "Only what roles allow", "No admin role",
  "One proof?", "Never enough",
  "Timur's log", "No certificate", "Closed at once", "Nothing answered",
  "The wrong login server", "Unauthorized", "Counts for nothing",
  "The real ecom", "Charge by token", "Goes through", "An admin operation", "Both proofs pass", "Forbidden",
  "Three refusals", "No connection", "Unauthorized", "Forbidden", "Which check stopped it",
  "Its own pass office", "Not shared with ecom",
  "Only the certificate", "Only the pass", "Steal both", "Only the card zone grants",
  "Saturday's log", "Next: card networks",
];

export const C07IdentityComposition = createEpisode({
  id: "c-07-identity",
  number: 7,
  part: 2,
  footer: "Two proofs",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
