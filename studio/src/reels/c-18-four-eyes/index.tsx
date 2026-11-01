import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Monday, 4 p.m.", "Start tonight?", "She cannot switch it on", "Not alone",
  "Lesson 17: verified",
  "Rushed or bribed", "Stolen cards", "No such button",
  "Request activation", "She clicks it", "Activation requested", "The maker", "Nothing changes yet", "Exactly where it was",
  "Approvals", "Who, and when it expires", "Approve and Reject grey", "You made this request", "Never their own request", "The server refuses",
  "Ten minutes later", "Buttons are live", "The checker", "One click on Approve", "Now active",
  "Documents checked again", "A request expires", "Months later? No",
  "The history", "Dilnoza asked",
  "Four eyes", "Not merchants only", "Other kinds", "Two people", "Proposes, decides", "The same screen",
  "Red tape?", "The opposite", "One mistake, one bribe", "With two, it is not", "Both names",
  "Half past four",
  "Next: server login",
];

export const C18FourEyesComposition = createEpisode({
  id: "c-18-four-eyes",
  number: 18,
  part: 4,
  footer: "Four eyes",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
