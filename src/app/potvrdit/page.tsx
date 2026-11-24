import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { formatNumber } from "@/lib/copy";
import { confirmEmail } from "@/lib/waitlist";

export const metadata: Metadata = {
  title: "Potvrzení e-mailu · Vandr",
  robots: { index: false, follow: false },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ConfirmPage({ searchParams }: PageProps<"/potvrdit">) {
  const q = await searchParams;
  const code = typeof q.c === "string" ? q.c.slice(0, 12) : "";
  const token = typeof q.t === "string" ? q.t : "";

  let position: number | null = null;
  let ok = false;
  if (code && UUID.test(token)) {
    try {
      const r = await confirmEmail(code, token);
      ok = Boolean(r);
      position = r?.position ?? null;
    } catch (e) {
      console.error("confirm failed", e);
    }
  }

  return (
    <main className="doc doc-dark">
      <div className="doc-in">
        <Link href="/" className="doc-home" aria-label="Zpět na vandr.world">
          <Logo id="cat-confirm" />
        </Link>
        {ok ? (
          <>
            <h1>E-mail je potvrzený.</h1>
            {position && <p className="doc-big">#{formatNumber(position)}</p>}
            <p>Díky! Tvoje místo ve frontě je jisté. Napíšeme ti, až spustíme.</p>
          </>
        ) : (
          <>
            <h1>Tenhle odkaz nefunguje.</h1>
            <p>Možná už vypršel nebo není celý. Zkus ho otevřít znovu z e-mailu, nebo napiš na ahoj@vandr.world.</p>
          </>
        )}
        <p className="doc-back">
          <Link href="/" className="btn">Na vandr.world</Link>
        </p>
      </div>
    </main>
  );
}
