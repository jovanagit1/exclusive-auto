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

  if (isAdmin) {
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
