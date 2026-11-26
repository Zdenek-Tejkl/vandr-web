import { copy } from "@/lib/copy";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Vandr: skupina cesty, report a globus navštívených zemí";
export const size = ogSize;
export const contentType = "image/png";

export default async function OpengraphImage() {
  return ogImage({
    main: copy.hero.main,
    accent: copy.hero.accent,
    line: "Skupina pro každou cestu, report na profil a skryté poklady od kamarádů. Stáhni si Vandr na Google Play.",
  });
}
