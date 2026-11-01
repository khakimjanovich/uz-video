import { ScreenBox } from "../../components/ScreenCard";

// Where things sit on this module's product screens (page pixels of the 1440 × 900 shots in screens/shots/c-0*.ts).
export const PAY = {
  title: "Payment page",
  cardTitle: "Payment page · Card details",
  top: [400, 30, 640, 400] as ScreenBox, // the bank's header, the order, the amount
  frame: [400, 250, 640, 400] as ScreenBox, // the card zone's frame
  status: [400, 150, 640, 400] as ScreenBox, // the card line and the result
  ended: [400, 290, 640, 400] as ScreenBox, // the ended-attempt note above a fresh frame
  header: [500, 38, 260, 30] as ScreenBox,
  amount: [532, 185, 140, 72] as ScreenBox,
  fields: [550, 340, 340, 212] as ScreenBox,
  frameBox: [539, 328, 362, 230] as ScreenBox,
  cardLine: [533, 288, 316, 28] as ScreenBox,
  taking: [550, 392, 340, 70] as ScreenBox,
  paid: [560, 340, 320, 150] as ScreenBox,
  note: [539, 328, 362, 78] as ScreenBox,
};

export const MERCHANT = {
  listTitle: "Merchant portal · Payments",
  list: [250, 75, 880, 550] as ScreenBox,
  paidRow: [262, 260, 868, 60] as ScreenBox,
  drawer: [820, 40, 620, 388] as ScreenBox,
  facts: [830, 118, 300, 44] as ScreenBox,
  calls: [830, 272, 600, 96] as ScreenBox,
  refund: [838, 176, 584, 68] as ScreenBox,
  giveBack: [1300, 190, 110, 40] as ScreenBox,
  dialog: [450, 260, 560, 350] as ScreenBox,
  rule: [510, 342, 414, 66] as ScreenBox,
  reportsTitle: "Merchant portal · Daily reports",
  reports: [250, 70, 980, 612] as ScreenBox,
  reportRow: [264, 205, 950, 64] as ScreenBox,
};

export const BANK = {
  title: "Bank admin portal · Payments",
  list: [540, 210, 640, 400] as ScreenBox, // amount, card and status columns
  cards: [770, 268, 165, 408] as ScreenBox,
  firstCard: [770, 280, 165, 42] as ScreenBox,
  reversed: [944, 352, 98, 32] as ScreenBox,
  refunded: [944, 521, 98, 32] as ScreenBox,
};
