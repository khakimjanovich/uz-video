// The front's strings that still name a processing centre or a card scheme, and the generic wording its fix
// will ship. Applied to the screenshots only; delete this list once the front's own strings are generic.
// Each pair is [the exact text as served, its replacement]; quoted values replace the whole string.
export const OVERRIDES: [string, string][] = [
  // en
  ['"Registered at Uzcard"', '"Registered at the processing centre"'],
  ['"Revoked here and removed from Uzcard"', '"Revoked here and removed from the processing centre"'],
  [
    "A revoked MID/TID never comes back. It is removed from Uzcard first; if Uzcard refuses or doesn't answer, nothing changes, and you can suspend it meanwhile. Say why, for the audit.",
    "A revoked MID/TID never comes back. It is removed from the processing centre first; if the centre refuses or doesn't answer, nothing changes, and you can suspend it meanwhile. Say why, for the audit.",
  ],
  ['"At Uzcard"', '"At the processing centre"'],
  ['"Check at Uzcard"', '"Check at the processing centre"'],
  ['"Asking Uzcard…"', '"Asking the processing centre…"'],
  ['"Uzcard agrees with our record."', '"The processing centre agrees with our record."'],
  [
    "Uzcard doesn't have this e-POS terminal, so its payments will fail. Register it at Uzcard; if Uzcard refuses, revoke it.",
    "The processing centre doesn't have this e-POS terminal, so its payments will fail. Register it there; if the centre refuses, revoke it.",
  ],
  ['"Register at Uzcard"', '"Register at the processing centre"'],
  ["Revoked here, but Uzcard still has it. Ask Uzcard to remove it.", "Revoked here, but the processing centre still has it. Ask the centre to remove it."],
  ["It is registered at Uzcard first, and kept only if Uzcard accepts it.", "It is registered at the processing centre first, and kept only if the centre accepts it."],
  ['"Uzcard id"', '"Centre id"'],
  ["claims from Uzcard or Humo", "claims from the card networks"],
  ["against the Uzcard and Humo reports", "against the processing centres' reports"],
  // ru
  ['"Зарегистрирован в Uzcard"', '"Зарегистрирован в процессинговом центре"'],
  ['"Отозван здесь и удалён из Uzcard"', '"Отозван здесь и удалён из процессингового центра"'],
  [
    "Сначала он удаляется из Uzcard; если Uzcard откажет или не ответит, ничего не изменится",
    "Сначала он удаляется из процессингового центра; если центр откажет или не ответит, ничего не изменится",
  ],
  ['"В Uzcard"', '"В процессинговом центре"'],
  ['"Проверить в Uzcard"', '"Проверить в процессинговом центре"'],
  ['"Спрашиваем Uzcard…"', '"Спрашиваем процессинговый центр…"'],
  ['"Uzcard согласен с нашей записью."', '"Процессинговый центр согласен с нашей записью."'],
  [
    "В Uzcard нет этого e-POS терминала, поэтому его платежи не пройдут. Зарегистрируйте его в Uzcard; если Uzcard откажет, отзовите его.",
    "В процессинговом центре нет этого e-POS терминала, поэтому его платежи не пройдут. Зарегистрируйте его там; если центр откажет, отзовите его.",
  ],
  ['"Зарегистрировать в Uzcard"', '"Зарегистрировать в процессинговом центре"'],
  ["Здесь отозван, но в Uzcard ещё есть. Попросите Uzcard удалить его.", "Здесь отозван, но в процессинговом центре ещё есть. Попросите центр удалить его."],
  [
    "Сначала он регистрируется в Uzcard и сохраняется, только если Uzcard его примет.",
    "Сначала он регистрируется в процессинговом центре и сохраняется, только если центр его примет.",
  ],
  ['"Id в Uzcard"', '"Id в центре"'],
  ["претензии от Uzcard или Humo", "претензии от карточных сетей"],
  ["против отчётов Uzcard и Humo", "против отчётов процессинговых центров"],
  // uz
  ['"Uzcardda roʻyxatdan oʻtkazildi"', '"Protsessing markazida roʻyxatdan oʻtkazildi"'],
  ['"Bu yerda bekor qilindi va Uzcarddan oʻchirildi"', '"Bu yerda bekor qilindi va protsessing markazidan oʻchirildi"'],
  [
    "Avval u Uzcarddan oʻchiriladi; Uzcard rad etsa yoki javob bermasa",
    "Avval u protsessing markazidan oʻchiriladi; markaz rad etsa yoki javob bermasa",
  ],
  ['"Uzcardda"', '"Protsessing markazida"'],
  ['"Uzcardda tekshirish"', '"Protsessing markazida tekshirish"'],
  ['"Uzcarddan soʻralmoqda…"', '"Protsessing markazidan soʻralmoqda…"'],
  ['"Uzcard bizdagi yozuvga mos."', '"Protsessing markazi bizdagi yozuvga mos."'],
  [
    "Uzcardda bu e-POS terminal yoʻq, shuning uchun uning toʻlovlari oʻtmaydi. Uni Uzcardda roʻyxatdan oʻtkazing; Uzcard rad etsa, bekor qiling.",
    "Protsessing markazida bu e-POS terminal yoʻq, shuning uchun uning toʻlovlari oʻtmaydi. Uni u yerda roʻyxatdan oʻtkazing; markaz rad etsa, bekor qiling.",
  ],
  ['"Uzcardda roʻyxatdan oʻtkazish"', '"Protsessing markazida roʻyxatdan oʻtkazish"'],
  [
    "Bu yerda bekor qilingan, lekin Uzcardda hali bor. Uzcarddan uni oʻchirishni soʻrang.",
    "Bu yerda bekor qilingan, lekin protsessing markazida hali bor. Markazdan uni oʻchirishni soʻrang.",
  ],
  [
    "Avval u Uzcardda roʻyxatdan oʻtkaziladi va faqat Uzcard qabul qilsa saqlanadi.",
    "Avval u protsessing markazida roʻyxatdan oʻtkaziladi va faqat markaz qabul qilsa saqlanadi.",
  ],
  ['"Uzcarddagi id"', '"Markazdagi id"'],
  ["Uzcard yoki Humo daʼvolari", "karta tarmoqlari daʼvolari"],
  ["Uzcard va Humo hisobotlari", "protsessing markazlari hisobotlari"],
  // card schemes, every language (the enum labels)
  ['"Uzcard"', '"Card A"'],
  ['"Humo"', '"Card B"'],
];
