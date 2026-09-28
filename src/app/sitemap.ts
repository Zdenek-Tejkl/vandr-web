import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/zasady-ochrany-osobnich-udaju`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
