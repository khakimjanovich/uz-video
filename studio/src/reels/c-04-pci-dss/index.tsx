import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Bekzod's idea", "Just in case", "Lesson 3: one place", "This lesson: why one room", "Seems harmless", "The numbers spread", "A report", "A backup", "Bekzod's laptop",
  "Each must be checked", "One lost laptop",
  "One rulebook", "PCI DSS", "Stores, handles, sends", "Connected systems", "Network, logins, logs", "In the check", "A bigger check",
  "Pass a big check?", "Shrink the check", "One locked room", "A card token instead",
  "Timur's card zone", "Its own parts", "Shares none", "Two doors", "Buyers' browsers", "Partner systems", "No door at all",
  "Follow one payment", "Malika's roses", "The first door", "Straight into the room", "Not on the way", "A token comes out", "The second door",
  "The running card zone", "Two doors answer", "Answers nobody", "Masked numbers only", "Tokens, never numbers",
  "The honest part", "ecom still gets a check", "Card form and tokens", "Smaller, not none",
  "A building", "The bank's network", "Firewalls, guards", "Two narrow doors", "No certificate", "The bank's assessor",
  "No card number leaks", "One small room",
  "Bekzod drops it", "The payment, not the card", "The bank owns the building", "Next: never see the card",
];

export const C04PciDssComposition = createEpisode({
  id: "c-04-pci-dss",
  number: 4,
  part: 2,
  footer: "PCI DSS scope",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
});
