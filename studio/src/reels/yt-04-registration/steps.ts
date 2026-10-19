import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 04: registration and email one-time codes.
// Code beats quote github.com/khakimjanovich/ecom (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["partner", "emailport", "emailsvc"], built: builtBefore(1) },
  { cue: 11, part: 1, current: ["partner", "admin"], built: builtBefore(1) },
];

const FLOW = { shop: [0, 1], partner: [1.5, 1], redis: [1.5, 2.2], mail: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { shop: [0, 1], partner: [2, 1] }, edges: [{ from: "shop", to: "partner", label: "any email" }], badges: { partner: "proves nothing" } },
  {
    cue: 4,
    layout: { ...FLOW },
    edges: [{ from: "shop", to: "partner" }, { from: "partner", to: "mail" }, { from: "partner", to: "redis", label: "otp library" }],
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
      "    throw new GeneralException(",
      "        PartnerExceptionStatus.PARTNER_EMAIL_TAKEN, req.getEmail());",
      "  }",
      "  var partner = partnerRepository.save(",
      "      Partner.register(req.getCompanyName(), req.getEmail(), …));",
      "  sendCode(partner.getEmail());",
      "  return partnerMapper.toResponse(partner);",
      "}",
    ],
    highlight: [2, 6, 7],
  },
  {
    cue: 5,
    file: "platform/otp/…/OtpService.java",
    lines: [
      "public String issue(String flow, String subject) {",
      "  var code = randomDigits(properties.length());",
      "  // One Lua script: count the send, then store the code.",
      "  var sends = redis.execute(ISSUE, keys(flow, subject, …),",
      "      String.valueOf(properties.maxSends()),",
      "      String.valueOf(properties.sendWindow().toMillis()),",
      "      hash(code),            // HMAC-SHA256, never the code",
      "      String.valueOf(properties.ttl().toMillis()));",
      "  if (sends == null || sends < 0)",
      "    throw new GeneralException(OtpExceptionStatus.OTP_SEND_LIMIT);",
      "  return code;",
      "}",
    ],
    highlight: [3, 7],
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
    file: "platform/otp/…/properties/otp-exception.yaml",
    lines: [
      "OTP_INVALID:",
      "  http-code: 400",
      '  message-en: "The code is wrong."',
      "OTP_EXPIRED:            http-code: 410",
      "OTP_ATTEMPTS_EXCEEDED:  http-code: 429",
      "OTP_SEND_LIMIT:         http-code: 429",
      "",
      "# application.yaml",
      "ecom.otp:",
      "  ttl: 5m",
      "  max-attempts: 5",
      "  max-sends: 3",
      "  send-window: 15m",
    ],
    highlight: [1, 2, 11, 12, 13],
  },
];
