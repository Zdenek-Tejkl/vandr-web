import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/odhlasit", "/stahnout", "/p/", "/auth"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
