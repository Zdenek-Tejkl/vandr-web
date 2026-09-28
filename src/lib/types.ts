export type JoinStatus = "created" | "exists";

// Co dostane prohlížeč po zápisu. Nikdy neobsahuje tokeny pro potvrzení a odhlášení.
export type JoinResult = {
  status: JoinStatus;
  position: number | null;
  code: string | null;
  referrals: number;
  total: number;
  answerToken?: string;
  // Posíláme potvrzovací e-mail, kamarádi se počítají až po potvrzení.
  confirmation: boolean;
};

export type JoinError = { error: "invalid" | "rate_limited" | "server" };
