import type { Metadata } from "next";
import { Invite } from "@/components/Invite";
import { copy } from "@/lib/copy";
import { normalizeInviteCode } from "@/lib/invite";
import { inviteInfo } from "@/lib/inviteData";

type Props = { params: Promise<{ code: string }> };

// Pozvánky nejsou pro vyhledávače: jsou soukromé a každá je jiná.
export const metadata: Metadata = {
  title: copy.invite.metaTitle,
  description: copy.invite.metaDescription,
  robots: { index: false, follow: false },
  openGraph: { title: copy.invite.metaTitle, description: copy.invite.metaDescription },
};

export default async function InvitePage({ params }: Props) {
  const { code: raw } = await params;
  const code = normalizeInviteCode(decodeURIComponent(raw));
  const info = code ? await inviteInfo(code) : null;
  return <Invite code={code} info={info} />;
}
