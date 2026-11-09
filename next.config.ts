import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* jsdom & Readability & lib export wajib external — kalau di-bundle Turbopack, runtime crash */
  serverExternalPackages: ["jsdom", "@mozilla/readability", "jspdf", "html-to-docx", "sharp"],
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
