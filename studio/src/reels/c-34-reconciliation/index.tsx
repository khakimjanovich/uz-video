import { SubtitleCue } from "../../components";
import { createEpisode } from "../../utils/createEpisode";
import subtitlesJson from "./subtitles.json";
import { diagram, map, screens } from "./steps";

// One headline per cue (sentence): the beat's key word, said by the voice; it changes only when the beat does.
const TITLES = [
  "Wednesday morning", "The bank is short", "Which payment?", "Timed out, but booked", "Reversed overnight",
  "Both look fine", "Lessons 1 and 34", "Two sides, line by line", "Every day", "Reconciliation", "Our side",
  "Their side", "The report, masked", "ecom matches", "Paired lines", "Four checks", "The day's totals", "A break",
  "Disagree or missing", "Unknown at close", "Once it is found?", "One exception", "What matters most",
  "No owner, no fix", "A person works it", "Resolve with evidence", "Ask to write off", "A write-off",
  "Someone else decides", "Written down", "Reconciliation page", "Pick a day", "Run it again", "The run finishes",
  "Totals differ", "Items and states", "Amount differs", "Side by side", "Exceptions", "Owner and due date",
  "Overdue", "Take it", "A note", "Ask to write off", "A second admin decides", "No approve button",
  "Asked, not approved", "The second admin", "Approved", "Written off", "The audit trail", "Weeks apart",
  "Found on Wednesday", "Nothing lost", "Recap", "Who decides?", "A second admin", "Next: limits",
];

export const C34ReconciliationComposition = createEpisode({
  id: "c-34-reconciliation",
  number: 36,
  part: 6,
  footer: "Reconciliation",
  subtitles: subtitlesJson as SubtitleCue[],
  titles: TITLES,
  map,
  diagram,
  screens,
  focus: true,
  hidePanelBefore: 57, // no course panel during the story; it returns on the last beat
});
