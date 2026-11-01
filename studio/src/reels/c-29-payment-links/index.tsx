import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "No website", "Orders in a messenger", "Agree on a price", "No website code", "Out of reach", "A link in a chat",
  "Still safe", "The real bank page", "A checked website", "Only for a while", "Its secret", "A paper bill",
  "Amount, what for", "Press and pay", "A payment link", "Admin or operator", "A live website", "Amount, how long",
  "An ordinary payment", "No API client", "No return address", "Everything else", "The website's limits",
  "The website's fee", "A one-time page token", "Only a fingerprint", "Shown once", "The chosen maximum",
  "The same bank page", "Closed as expired", "Watch the product", "Payment links", "Sell in a chat", "New link",
  "A live website", "Nothing can be made", "What, and the amount", "How many hours", "Longer: refused", "Create",
  "Your link is ready", "Shown only once", "Copied", "Paste it", "Waits for the buyer", "Only views", "The buyer",
  "Tap the link", "The same bank page", "Paid", "No back to the shop", "Shows paid", "Past its time", "Expired",
  "What it protects", "The same safe page", "Never the card", "No working links", "No back door", "Back to the bill",
  "A bill with a button", "Next: money back",
];

export const C29PaymentLinksComposition = createEpisode({
  id: "c-29-payment-links",
  number: 29,
  part: 6,
  footer: "Payment links",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
