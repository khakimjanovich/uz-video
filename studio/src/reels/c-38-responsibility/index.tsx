import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Wednesday, 9 a.m.", "The card zone's guide", "An assessor",
  "Lesson 4: the room", "Lesson 40: releases", "This lesson: the building",
  "Compliant", "What they ask for", "None of them", "The whole building", "Fell between", "A warning sign", "Not on its own",
  "The locked room", "The building", "Fits the building", "Two narrow doors", "Nothing else listens", "Never from outside",
  "Shares no part", "The bank's firewalls",
  "A guide", "Three things", "The responsibility matrix", "Twelve requirements", "Not a claim", "The network", "The logs",
  "ecom's own matrix", "The assessor's call",
  "Every release", "Met, partly, a gap", "The known gaps", "Three within reach",
  "Two people", "One asks, one decides", "Dilnoza asks", "Three of five",
  "Who does what", "Twelve rows", "Network, then logging", "The known gaps", "Each line", "The whole building", "Nothing hidden",
  "Not certified alone", "The guide as evidence",
  "Back to Lesson 1", "Friday evening", "Malika's payout", "We deliver the room", "Thank you",
];

export const C38ResponsibilityComposition = createEpisode({
  id: "c-38-responsibility",
  number: 41,
  part: 7,
  footer: "Room and building",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
});
