import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* jsdom & Readability wajib external — kalau di-bundle Turbopack, runtime crash */
  serverExternalPackages: ["jsdom", "@mozilla/readability"],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
