import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Monday, 07:00", "Logged out", "Bus pass", "No session", "In which order?",
  "Lesson 22: step-up", "This lesson: the login",
  "When a login?", "Logout or failed renewal", "Valid: renewal", "Real login",
  "Number and password", "With the device", "Password first", "The digest", "Unknown number", "Same answer",
  "No customer list", "Wrong password", "Count and events", "Lock", "Not a block", "No session ends", "Right",
  "Why first?", "My view", "A code costs", "Codes all night", "Code after password", "Number only: nothing",
  "The code", "Through TAF", "SMS to the number", "Login, device model", "TAF down", "Not scored",
  "The verdict", "Green", "Red", "Yellow", "Device and SIM", "Mobile network", "Green",
  "Level 2: one more", "Phone's face check", "Not MyID", "Fails: stop", "Face confirmation", "Number stays", "TAF silent",
  "The grant", "Keycloak", "Level 2", "No MyID", "Trusted phone", "Except Yellow", "Events",
  "Bus pass", "Quick",
  "Recap", "Password first", "Code: the SIM", "Verdict", "Phone's face", "New grant",
  "A known phone", "A new phone?", "Next: new device",
];

export const H23KnownDeviceLoginComposition = createEpisode({
  course: HEEYID,
  id: "h-23-known-device-login",
  number: 23,
  part: 5,
  footer: "Password, then code",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 5,
});
