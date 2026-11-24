import type { Metadata } from "next";
import { permanentRedirect, redirect } from "next/navigation";
import { cache } from "react";
import { Landing } from "@/components/Landing";
import { defaultVariant } from "@/lib/config";
import { copy } from "@/lib/copy";
import { inviteExists } from "@/lib/waitlist";

// Stránka pro pozvané kamarády: vandr.world/r/KOD. Představí Vandr a zápis připíše pozvánku.
// Stránky se tvoří až při první návštěvě a počítadlo se obnoví nejpozději po minutě.
// Neznámý kód dostane obyčejný úvod (bez „Kamarád tě zve“), malá písmena přesměrujeme na velká.
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

const isCode = (code: string) => /^[A-Za-z0-9]{4,12}$/.test(code);
const known = cache(inviteExists);

export async function generateMetadata({ params }: PageProps<"/r/[code]">): Promise<Metadata> {
  const { code } = await params;
  const base: Metadata = { robots: { index: false, follow: true }, alternates: { canonical: "/" } };
  if (!isCode(code) || code !== code.toUpperCase() || !(await known(code))) return base;
  return {
    ...base,
    title: `${copy.invite.title} · Vandr`,
    description: copy.invite.description,
    openGraph: { title: copy.invite.title, description: copy.invite.description },
    twitter: { title: copy.invite.title, description: copy.invite.description },
  };
}

export default async function InvitePage({ params }: PageProps<"/r/[code]">) {
  const { code } = await params;
  if (!isCode(code)) redirect("/");
  const upper = code.toUpperCase();
  if (code !== upper) permanentRedirect(`/r/${upper}`);
  if (!(await known(upper))) return <Landing variant={defaultVariant} />;
  return <Landing variant={defaultVariant} invite={upper} />;
}
