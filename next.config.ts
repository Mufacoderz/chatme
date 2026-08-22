import withSerwistInit from "@serwist/next"
import type { NextConfig } from "next"

const revision = crypto.randomUUID()
const isDev = process.env.NODE_ENV === "development"

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/offline", revision }],
  reloadOnOnline: false,
  disable: isDev,
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://*.googleusercontent.com",
              `connect-src 'self' https://*.googleusercontent.com${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
              "worker-src 'self'",
              "frame-ancestors 'none'",
            ].join("; ") + ";",
          },
        ],
      },
    ]
  },
}

export default withSerwist(nextConfig)