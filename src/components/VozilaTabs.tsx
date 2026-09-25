import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles";
import { kategorijaVozila } from "@/lib/vehicles";

/**
 * Kartice na vrhu stranica sa vozilima: Salonska ponuda · Posredovanje ·
 * Vozila u dolasku (samo za članove privatnog salona).
 */
export default function VozilaTabs({
  aktivna,
  vozila,
  otkljucano,
}: {
  aktivna: "ponuda" | "posredovanje" | "dolazak";
  vozila: Vehicle[];
  otkljucano: boolean;
}) {
  const broj = (k: string) => vozila.filter((v) => kategorijaVozila(v) === k).length;
  const kartice = [
    { k: "ponuda", href: "/vozila", naziv: "Salonska ponuda", n: broj("ponuda") },
    { k: "posredovanje", href: "/posredovanje", naziv: "Posredovanje", n: broj("posredovanje") },
    { k: "dolazak", href: "/vozila-u-dolasku", naziv: "Vozila u dolasku", n: broj("dolazak") },
  ].filter((t) => t.k !== "posredovanje" || t.n > 0 || aktivna === "posredovanje");

  return (
    <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-b border-border">
      {kartice.map((t) => {
        const jeAktivna = t.k === aktivna;
        return (
          <Link
            key={t.k}
            href={t.href}
            className={`-mb-px flex items-center gap-2 border-b-2 pb-3 text-sm uppercase tracking-wider transition-colors ${
              jeAktivna
                ? "border-accent text-accent"
                : "border-transparent text-foreground/60 hover:text-accent"
            }`}
          >
            {t.k === "dolazak" && !otkljucano && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                <rect x="5" y="11" width="14" height="10" rx="1.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
              </svg>
            )}
            {t.naziv}
            <span className="text-xs opacity-60">({t.n})</span>
          </Link>
        );
      })}
    </nav>
  );
}
