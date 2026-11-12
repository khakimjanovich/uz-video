import { SubtitleCue } from "../../components";
import { HEEYID } from "../../series/heeyid/nodes";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word; it changes only when the beat does.
const TITLES = [
  "Sunday evening", "A phone number", "Nothing more", "Number to customer?", "Lesson 9: the contract", "The registration",
  "Continue", "The request", "Network address", "Three checks", "Mobile number", "App active", "Limits: lesson 11",
  "Registration record", "His language",
  "One-time code", "Random", "Not from the number", "Digest only", "Lifetime and resends", "Never the code",
  "Who sends the SMS?", "The app decides", "No TAF part", "TAF needs the phone", "Bank SMS service",
  "Code typed", "Compare", "Number verified", "No verdict", "Source: web",
  "One rule", "Nothing before verified", "Number not verified",
  "Look up the number", "A new person", "Password, two times", "Entries differ", "Again", "Password rules", "No symbol rules", "Kept: lesson 13",
  "Four things", "Level 1", "App account", "Browser device", "Session", "Onboarded", "Use it now",
  "Monday morning", "Another way", "Master app: TAF", "This phone, this SIM", "TAF down: bank SMS",
  "Verified again", "A known number", "Not a registration", "Account not shown", "Same password", "New-device login", "One person",
  "No password?", "Reset, not a new account", "Blocked: contact the bank",
  "One more case", "No waiting forever", "Expired", "Data deleted", "Start again",
  "Recap", "The number", "Record and digest", "TAF or bank SMS", "Customer or login",
  "Sunday again", "Anyone can type", "Codes all night?", "Next: codes and limits",
];

export const H10RegistrationComposition = createEpisode({
  course: HEEYID,
  id: "h-10-registration",
  number: 8,
  part: 3,
  footer: "Number, code, password, level 1",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  focus: true,
  keepLabels: true,
  hidePanelBefore: 4,
});
