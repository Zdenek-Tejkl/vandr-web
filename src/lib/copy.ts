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
  counter: (n: string, goal: string) => `Už ${n} z ${goal} cestovatelů`,
  counterHint: (left: string) => `Ještě ${left} potřebných.`,

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
    typo: (s: string) => `Nemyslel(a) jsi ${s}? Oprav to a zkus znovu.`,
    disposable: "Jednorázové schránky nebereme. Zadej prosím svůj běžný e-mail.",
    noMx: "Tahle doména nepřijímá poštu. Zkontroluj část za zavináčem.",
    server: "Nepovedlo se to uložit. Zkus to prosím znovu za chvíli.",
    rateLimited: "Moc pokusů najednou. Zkus to prosím za pár minut.",
  },

  thanks: {
    created: "Jsi na seznamu!",
    exists: "Tenhle e-mail už na seznamu je.",
    positionLabel: "Tvoje pořadí",
    of: (total: string, goal: string) => `${total} z ${goal} čekajících`,
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
    back: "Zpět na úvod",
  },

  footer: "© 2026 Vandr · vandr.world",
};

// Cíl je vždy další tisícovka nad aktuálním počtem: 1 200 -> 2 000, 6 050 -> 7 000.
export const goalFor = (n: number) => Math.floor(Math.max(0, n) / 1000) * 1000 + 1000;

export const formatNumber = (n: number) => new Intl.NumberFormat("cs-CZ").format(n);
