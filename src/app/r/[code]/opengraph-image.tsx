import { defaultVariant } from "@/lib/config";
import { copy, headlines } from "@/lib/copy";
import { ogImage, ogSize } from "@/lib/og";
import { inviteExists } from "@/lib/waitlist";

// Náhled pozvánky ve WhatsAppu a Messengeru. Stejný pro všechny platné kódy,
// neznámý kód dostane obyčejný náhled úvodu.
export const alt = "Pozvánka na Vandr, sociální síť jen o cestování";
export const size = ogSize;
export const contentType = "image/png";

export default async function InviteImage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!/^[A-Z0-9]{4,12}$/.test(code) || !(await inviteExists(code))) {
    return ogImage({ ...headlines[defaultVariant], line: "Sociální síť jen o cestování. Zapiš se na waiting list." });
  }
  return ogImage({ ...copy.invite.og, line: copy.invite.ogLine });
}
