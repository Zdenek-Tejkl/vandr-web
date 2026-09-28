// Všechny texty webu na jednom místě (čeština). Anglická verze přijde později.
import type { Variant } from "./config";

export const headlines: Record<Variant, { main: string; accent: string }> = {
  a: { main: "Kam jedeš?", accent: "Tvoji kamarádi už tam byli." },
  b: { main: "Instagram", accent: "jen pro cestovatele." },
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
  gdpr: (controller: string) => `E-mail zpracovává ${controller} jen kvůli spuštění Vandru.`,
  privacyLink: "Zásady ochrany osobních údajů",
  counter: (n: string, word: string, verb: string) => `Už ${n} ${word} ${verb}`,

  featuresEyebrow: "Co tě čeká",
  featuresTitle: "Svět podle tvých kamarádů",
  features: [
    {
      title: "Globus tvých zemí",
      text: "Navštívené země se obarví samy. Stačí načíst polohu fotek z galerie.",
      alt: "Globus navštívených zemí v aplikaci Vandr",
    },
    {
      title: "Tipy kamarádů na mapě",
      text: "Otevřeš Gruzii a vidíš, kde byli tvoji lidé, čím jeli a co doporučují.",
      alt: "Mapa Gruzie s tipy a místy kamarádů v aplikaci Vandr",
    },
    {
      title: "Body a tiery",
      text: "Za každý tip a fotku body. Z Turisty až na Legendu.",
      alt: "Body a úrovně cestovatele v aplikaci Vandr",
    },
  ],

  secondTitle: "Buď mezi prvními na Vandru.",
  secondText: "Jeden e-mail, až spustíme. Nic víc.",

  errors: {
    invalid: "Tohle nevypadá jako e-mail. Zkontroluj zavináč a tečku.",
    server: "Nepovedlo se to uložit. Zkus to prosím znovu za chvíli.",
    rateLimited: "Moc pokusů najednou. Zkus to prosím za pár minut.",
  },

  thanks: {
    created: (pos: string) => `Jsi na seznamu! Tvoje pořadí: #${pos}`,
    exists: (pos: string) => `Tenhle e-mail už na seznamu je. Tvoje pořadí: #${pos}.`,
    createdNoPos: "Jsi na seznamu!",
    challenge: "Pozvi 3 kamarády a dostaneš odznak Founding Vandrák.",
    boost: "Každý kamarád tě posune o 10 míst dopředu.",
    linkLabel: "Tvůj odkaz pro kamarády",
    copy: "Kopírovat můj odkaz",
    copied: "Zkopírováno!",
    share: "Sdílet do stories",
    shareText: "Pojď se mnou na Vandr, sociální síť jen o cestování.",
    invited: (n: number) => `Pozvaní kamarádi: ${n}`,
    rewards: [
      { at: 3, text: "Odznak Founding Vandrák" },
      { at: 10, text: "Do bety mezi prvními" },
      { at: 25, text: "Vyšší startovní tier" },
    ],
    question: "Kam jedeš příště?",
    questionHint: "Nepovinné. Pomůže nám s obsahem.",
    questionPlaceholder: "Třeba Gruzie nebo Lisabon",
    questionSend: "Odeslat",
    questionThanks: "Díky! Připravíme tipy i pro tebe.",
    back: "Zpět na úvod",
  },

  footer: "© 2026 Vandr",
};

// 1 cestovatel čeká, 2 až 4 cestovatelé čekají, 5+ cestovatelů čeká
export function travelers(n: number): { word: string; verb: string } {
  if (n === 1) return { word: "cestovatel", verb: "čeká" };
  if (n >= 2 && n <= 4) return { word: "cestovatelé", verb: "čekají" };
  return { word: "cestovatelů", verb: "čeká" };
}

export const formatNumber = (n: number) => new Intl.NumberFormat("cs-CZ").format(n);
