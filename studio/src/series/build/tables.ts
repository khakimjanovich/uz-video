import { CodeStep } from "../../components";

// Every table as it exists on main (ecom, and the cards unit for bin and card), each column with the episode that explains it. A video shows a
// table whole: its own columns marked, columns from a later episode pointed at ("→ 16").
type Column = [name: string, type: string, episode: number];

export const TABLES: Record<string, Column[]> = {
  "partner.partner": [
    ["id", "uuid", 3], ["company_name", "varchar(255)", 3], ["email", "varchar(320)", 3], ["status", "varchar(32)", 3],
    ["created_at", "timestamptz", 3], ["email_verified_at", "timestamptz", 4], ["contract_number", "varchar(64)", 5],
    ["user_id", "varchar(64)", 7],
  ],
  "partner.partner_document": [
    ["id", "uuid", 5], ["partner_id", "uuid", 5], ["type", "varchar(32)", 5], ["status", "varchar(16)", 5],
    ["file_id", "uuid", 5], ["file_name", "varchar(200)", 5], ["content_type", "varchar(64)", 5], ["size", "bigint", 5],
    ["sha256", "varchar(64)", 5], ["description", "varchar(500)", 5], ["uploaded_by", "varchar(255)", 5],
    ["uploaded_at", "timestamptz", 5], ["reviewed_by", "varchar(255)", 5], ["reviewed_at", "timestamptz", 5],
    ["reject_reason", "varchar(500)", 5],
  ],
  "partner.activation_request": [
    ["id", "uuid", 6], ["partner_id", "uuid", 6], ["status", "varchar(16)", 6], ["requested_by", "varchar(64)", 6],
    ["decided_by", "varchar(64)", 6], ["reason", "varchar(500)", 6], ["created_at", "timestamptz", 6],
    ["expires_at", "timestamptz", 6], ["decided_at", "timestamptz", 6],
  ],
  "partner.sales_point": [
    ["id", "uuid", 8], ["partner_id", "uuid", 8], ["name", "varchar(100)", 8], ["website_url", "varchar(255)", 8],
    ["return_urls", "text[]", 8], ["status", "varchar(16)", 8], ["schemes", "text[]", 8],
    ["refund_extension_days", "int", 8], ["refund_extension_reason", "varchar(500)", 8], ["status_reason", "varchar(500)", 8], ["created_at", "timestamptz", 8],
    ["logo_file_id", "uuid", 8], ["logo_updated_at", "timestamptz", 8], ["webhook_url", "varchar(500)", 19],
    ["max_payment_amount", "bigint", 23], ["daily_limit", "bigint", 23],
  ],
  "commission.commission_rule": [
    ["id", "uuid", 10], ["partner_id", "uuid", 10], ["sales_point_id", "uuid", 10], ["scheme", "varchar(16)", 10],
    ["percent", "numeric(7,4)", 10], ["fixed_fee", "bigint", 10], ["min_fee", "bigint", 10], ["max_fee", "bigint", 10],
    ["valid_from", "timestamptz", 10], ["valid_to", "timestamptz", 10], ["status", "varchar(16)", 10],
    ["proposed_by", "varchar(64)", 10], ["approved_by", "varchar(64)", 10], ["created_at", "timestamptz", 10],
    ["change_request_id", "uuid", 10],
  ],
  "epos.epos": [
    ["id", "uuid", 11], ["sales_point_id", "uuid", 11], ["scheme", "varchar(16)", 11], ["merchant_id", "varchar(30)", 11],
    ["terminal_id", "varchar(30)", 11], ["status", "varchar(16)", 11], ["registered_by", "varchar(64)", 11],
    ["created_at", "timestamptz", 11],
  ],
  "bin.bin_range": [
    ["prefix", "varchar(11)", 13], ["scheme", "varchar(16)", 13], ["issuer", "varchar(16)", 13],
    ["synced_at", "timestamptz", 13], ["manual", "boolean", 13],
  ],
  "card.card": [
    ["id", "uuid", 13], ["token", "varchar(40)", 13], ["scheme", "varchar(16)", 13], ["masked_number", "varchar(19)", 13],
    ["number_index", "varchar(64)", 13], ["number_encrypted", "text", 13], ["expiry_encrypted", "text", 13],
    ["processor_token_encrypted", "text", 13], ["status", "varchar(16)", 13], ["created_at", "timestamptz", 13],
    ["bound_at", "timestamptz", 13],
  ],
  "payment.payment": [
    ["id", "uuid", 14], ["partner_id", "uuid", 14], ["sales_point_id", "uuid", 14], ["client_id", "varchar(64)", 14],
    ["order_id", "varchar(64)", 14], ["amount", "bigint", 14], ["description", "varchar(255)", 14],
    ["return_url", "varchar(2048)", 14], ["status", "varchar(16)", 14], ["page_token_hash", "varchar(64)", 14],
    ["page_expires_at", "timestamptz", 14], ["created_at", "timestamptz", 14], ["card_entry_sessions", "int", 15],
    ["card_entry_session_id", "uuid", 15], ["card_entry_frame_url", "varchar(512)", 15],
    ["card_entry_expires_at", "timestamptz", 15], ["card_token", "varchar(64)", 15], ["card_mask", "varchar(19)", 15],
    ["card_scheme", "varchar(16)", 15], ["card_bank", "varchar(255)", 15], ["failure_code", "varchar(64)", 15],
    ["merchant_id", "varchar(30)", 16], ["terminal_id", "varchar(30)", 16],
    ["commission_rule_id", "uuid", 16], ["fee", "bigint", 16], ["net", "bigint", 16], ["processor_ref", "varchar(64)", 16],
    ["rrn", "varchar(32)", 16], ["decline_code", "varchar(64)", 16], ["paid_at", "timestamptz", 16],
    ["source", "varchar(8)", 20], ["returned_at", "timestamptz", 21], ["test_mode", "boolean", 14],
    ["disputed", "boolean", 26], ["payer_sms_due", "boolean", 18],
  ],
  "payment.payment_audit": [
    ["id", "uuid", 18], ["payment_id", "uuid", 18], ["action", "varchar(32)", 18], ["actor", "varchar(64)", 18],
    ["note", "varchar(500)", 18], ["scheme_reference", "varchar(64)", 18], ["dispute_id", "uuid", 26],
    ["state_before", "varchar(24)", 18], ["state_after", "varchar(24)", 18], ["occurred_at", "timestamptz", 18],
  ],
  "payment.payment_operation": [
    ["id", "uuid", 16], ["payment_id", "uuid", 16], ["kind", "varchar(16)", 16], ["status", "varchar(16)", 16],
    ["merchant_id", "varchar(30)", 16], ["terminal_id", "varchar(30)", 16], ["amount", "bigint", 16],
    ["processor_ref", "varchar(64)", 16], ["rrn", "varchar(32)", 16], ["decline_code", "varchar(64)", 16],
    ["reason", "varchar(200)", 21], ["started_at", "timestamptz", 16], ["finished_at", "timestamptz", 16],
  ],
  "payment.payment_event": [
    ["id", "uuid", 19], ["seq", "bigint", 19], ["payment_id", "uuid", 19], ["type", "varchar(32)", 19], ["payload", "text", 19],
    ["created_at", "timestamptz", 19], ["published_at", "timestamptz", 19], ["traceparent", "varchar(55)", 19],
  ],
  "payment.webhook_delivery": [
    ["id", "uuid", 19], ["event_id", "uuid", 19], ["payment_id", "uuid", 19], ["url", "varchar(2048)", 19],
    ["attempt", "int", 19], ["http_status", "int", 19], ["error", "varchar(512)", 19], ["due_at", "timestamptz", 19],
    ["retry_from", "timestamptz", 19], ["attempted_at", "timestamptz", 19], ["undelivered", "boolean", 19],
  ],
  "payment.daily_report": [
    ["business_day", "date", 22], ["sales_point_id", "uuid", 22], ["partner_id", "uuid", 22], ["paid_count", "int", 22],
    ["paid_amount", "bigint", 22], ["fee", "bigint", 22], ["net", "bigint", 22], ["refunded_count", "int", 22],
    ["refunded_amount", "bigint", 22], ["refunded_fee", "bigint", 22], ["payout", "bigint", 22], ["built_at", "timestamptz", 22],
  ],
  "payment.daily_volume": [["sales_point_id", "uuid", 23], ["business_day", "date", 23], ["amount", "bigint", 23]],
};

/**
 * One table, whole, as a code beat for episode {@code episode}: its columns marked, earlier ones
 * plain, later ones pointing at the episode that explains them.
 */
export function tableStep(cue: number, table: string, episode: number): CodeStep {
  const columns = TABLES[table];
  const nameWidth = Math.max(...columns.map(([name]) => name.length)) + 1;
  const typeWidth = Math.max(...columns.map(([, type]) => type.length)) + 1;
  const lines = columns.map(([name, type, from]) =>
    `${name.padEnd(nameWidth)}${type.padEnd(typeWidth)}${from > episode ? `→ ${from}` : ""}`.trimEnd(),
  );
  return {
    cue,
    file: `database · ${table}`,
    lines,
    highlight: columns.flatMap(([, , from], i) => (from === episode ? [i + 1] : [])),
    columns: columns.length > 16 ? 2 : undefined,
  };
}
