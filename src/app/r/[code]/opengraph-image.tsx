import { copy } from "@/lib/copy";
import { ogImage, ogSize } from "@/lib/og";

// Náhled pozvánky ve WhatsAppu a Messengeru. Stejný pro všechny kódy.
export const alt = "Pozvánka na Vandr, sociální síť jen o cestování";
export const size = ogSize;
export const contentType = "image/png";

export default async function InviteImage() {
  return ogImage({ ...copy.invite.og, line: copy.invite.ogLine });
}
