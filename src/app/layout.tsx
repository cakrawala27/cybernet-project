import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { RegisterSW } from "@/components/register-sw";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leeyork — Cybernet Project | Jasa Pembuatan Website & Web App",
  description:
    "Portofolio Leeyork (Cybernet Project), web developer dari Solok, Sumatera Barat. Jasa pembuatan landing page, company profile, toko online, aplikasi masjid, aplikasi kantor, aplikasi pembelajaran CERDASIA, dan web app custom. Coba demo interaktifnya langsung di website.",
  keywords: [
    "jasa pembuatan website",
    "web developer solok",
    "web developer sumatera barat",
    "cybernet project",
    "aplikasi masjid",
    "aplikasi kantor",
    "aplikasi pembelajaran",
    "aplikasi sekolah",
    "cerdasia",
    "jasa web app",
    "buat toko online",
    "landing page murah",
  ],
  authors: [{ name: "Leeyork" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "Leeyork — Cybernet Project | Jasa Pembuatan Website & Web App",
    description:
      "Ubah ide jadi web app yang cepat & modern. Coba demo interaktif langsung di website.",
    siteName: "Cybernet Project",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 text-zinc-100 antialiased`}
      >
        {children}
        <Toaster />
        <RegisterSW />
      </body>
    </html>
  );
}
