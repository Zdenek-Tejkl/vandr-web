import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Písma pro generované obrázky (story) se čtou ze souborů za běhu.
  outputFileTracingIncludes: {
    "/api/story/[code]": ["./src/assets/fonts/**"],
    "/opengraph-image": ["./src/assets/fonts/**"],
    "/twitter-image": ["./src/assets/fonts/**"],
    "/r/[code]/opengraph-image": ["./src/assets/fonts/**"],
    "/r/[code]/twitter-image": ["./src/assets/fonts/**"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
