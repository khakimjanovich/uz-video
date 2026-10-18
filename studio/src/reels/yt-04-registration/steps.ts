import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 04: registration and email one-time codes.
// Code beats quote github.com/khakimjanovich/ecom at tag ep-04.
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["partner", "emailport", "emailsvc"], built: builtBefore(1) },
  { cue: 12, part: 1, current: ["partner", "admin"], built: builtBefore(1) },
];

const FLOW = { shop: [0, 1], partner: [1.5, 1], redis: [1.5, 2.2], mail: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { shop: [0, 1], partner: [2, 1] }, edges: [{ from: "shop", to: "partner", label: "any email" }], badges: { partner: "proves nothing" } },
  {
    cue: 4,
    layout: { ...FLOW },
    edges: [{ from: "shop", to: "partner" }, { from: "partner", to: "mail" }, { from: "partner", to: "redis", label: "otp-starter" }],
    packets: [{ from: "partner", to: "mail", label: "one-time code", delay: 20 }],
    accent: ["redis"],
  },
  {
    cue: 8,
    layout: { attacker: [0, 1], partner: [2, 1] },
    edges: [{ from: "attacker", to: "partner" }],
    packets: [0, 1, 2].map((k) => ({ from: "attacker" as const, to: "partner" as const, label: "wrong code", delay: 8 + k * 16, duration: 18, stopAt: 0.85 })),
    danger: ["attacker"],
    badges: { partner: "locked after max-attempts" },
  },
  {
    cue: 9,
    layout: { attacker: [0, 1], partner: [1.5, 1], mail: [3, 1] },
    edges: [{ from: "attacker", to: "partner", label: "resend" }, { from: "partner", to: "mail", broken: true }],
    packets: [{ from: "partner", to: "mail", label: "code", delay: 20, stopAt: 0.5 }],
    danger: ["attacker"],
    badges: { partner: "max-sends per window" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "platform/openapi/partner-api/…/partner-v1.yaml",
    lines: [
      "/api/v1/registrations:",
      "  post: register          # 201 · 400 · 409",
      "",
      "/api/v1/registrations/email-verification:",
      "  post: verifyEmail       # 200 · 400 · 409 · 429",
      "",
      "/api/v1/registrations/email-verification/resend:",
      "  post: resendCode        # 202 · 409 · 429",
      "",
      "EmailVerificationRequest:",
      '  code: { type: string, pattern: "^[0-9]{6}$" }',
    ],
    highlight: [2, 5, 8],
  },
  {
    cue: 3,
    file: "modules/partner/…/service/impl/RegistrationServiceImpl.java",
    lines: [
      "public PartnerResponse register(RegistrationRequest req) {",
      "  if (partnerRepository.existsByEmail(req.getEmail())) {",
      "    throw new ApiException(HttpStatus.CONFLICT,",
      "        PartnerErrorCode.EMAIL_TAKEN, …);",
      "  }",
      "  var partner = partnerRepository.save(",
      "      Partner.register(req.getCompanyName(), req.getEmail()));",
      "  sendCode(partner.getEmail());",
      "  return partnerMapper.toResponse(partner);",
      "}",
    ],
    highlight: [2, 6, 7],
  },
  {
    cue: 5,
    file: "platform/otp-starter/…/OtpService.java",
    lines: [
      "public String issue(String flow, String subject) {",
      "  // … send counter, capped by max-sends per send-window",
      "  var code = randomDigits(properties.length());",
      "  redis.opsForValue().set(",
      "      key(flow, subject, KEY_CODE),",
      "      hash(code),          // SHA-256, never the code",
      "      properties.ttl());",
      "  return code;",
      "}",
    ],
    highlight: [6, 7],
  },
  {
    cue: 6,
    file: "modules/partner/…/service/impl/EmailNotificationService.java",
    lines: [
      "@Service",
      "public class EmailNotificationService",
      "    implements NotificationService {",
      "",
      "  public void sendOtp(String email, String code) {",
      "    var message = new SimpleMailMessage();",
      "    message.setTo(email);",
      "    message.setSubject(OTP_EMAIL_SUBJECT);",
      "    mailSender.send(message);",
      "  }",
      "}",
      "",
      "// Mailpit · localhost:8025",
      "// Your code is 766831. It expires in 5 minutes.",
    ],
    highlight: [2, 14],
  },
  {
    cue: 7,
    file: "modules/partner/…/service/impl/RegistrationServiceImpl.java",
    lines: [
      "public PartnerResponse verifyEmail(",
      "    EmailVerificationRequest req) {",
      "  var partner = findByEmail(req.getEmail());",
      "  otpService.verify(OTP_FLOW_REGISTRATION,",
      "      partner.getEmail(), req.getCode());",
      "  partner.verifyEmail();",
      "  return partnerMapper.toResponse(partner);",
      "}",
      "",
      "// 200 { \"emailVerified\": true }",
    ],
    highlight: [4, 6],
  },
  {
    cue: 10,
    file: "application/problem+json · one stable code per failure",
    lines: [
      '409  "code": "PARTNER_EMAIL_TAKEN"',
      '400  "code": "OTP_INVALID"',
      '410  "code": "OTP_EXPIRED"',
      '429  "code": "OTP_ATTEMPTS_EXCEEDED"',
      '429  "code": "OTP_SEND_LIMIT"',
      '409  "code": "PARTNER_EMAIL_ALREADY_VERIFIED"',
      "",
      "# application.yaml",
      "ecom.otp:",
      "  ttl: 5m",
      "  max-attempts: 5",
      "  max-sends: 3",
      "  send-window: 15m",
    ],
    highlight: [10, 11, 12, 13],
  },
  {
    cue: 11,
    file: "k6 · registration/register-and-verify.js",
    lines: [
      "✓ registered (201)",
      "✓ code arrived by email",
      "✓ email verified (200)",
      "",
      "http_req_duration{name:register} . p(95)=25.04ms",
      "http_req_duration{name:verify} ... p(95)=7.27ms",
      "iterations ....................... 4 931   164/s",
      "checks ........................... 100.00%",
    ],
    highlight: [7],
  },
];
