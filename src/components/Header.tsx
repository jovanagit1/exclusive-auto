"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "./Logo";
import CurrencyToggle from "./CurrencyToggle";
import { GALERIJA_OTVORENA } from "@/lib/galerija";

const sviLinkovi = [
  { href: "/vozila", label: "Vozila" },
  { href: "/usluge", label: "Usluge" },
  { href: "/cjenovnik", label: "Cjenovnik" },
  { href: "/galerija", label: "Galerija" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
];
const links = sviLinkovi.filter((l) => GALERIJA_OTVORENA || l.href !== "/galerija");

function SrceIkonica({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.727c-.246 0-.492-.086-.687-.259C7.94 17.516 3 12.94 3 9.03 3 6.256 5.153 4 7.813 4c1.532 0 2.9.79 3.75 1.997A4.53 4.53 0 0 1 15.312 4C17.973 4 20.125 6.256 20.125 9.03c0 3.91-4.94 8.487-8.313 11.438a1.03 1.03 0 0 1-.687.259Z"
      />
    </svg>
  );
}

/**
 * Gornja crna linija (kao kod Mercedes-Benz sajtova): meni lijevo, auto iz
 * logoa u sredini (klik vodi na početnu), desno KM/EUR i sačuvana vozila.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sacuvana = pathname.startsWith("/sacuvana-vozila");

  return (
    <header className="tamno sticky top-0 z-50 border-b border-white/10 bg-black">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 md:h-20 md:px-8">
        {/* Lijevo: meni (na telefonu dugme za meni) */}
        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[0.95rem] transition-colors ${
                  active ? "text-white" : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          aria-label="Otvori meni"
          className="flex w-8 flex-col gap-1.5 lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-[1.5px] w-6 bg-white transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-[1.5px] w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-[1.5px] w-6 bg-white transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>

        {/* Sredina: auto iz logoa */}
        <Link href="/" aria-label="Exclusive Auto — početna" onClick={() => setOpen(false)}>
          <LogoMark className="h-7 w-auto text-white md:h-9" />
        </Link>

        {/* Desno: KM/EUR i sačuvana vozila */}
        <div className="flex items-center justify-end gap-5 md:gap-7">
          <CurrencyToggle className="hidden sm:flex" />
          <Link
            href="/sacuvana-vozila"
            aria-label="Sačuvana vozila"
            title="Sačuvana vozila"
            className={`transition-colors ${sacuvana ? "text-white" : "text-white/80 hover:text-white"}`}
          >
            <SrceIkonica className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-5 pb-5 lg:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-base text-white/85 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between py-3 sm:hidden">
            <span className="text-sm text-white/70">Prikaz cijena</span>
            <CurrencyToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
