import { Landing } from "@/components/Landing";
import { defaultVariant } from "@/lib/config";

// Statická stránka, počítadlo se obnoví nejpozději po minutě.
export const revalidate = 60;

export default function Home() {
  return <Landing variant={defaultVariant} />;
}
