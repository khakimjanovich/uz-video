import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Learn it is paid", "Lesson 29: the outbox", "Lesson 24: signed", "This lesson: the other way", "Before shipping", "Down for an hour", "Real or forged", "Anyone can say paid",
  "A danger for the bank", "Inside the bank's network", "A registered letter", "Sealed", "A real street address",
  "Comes back later", "Returned", "A webhook", "The webhook address", "Set by the merchant", "Webhook signature",
  "The same signing key", "An open standard", "Seal, age, id", "Check the address", "A secure address",
  "Public internet only", "Checked again", "No redirects", "Request forgery", "Success", "Tried again", "In order",
  "Undelivered", "Ask for it again", "Payment links", "Watch the product", "Open a payment", "Webhooks",
  "Type and status", "Delivered", "Server offline", "Retrying", "Waiting for an earlier", "No button yet",
  "Undelivered", "Fix it, send again", "Send again", "Queued", "Delivered", "No webhook was sent",
  "What it protects", "A forged paid", "An outage", "Refunded before paid", "The bank's own network",
  "Back to the letter", "Tried until it arrives", "Next: no website",
];

export const C28bWebhooksComposition = createEpisode({
  id: "c-28b-webhooks",
  number: 30,
  part: 5,
  footer: "Webhooks",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
