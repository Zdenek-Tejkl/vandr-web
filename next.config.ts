import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Písma a obrázky aplikace pro generované obrázky se čtou ze souborů za běhu.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
    "/twitter-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
  },
  // Staré odkazy z doby waiting listu pro všechny vedou na úvod. Kód pozvánky jde dál v ?ref,
  // takže kdo se pak zapíše na waiting list pro iPhone, připíše se kamarádovi jako dřív.
  // /potvrdit zůstává stránkou (odkazy z e-mailů waiting listu).
  async redirects() {
    return [
      { source: "/r/:code", destination: "/?ref=:code&utm_source=pozvanka", permanent: false },
      { source: "/h/:variant", destination: "/", permanent: false },
    ];
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
