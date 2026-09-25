"use client";

import Link from "next/link";
import { useState } from "react";
import type { Vehicle } from "@/lib/vehicles";
import PriceTag from "./PriceTag";

/**
 * Tabela cjenovnika sa kvačicama — kad kupac na placu bira između par
 * vozila, Aco označi ta vozila i klikne "Štampaj odabrana": otvara se
 * uredna stranica za štampu/PDF sa slikom i osnovnim podacima svakog vozila.
 */
export default function CjenovnikTabela({ vehicles }: { vehicles: Vehicle[] }) {
  const [odabrana, setOdabrana] = useState<string[]>([]);
  const sveOdabrano = vehicles.length > 0 && odabrana.length === vehicles.length;

  function preklopi(slug: string) {
    setOdabrana((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  const linkZaStampu = `/cjenovnik/stampa?v=${odabrana.map(encodeURIComponent).join(",")}`;

  return (
    <div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-4 py-3 print:hidden">
        <p className="text-sm text-foreground/80">
          {odabrana.length === 0
            ? "Označite vozila za poređenje i štampu sa slikama."
            : `Odabrano vozila: ${odabrana.length}`}
        </p>
        <div className="flex flex-wrap gap-3">
          {odabrana.length > 0 && (
            <button
              type="button"
              onClick={() => setOdabrana([])}
              className="text-xs uppercase tracking-wider text-muted hover:text-accent"
            >
              Poništi izbor
            </button>
          )}
          {odabrana.length > 0 ? (
            <Link href={linkZaStampu} className="btn-primary">
              Štampaj / PDF odabranih ({odabrana.length})
            </Link>
          ) : (
            <span className="btn-primary cursor-not-allowed opacity-40">
              Štampaj / PDF odabranih
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto border border-border print:mt-0 print:border-black">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wider text-muted print:bg-white print:text-black">
              <th className="w-10 px-4 py-3 print:hidden">
                <input
                  type="checkbox"
                  aria-label="Odaberi sva vozila"
                  checked={sveOdabrano}
                  onChange={() =>
                    setOdabrana(sveOdabrano ? [] : vehicles.map((v) => v.slug))
                  }
                  className="accent-white"
                />
              </th>
              <th className="px-4 py-3">Vozilo</th>
              <th className="px-4 py-3">Godište</th>
              <th className="px-4 py-3">Kilometraža</th>
              <th className="px-4 py-3">Gorivo / Mjenjač</th>
              <th className="px-4 py-3 text-right">Cijena</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => {
              const oznaceno = odabrana.includes(v.slug);
              return (
                <tr
                  key={v.slug}
                  onClick={() => preklopi(v.slug)}
                  className={`cursor-pointer border-b border-border last:border-0 print:border-black ${
                    oznaceno ? "bg-surface-2" : "hover:bg-surface"
                  }`}
                >
                  <td className="px-4 py-3 print:hidden">
                    <input
                      type="checkbox"
                      aria-label={`Odaberi ${v.marka} ${v.model}`}
                      checked={oznaceno}
                      onChange={() => preklopi(v.slug)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-white"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/vozila/${v.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium hover:text-accent print:text-black"
                    >
                      {v.marka} {v.model}
                    </Link>
                    {v.kategorija === "posredovanje" && (
                      <span className="ml-2 text-[0.65rem] uppercase tracking-wider text-muted">
                        Posredovanje
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{v.godiste}</td>
                  <td className="px-4 py-3">{v.km.toLocaleString("de-DE")} km</td>
                  <td className="px-4 py-3">
                    {v.gorivo} · {v.mjenjac}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-accent print:text-black">
                    <PriceTag cijena={v.cijena} valuta={v.valuta} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {vehicles.length === 0 && (
          <p className="p-8 text-center text-sm text-muted">
            Trenutno nema vozila u ponudi.
          </p>
        )}
      </div>
    </div>
  );
}
