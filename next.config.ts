import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Písma a obrázky aplikace pro generované obrázky se čtou ze souborů za běhu.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
    "/twitter-image": ["./src/assets/fonts/**", "./src/assets/screens/**"],
  },
  // Staré odkazy z doby waiting listu vedou na úvod (pozvánky, varianty nadpisu, potvrzení e-mailu).
  async redirects() {
    return [
      { source: "/r/:code", destination: "/?utm_source=pozvanka", permanent: false },
      { source: "/h/:variant", destination: "/", permanent: false },
      { source: "/potvrdit", destination: "/", permanent: false },
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
