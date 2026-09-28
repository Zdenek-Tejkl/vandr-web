// Všechny texty webu na jednom místě (čeština). Anglická verze přijde později.
import type { Variant } from "./config";

export const headlines: Record<Variant, { main: string; accent: string }> = {
  a: { main: "Kam jedeš?", accent: "Tvoji kamarádi už tam byli." },
  b: { main: "Instagram jen", accent: "pro cestovatele." },
  c: { main: "Kolik zemí", accent: "jsi už viděl?" },
};

export const copy = {
  title: "Vandr · Sociální síť pro cestovatele",
  description:
    "Globus tvých zemí, tipy a hidden gems od kamarádů. Zapiš se na waiting list a buď mezi prvními na Vandru.",
  subtitle: "Sociální síť jen o cestování. Globus, tipy a hidden gems od lidí, kterým věříš.",
  emailLabel: "Tvůj e-mail",
  placeholder: "tvuj@email.cz",
  button: "Chci na Vandr",
  buttonBusy: "Zapisuju…",
  noSpam: "Žádný spam. Napíšeme ti jen, až spustíme.",
  gdpr: (controller: string) => `Údaje zpracovává ${controller} jen kvůli spuštění.`,
  privacyLink: "Zásady ochrany osobních údajů",
  counter: (n: string, word: string, verb: string) => `Už ${n} ${word} ${verb}`,
  beFirst: "Buď mezi prvními 1 000",

  phone: {
    title: "Tvůj globus",
    tier: "Tulák",
    stats: [
      { n: "12", label: "zemí" },
      { n: "3", label: "kontinenty" },
      { n: "48", label: "tipů" },
    ],
    note: "tu byl v květnu: noční vlak do Batumi",
    noteLong: "tu byl v květnu. Noční vlak do Batumi, lůžko za 35 lari.",
    gem: "Hidden gem: Theth, Albánie",
    alt: "Aplikace Vandr: globus navštívených zemí, statistiky a tip od kamaráda",
  },

  featuresEyebrow: "Co tě čeká",
  featuresTitle: "Tvoje cesty. Tipy od tvých lidí.",
  features: [
    { title: "Globus tvých zemí", text: "Každá země, kde jsi byl, se ti rozsvítí." },
    { title: "Tipy kamarádů na mapě", text: "Hidden gems, jídlo a spoje od lidí, kterým věříš." },
    { title: "Body a tiery", text: "Za každou cestu body. Z Turisty až na Legendu." },
  ],
  tiers: ["Turista", "Tulák", "Vandrák", "Průzkumník", "Legenda"],
  inviteTitle: "Vezmi s sebou kamarády.",
  inviteText: "Každý, kdo se přidá přes tvůj odkaz, tě posune o 10 míst.",

  secondTitle: "Buď mezi prvními.",
  secondText: "První na řadě dostanou přístup a 3 zlaté vstupenky pro kamarády.",

  errors: {
    invalid: "Tohle nevypadá jako e-mail. Zkontroluj zavináč a tečku.",
    server: "Nepovedlo se to uložit. Zkus to prosím znovu za chvíli.",
    rateLimited: "Moc pokusů najednou. Zkus to prosím za pár minut.",
  },

  thanks: {
    created: "Jsi na seznamu!",
    exists: "Tenhle e-mail už na seznamu je.",
    positionLabel: "Tvoje pořadí",
    of: (total: string) => `z ${total} čekajících`,
    inviteTitle: "Vezmi s sebou kamarády.",
    inviteText: "Každý, kdo se přidá přes tvůj odkaz, tě posune o 10 míst dopředu.",
    toBadge: (left: number) => `Ještě ${left} ${left === 1 ? "kamarád" : left <= 4 ? "kamarádi" : "kamarádů"} do odznaku`,
    toNext: (left: number, reward: string) => `Ještě ${left} do: ${reward}`,
    allDone: "Máš všechny odměny. Jsi legenda.",
    badge: "Founding Vandrák",
    whatsapp: "Poslat přes WhatsApp",
    stories: "Sdílet do stories",
    copy: "Kopírovat",
    copied: "Zkopírováno",
    linkLabel: "Tvůj odkaz pro kamarády",
    shareText: "Pojď se mnou na Vandr, sociální síť jen o cestování:",
    rewardsTitle: "Odměny za kamarády",
    rewards: [
      { at: 1, text: "Posun ve frontě o 10 míst" },
      { at: 3, text: "Odznak Founding Vandrák navždy" },
      { at: 5, text: "Uzavřená beta jako první" },
      { at: 10, text: "Start o tier výš + vlastní barva globusu" },
      { at: 25, text: "Vandr+ zdarma navždy" },
      { at: 50, text: "Merch + jméno mezi zakladateli" },
    ],
    question: "Kam jedeš příště?",
    questionOptional: "(nepovinné)",
    questionPlaceholder: "Třeba Gruzie",
    questionSend: "Uložit",
    questionThanks: "Díky! Připravíme tipy i pro tebe.",
    footnoteConfirm: "Kamarád se započítá, až potvrdí svůj e-mail. Pořadí najdeš i v e-mailu, který ti právě přišel.",
    back: "Zpět na úvod",
  },

  footer: "© 2026 Vandr · vandr.world",
};

// 1 cestovatel čeká, 2 až 4 cestovatelé čekají, 5+ cestovatelů čeká
export function travelers(n: number): { word: string; verb: string } {
  if (n === 1) return { word: "cestovatel", verb: "čeká" };
  if (n >= 2 && n <= 4) return { word: "cestovatelé", verb: "čekají" };
  return { word: "cestovatelů", verb: "čeká" };
}

export const formatNumber = (n: number) => new Intl.NumberFormat("cs-CZ").format(n);
