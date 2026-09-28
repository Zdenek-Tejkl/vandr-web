import Link from "next/link";
import { Wanderer } from "@/components/Brand";

export default function NotFound() {
  return (
    <main className="doc doc-center">
      <div className="doc-in">
        <Wanderer className="nf-art" />
        <h1>Tady nic není.</h1>
        <p>Kocour Vandr tu cestu nezná. Zkus to od začátku.</p>
        <p className="doc-back">
          <Link href="/" className="btn">Na vandr.world</Link>
        </p>
      </div>
    </main>
  );
}
