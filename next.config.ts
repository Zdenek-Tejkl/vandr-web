import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Písma a obrázky aplikace pro generované obrázky se čtou ze souborů za běhu.
  outputFileTracingIncludes: {
    "/api/story/[code]": ["./src/assets/fonts/**"],
    "/opengraph-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
    "/twitter-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
    "/r/[code]/opengraph-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
    "/r/[code]/twitter-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
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
