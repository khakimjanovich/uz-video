import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Saturday, 2 p.m.", "An hour of maintenance", "Six bouquets", "All six wait",
  "Lessons 29 and 24", "This lesson: the other way",
  "Every event, in order", "Real or forged", "A danger for the bank", "Inside the bank's network",
  "A webhook", "The webhook address", "Set by the merchant", "Webhook signature", "The same signing key", "An open standard", "Seal, age, id",
  "Check the address", "A secure address", "Public internet only", "Checked again", "No redirects", "Request forgery", "A way into the bank",
  "Success", "Tried again", "In order", "Undelivered", "Ask for it again", "Payment links",
  "That Saturday", "A normal day", "Webhooks", "Type and status", "Delivered", "The maintenance hour", "Retrying",
  "Waiting for an earlier", "No button yet", "Past the chosen time", "Undelivered", "Fix it, send again", "Send again",
  "Queued", "The bouquets ship", "One last case", "No webhook was sent",
  "No forged paid", "No news lost", "Refunded after paid", "The bank's own network", "Next: no website",
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
