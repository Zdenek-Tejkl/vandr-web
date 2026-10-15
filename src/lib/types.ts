export type JoinStatus = "created" | "exists";

// Co dostane prohlížeč po zápisu. Nikdy neobsahuje tokeny pro potvrzení a odhlášení.
// U existujícího e-mailu ani pořadí a kód (ty jsou jen v uvítacím e-mailu).
export type JoinResult = {
  status: JoinStatus;
  position: number | null;
  code: string | null;
  referrals: number;
  total: number;
  answerToken?: string;
  // Uvítací e-mail se posílá (je nastavený Resend).
  mailed?: boolean;
};

export type JoinError = {
  error: "invalid" | "disposable" | "typo" | "no_mx" | "rate_limited" | "server";
  suggestion?: string;
};
