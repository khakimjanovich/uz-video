import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Where may it live?", "Lesson 1: one place", "Lesson 3: three words", "This lesson: why one room", "An orders table", "Seems harmless", "The numbers spread", "A report", "A backup", "Every laptop",
  "Each must be checked", "One weak laptop",
  "One rulebook", "PCI DSS", "Stores, handles, sends", "Connected systems", "Network, logins, logs", "In the check",
  "A bigger check", "Less to check",
  "A coat check", "One locked room", "A ticket", "No coat", "Card numbers, same way", "The card token",
  "The card zone", "Its own parts", "Shares none", "Two doors", "Buyers' browsers", "Partner systems", "No door at all",
  "Watch the product", "How it behaves", "The payment page", "The first door", "Straight into the room",
  "Not on the way", "A token comes out", "The second door",
  "The running card zone", "Two doors answer", "Answers nobody", "Masked numbers only", "Tickets, never coats",
  "The honest part", "ecom still gets a check", "Card form and tickets", "Smaller, not none",
  "A building", "The bank's network", "Firewalls, guards", "Two narrow doors", "No certificate", "The bank's assessor",
  "What does it protect?", "Without the room", "No card number at all", "One small room",
  "The coat check", "Coats in one room", "We deliver the room", "Next: never see the card",
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
