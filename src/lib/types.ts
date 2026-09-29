export type JoinStatus = "created" | "exists";

// Co dostane prohlížeč po zápisu. Nikdy neobsahuje tokeny pro potvrzení a odhlášení.
export type JoinResult = {
  status: JoinStatus;
  position: number | null;
  code: string | null;
  referrals: number;
  total: number;
  answerToken?: string;
};

export type JoinError = {
  error: "invalid" | "disposable" | "typo" | "no_mx" | "rate_limited" | "server";
  suggestion?: string;
};
