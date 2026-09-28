export type JoinStatus = "created" | "exists";

// Co dostane prohlížeč po zápisu. Nikdy neobsahuje token pro odhlášení.
export type JoinResult = {
  status: JoinStatus;
  position: number | null;
  code: string | null;
  referrals: number;
  total: number;
  answerToken?: string;
};

export type JoinError = { error: "invalid" | "rate_limited" | "server" };
