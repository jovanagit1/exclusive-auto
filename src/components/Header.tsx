"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Početna" },
  { href: "/vozila", label: "Vozila" },
  { href: "/cjenovnik", label: "Cjenovnik" },
  { href: "/usluge", label: "Usluge" },
  { href: "/galerija", label: "Galerija" },
  { href: "/o-nama", label: "O nama" },
  { href: "/kontakt", label: "Kontakt" },
];

function SrceIkonica({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.727c-.246 0-.492-.086-.687-.259C7.94 17.516 3 12.94 3 9.03 3 6.256 5.153 4 7.813 4c1.532 0 2.9.79 3.75 1.997A4.53 4.53 0 0 1 15.312 4C17.973 4 20.125 6.256 20.125 9.03c0 3.91-4.94 8.487-8.313 11.438a1.03 1.03 0 0 1-.687.259Z"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo className="h-14 w-auto text-white sm:h-16" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-wider transition-colors ${
                  active ? "text-accent" : "text-foreground/80 hover:text-accent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/sacuvana-vozila"
          aria-label="Sačuvana vozila"
          title="Sačuvana vozila"
          className={`hidden items-center transition-colors md:flex ${
            pathname.startsWith("/sacuvana-vozila")
              ? "text-accent"
              : "text-foreground/80 hover:text-accent"
          }`}
        >
          <SrceIkonica className="h-5 w-5" />
        </Link>

        <Link href="/probna-voznja" className="btn-primary hidden md:inline-flex">
          Zakaži vožnju
        </Link>

        <button
          type="button"
          aria-label="Otvori meni"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-[1.5px] w-6 bg-foreground transition-transform ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-6 bg-foreground transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[1.5px] w-6 bg-foreground transition-transform ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 pb-5 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-wider text-foreground/85 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/sacuvana-vozila"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 py-3 text-sm uppercase tracking-wider text-foreground/85 hover:text-accent"
          >
            <SrceIkonica className="h-4 w-4" />
            Sačuvana vozila
          </Link>
          <Link
            href="/probna-voznja"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 justify-center"
          >
            Zakaži vožnju
          </Link>
        </nav>
      )}
    </header>
  );
}
