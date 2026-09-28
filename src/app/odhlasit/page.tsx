import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Brand";
import { UnsubscribeButton } from "./UnsubscribeButton";

export const metadata: Metadata = {
  title: "Odhlášení · Vandr",
  robots: { index: false, follow: false },
};

// Odhlašuje se až tlačítkem (POST), aby odkaz neodhlásil kontrola odkazů v e-mailu.
export default async function UnsubscribePage({ searchParams }: PageProps<"/odhlasit">) {
  const q = await searchParams;
  const code = typeof q.c === "string" ? q.c : "";
  const token = typeof q.t === "string" ? q.t : "";

  return (
    <main className="doc">
      <div className="doc-in">
        <Link href="/" className="doc-home" aria-label="Zpět na vandr.world">
          <Logo id="cat-unsub" />
        </Link>
        <h1>Odhlásit z waiting listu</h1>
        {code && token ? (
          <>
            <p>Smažeme tě ze seznamu a už ti nic nepošleme. Kdykoli se můžeš zapsat znovu.</p>
            <UnsubscribeButton code={code} token={token} />
          </>
        ) : (
          <p>Odkaz není úplný. Použij prosím odkaz z e-mailu, nebo napiš na ahoj@vandr.world.</p>
        )}
      </div>
    </main>
  );
}
