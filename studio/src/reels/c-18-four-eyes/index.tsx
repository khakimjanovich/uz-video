import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice.
const TITLES = [
  "Never alone", "Lesson 17: verified", "The last step", "This lesson: two people", "Rushed or bribed", "Stolen cards", "Two signatures",
  "The same way", "Four eyes", "How it works", "No such button",
  "The maker", "The person who asks", "Nothing changes yet", "Exactly where it was",
  "The checker", "Agrees or refuses", "Only then active", "Never their own request",
  "The server refuses", "A request expires", "Months later? No", "Documents checked again",
  "Both people named", "Not merchants only", "The whole product", "Two people",
  "A new fee rule", "Refund windows, refunds", "Proposes, decides", "The same screen",
  "Watch the product", "The approved merchant", "Request activation", "One click",
  "Activation requested", "Approvals", "Who, and when it expires", "Approve and Reject grey",
  "You made this request", "Not the maker", "A second admin", "Buttons are live",
  "Approve", "Now active", "The history", "Both people named",
  "Other kinds of request", "What does this protect?", "One mistake, one bribe", "With two, it is not",
  "Protects buyers", "Protects the bank", "Protects the admins", "Like a cheque",
  "Next: server login",
];

export const C18FourEyesComposition = createEpisode({
  id: "c-18-four-eyes",
  number: 18,
  part: 4,
  footer: "Two signatures",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
