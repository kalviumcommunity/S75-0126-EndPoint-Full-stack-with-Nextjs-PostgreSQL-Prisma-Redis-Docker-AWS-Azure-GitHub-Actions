import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 secrets-manager
  /* config options here */
  turbopack: {
    root: ".",

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'https://apis.google.com'; img-src 'self' data:; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
 main
  },
};

export default nextConfig;
