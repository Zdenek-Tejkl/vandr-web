import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Landing } from "@/components/Landing";
import { defaultVariant } from "@/lib/config";
import { copy } from "@/lib/copy";

// Stránka pro pozvané kamarády: vandr.world/r/KOD. Představí Vandr a zápis připíše pozvánku.
// Stránky se tvoří až při první návštěvě a počítadlo se obnoví nejpozději po minutě.
export const revalidate = 60;

export function generateStaticParams() {
  return [];
}

const isCode = (code: string) => /^[A-Za-z0-9]{4,12}$/.test(code);

export const metadata: Metadata = {
  title: `${copy.invite.title} · Vandr`,
  description: copy.invite.description,
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
  openGraph: { title: copy.invite.title, description: copy.invite.description },
  twitter: { title: copy.invite.title, description: copy.invite.description },
};

export default async function InvitePage({ params }: PageProps<"/r/[code]">) {
  const { code } = await params;
  if (!isCode(code)) redirect("/");
  return <Landing variant={defaultVariant} invite={code.toUpperCase()} />;
}
