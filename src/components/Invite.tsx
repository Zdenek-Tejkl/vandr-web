import Link from "next/link";
import { isLive, site } from "@/lib/config";
import { copy } from "@/lib/copy";
import { inviteAppLink, inviteUtm } from "@/lib/invite";
import type { InviteInfo } from "@/lib/inviteData";
import { Logo } from "./Brand";
import { DownloadButton, StoreButtons } from "./Download";
import { CheckIcon, PhoneIcon } from "./Icons";
import { InviteCode, OpenInApp } from "./InviteActions";
import { Qr } from "./Qr";

// Stránka pozvánky: jeden cíl, dostat člověka do aplikace. Kdo ji nemá, stáhne si ji,
// kdo ji má, otevře pozvánku rovnou v ní. Z databáze se ukazuje jen název cesty a kdo zve.
export function Invite({ code, info }: { code: string | null; info: InviteInfo | null }) {
  const c = copy.invite;
  const bad = code === null || info?.status === "not_found";
  const expired = !bad && info?.status === "expired";
  const utm = code ? inviteUtm(code) : undefined;

  let title: React.ReactNode = c.titleGeneric;
  if (bad) title = c.badTitle;
  else if (expired) title = c.expiredTitle;
  else if (info?.ownerName) {
    title = (
      <>
        <span>{info.ownerName}</span> <em>{c.titleNamed}</em>
      </>
    );
  }
  const sub = bad ? c.badText : expired ? c.expiredText : c.sub;
  const live = !bad && !expired;

  return (
    <>
      <header className="top">
        <div className="wrap top-in">
          <Link href="/" className="top-logo" aria-label="Vandr">
            <Logo id="cat-top" />
          </Link>
          <DownloadButton place="top" size="sm" utm={utm} />
        </div>
      </header>

      <main className="invite">
        <div className="wrap invite-in">
          <div className="invite-copy">
            <p className="eyebrow eyebrow-light">{c.eyebrow}</p>
            <h1>{title}</h1>
            {live && info?.title ? <p className="invite-trip">{info.title}</p> : null}
            <p className="sub">{sub}</p>
            {live && info && info.membersCount > 1 ? (
              <p className="cta-note">
                <CheckIcon size={16} /> {c.members} {info.membersCount}
              </p>
            ) : null}

            <div className="cta">
              {isLive ? (
                <>
                  <DownloadButton place="invite" utm={utm} />
                  <StoreButtons place="invite" utm={utm} />
                </>
              ) : (
                <>
                  <p className="soon">
                    <PhoneIcon size={20} /> {copy.download.soonTitle}
                  </p>
                  <DownloadButton place="invite" utm={utm} />
                  <p className="cta-note">{copy.download.soonText}</p>
                </>
              )}
              {live && code ? <OpenInApp href={inviteAppLink(code)} /> : null}
            </div>
          </div>

          {live && code ? (
            <aside className="invite-side">
              <div className="card invite-card">
                <h2>{c.stepsTitle}</h2>
                <ol className="invite-steps">
                  {c.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <InviteCode code={code} />
              </div>
              <div className="card qr-card invite-qr">
                <Qr value={`${site.url}/p/${code}`} label={c.qrAlt} />
                <div>
                  <h2>{c.qrTitle}</h2>
                  <p>{c.qrText}</p>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </main>
    </>
  );
}
