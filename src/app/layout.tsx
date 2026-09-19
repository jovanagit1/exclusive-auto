import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: {
    default: "Exclusive Auto — Prodaja i uvoz vozila",
    template: "%s | Exclusive Auto",
  },
  description:
    "Exclusive Auto — prodaja, uvoz i priprema polovnih vozila. Registracija, detailing, poliranje i zatamnjenje stakala. Zakažite probnu vožnju.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
