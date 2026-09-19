"use client";

import { useEffect, useState } from "react";
import { LogoFull } from "./Logo";

/**
 * Personalizovani loading ekran sa logom firme koji pulsira.
 * Prikazuje se pri svakom prvom učitavanju stranice (osvježavanju),
 * a zatim se glatko izgubi (fade out) i otkrije sadržaj sajta.
 *
 * Trajanje i brzina pulsiranja se mogu podesiti u globals.css
 * (klase .splash-logo / @keyframes splash-pulse).
 */
export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1100);
    const removeTimer = setTimeout(() => setVisible(false), 1600);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background ${
        fading ? "splash-exit" : ""
      }`}
      aria-hidden="true"
    >
      <LogoFull className="splash-logo h-28 w-auto text-foreground sm:h-32" />
      <p className="mt-6 text-[0.65rem] tracking-[0.5em] text-muted uppercase">
        Prodaja polovnih automobila
      </p>
    </div>
  );
}
