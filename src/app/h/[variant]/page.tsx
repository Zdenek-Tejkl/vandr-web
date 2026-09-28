import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Landing } from "@/components/Landing";
import { isVariant, variants } from "@/lib/config";
import { copy, headlines } from "@/lib/copy";

// Varianty nadpisu pro A/B test. Návštěvník je sem přesměrován interně (proxy.ts),
// v adresním řádku zůstává vandr.world. Vyhledávače indexují jen hlavní stránku.
export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return variants.map((variant) => ({ variant }));
}

export async function generateMetadata({ params }: PageProps<"/h/[variant]">): Promise<Metadata> {
  const { variant } = await params;
  const h = isVariant(variant) ? headlines[variant] : headlines.a;
  return {
    title: `Vandr · ${h.main} ${h.accent}`,
    description: copy.description,
    robots: { index: false, follow: true },
    alternates: { canonical: "/" },
  };
}

export default async function VariantPage({ params }: PageProps<"/h/[variant]">) {
  const { variant } = await params;
  if (!isVariant(variant)) notFound();
  return <Landing variant={variant} />;
}
