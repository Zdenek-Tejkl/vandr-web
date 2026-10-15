import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { isVariant, variants } from "@/lib/config";

// Varianty nadpisu pro A/B test. Návštěvník je sem přesměrován interně (proxy.ts),
// v adresním řádku zůstává vandr.world. Přímý přístup na /h/... proxy přesměruje na úvod,
// takže tahle stránka je vždy jen úvod a smí se indexovat (titulek a canonical jako úvod).
export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return variants.map((variant) => ({ variant }));
}

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function VariantPage({ params }: PageProps<"/h/[variant]">) {
  const { variant } = await params;
  if (!isVariant(variant)) notFound();
  return <Landing variant={variant} />;
}
