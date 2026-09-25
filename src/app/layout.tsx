import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { autoDealerJsonLd, SITE_URL } from "@/lib/structured-data";
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
    default:
      "Exclusive Auto — Polovna auta Banja Luka | Prodaja i uvoz vozila",
    template: "%s | Exclusive Auto Banja Luka",
  },
  description:
    "Exclusive Auto — prodaja polovnih auta i automobila u Banjoj Luci, uvoz vozila iz Evrope, registracija i priprema vozila. Pogledajte ponudu polovnih vozila i zakažite probnu vožnju.",
  keywords: [
    "polovna auta",
    "prodaja auta",
    "auta banja luka",
    "prodaja auta banja luka",
    "polovna auta banja luka",
    "prodaja automobila banja luka",
    "prodaja polovnih auta banja luka",
    "prodaja polovnih automobila banja luka",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "bs_BA",
    siteName: "Exclusive Auto",
    title: "Exclusive Auto — Polovna auta Banja Luka",
    description:
      "Prodaja i uvoz polovnih vozila u Banjoj Luci. Pogledajte trenutnu ponudu automobila.",
    url: SITE_URL,
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
            __html: JSON.stringify(autoDealerJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
        {/* Posjećenost sajta — statistika u Vercel → projekat → Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
