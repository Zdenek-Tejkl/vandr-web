import type { Metadata } from "next";
import { AuthLanding } from "./AuthLanding";

export const metadata: Metadata = {
  title: "Přihlášení · Vandr",
  robots: { index: false, follow: false },
};

// Sem vedou odkazy z e-mailů aplikace (přihlášení, potvrzení účtu, nové heslo).
// Stránka předá kód aplikaci, nebo hezky řekne, že odkaz už neplatí.
export default function AuthPage() {
  return <AuthLanding />;
}
