"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SplashScreen from "./SplashScreen";

/**
 * Glavna navigacija/footer/splash se prikazuju na javnom sajtu, ali NE u
 * admin panelu (koji ima svoju jednostavnu navigaciju — vidi AdminNav).
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  // Stranica za štampu odabranih vozila iz cjenovnika prikazuje se kao
  // "čist papir" — bez menija, footera i loading ekrana.
  const isStampa = pathname?.startsWith("/cjenovnik/stampa");

  if (isAdmin || isStampa) {
    return <>{children}</>;
  }

  return (
    <>
      <SplashScreen />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
