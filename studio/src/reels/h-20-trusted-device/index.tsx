import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "One phone", "Glass and a chip", "Whose phone?",
  "Lesson 19: linking", "This lesson: the device",
  "Registration day", "A record", "Random identifier", "Sent each time", "No hardware value", "Tells nothing",
  "The record", "Customer", "ID number, one-way", "Model and versions", "Times", "State",
  "One customer", "For life",
  "Level 1", "Known", "Known", "Not the person",
  "MyID", "Trusted", "Only MyID", "Only MyID",
  "App PIN", "First login", "Not usable yet", "Length: policy", "Easy PINs refused",
  "The PIN", "Stays on the phone", "Only the fact", "Phone checks it", "No proof", "Not the password",
  "My view", "Hand, not server",
  "The threat", "A stranger", "Copied tokens", "His own device",
  "Binding check", "Three questions", "Trusted or Known?", "Aziz's device?", "Same ID number?",
  "Fails", "Not Aziz's", "One no", "Grant ends", "Revoked", "Security event",
  "Revoked stays", "Never again", "New record", "Operator", "Next request", "Every request",
  "Recap", "Known", "Trusted", "Revoked",
  "What is checked?", "More than an id", "What does the app hold?", "Next: access grants",
];

export const H20TrustedDeviceComposition = createEpisode({
  course: HEEYID,
  id: "h-20-trusted-device",
  number: 20,
  part: 5,
  footer: "A record, a state, a check",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 4,
});
