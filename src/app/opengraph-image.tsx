import { headlines } from "@/lib/copy";
import { defaultVariant } from "@/lib/config";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Vandr: globus navštívených zemí a tipy od kamarádů";
export const size = ogSize;
export const contentType = "image/png";

export default async function OpengraphImage() {
  const h = headlines[defaultVariant];
  return ogImage({ ...h, line: "Sociální síť jen o cestování. Zapiš se na waiting list." });
}
