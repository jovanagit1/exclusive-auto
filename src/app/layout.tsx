import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { autoDealerJsonLd, websiteJsonLd, SITE_URL } from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";

// Naslov i opis su namjerno formulisani tako da prirodno sadrže fraze koje
// ljudi kucaju na Google-u kad traže polovna vozila u Banjoj Luci (polovna
// auta banja luka, prodaja auta banja luka, prodaja automobila banja luka,
// itd.) — ovo, uz AutoDealer JSON-LD ispod i sitemap/robots fajlove, je
// osnovni "on-page" dio SEO-a. Napomena: sam kod ne garantuje prvo mjesto na
// Google-u — na to najviše utiče i Google Business Profile (Google karta,
// recenzije) i vrijeme/broj posjeta sajtu, što je odvojeno od koda sajta.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EXCLUSIVE AUTO Banja Luka — Prodaja novih i polovnih automobila",
    template: "%s | Exclusive Auto",
  },
  description:
    "Uvoz vozila iz Evrope, priprema i prodaja uz garanciju na porijeklo i kilometražu.",
  // Napomena: Google danas skoro ne gleda "keywords" (gleda tekst na
  // stranici, naslove i opise). Lista ostaje jer je koriste neki drugi
  // pretraživači i alati — pravi posao rade naslovi, opisi i tekst ispod.
  keywords: [
    "auta banja luka",
    "automobili banja luka",
    "prodaja auta",
    "prodaja auta banja luka",
    "prodaja automobila banja luka",
    "prodaja polovnih auta banja luka",
    "polovna auta banja luka",
    "prodaja novih automobila banja luka",
    "auto salon banja luka",
    "auto saloni banja luka",
    "auta bih",
    "prodaja auta bih",
    "uvoz auta iz njemačke",
    "uvoz auta iz austrije",
    "uvoz automobila iz eu",
    "lizing auta banja luka",
  ],
  // Kanonski link (canonical) svaka stranica postavlja za sebe — ovdje ga
  // namjerno nema, jer bi se inače naslijedio na sve stranice.
  openGraph: {
    type: "website",
    locale: "bs_BA",
    siteName: "Exclusive Auto",
    title: "EXCLUSIVE AUTO Banja Luka — Prodaja novih i polovnih automobila",
    description:
      "Uvoz vozila iz Evrope, priprema i prodaja uz garanciju na porijeklo i kilometražu.",
    url: SITE_URL,
    images: [{ url: "/logo/logo-google.png", width: 512, height: 512, alt: "Exclusive Auto" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* JSON-LD (schema.org AutoDealer) — pomaže Google-u da prepozna
            firmu, adresu i radno vrijeme. Vidi src/lib/structured-data.ts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([websiteJsonLd, autoDealerJsonLd]).replace(/</g, "\\u003c"),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
        {/* Posjećenost sajta — statistika u Vercel → projekat → Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
