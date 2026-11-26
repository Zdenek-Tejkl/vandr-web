// Pozvánka do skupiny cesty: kód z odkazu vandr.world/p/<kód>. Čistá logika bez závislostí. Test: npm test
// Stejná pravidla má aplikace a databáze: 8 znaků z abecedy bez zaměnitelných znaků (0 O 1 I L U), psáno XXXX-XXXX.

export const INVITE_ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
export const INVITE_LENGTH = 8;

const VALID = new RegExp(`^[${INVITE_ALPHABET}]{${INVITE_LENGTH}}$`);

/** Kód z adresy v jednotném tvaru XXXX-XXXX (velká písmena, pomlčka uprostřed). null = tohle kód není. */
export function normalizeInviteCode(raw: string | null | undefined): string | null {
  const bare = (raw ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!VALID.test(bare)) return null;
  return `${bare.slice(0, 4)}-${bare.slice(4)}`;
}

/** Odkaz, který otevře pozvánku rovnou v aplikaci (kdo ji nemá, tomu neudělá nic). */
export function inviteAppLink(code: string): string {
  return `vandr://p/${code}`;
}

/** Zdroj návštěvy pro odkazy do obchodů: po instalaci z pozvánky je vidět, odkud člověk přišel. */
export function inviteUtm(code: string) {
  return { source: "invite", medium: "link", campaign: code.replace("-", "") };
}
