"use client";

import { useMemo, useState } from "react";
import type { Vehicle } from "@/lib/vehicles";
import VehicleCard from "./VehicleCard";

type Sortiranje =
  | "podrazumijevano"
  | "cijena-rastuce"
  | "cijena-opadajuce"
  | "godiste-najnovije"
  | "godiste-najstarije";

const OPCIJE_SORTIRANJA: { value: Sortiranje; label: string }[] = [
  { value: "podrazumijevano", label: "Podrazumijevano" },
  { value: "cijena-opadajuce", label: "Cijena: od najskupljih" },
  { value: "cijena-rastuce", label: "Cijena: od najjeftinijih" },
  { value: "godiste-najnovije", label: "Godište: najnovija prvo" },
  { value: "godiste-najstarije", label: "Godište: najstarija prvo" },
];

/**
 * Klijentska komponenta koja prima svu vozila sa servera (getVehicles) i
 * omogućava posjetiocu sortiranje po cijeni ili godištu, bez dodatnog
 * pozivanja servera — cijela lista je već tu, samo je preslažemo.
 */
export default function VozilaGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [sortiranje, setSortiranje] = useState<Sortiranje>("podrazumijevano");

  const sortirana = useMemo(() => {
    const kopija = [...vehicles];
    switch (sortiranje) {
      case "cijena-rastuce":
        return kopija.sort((a, b) => a.cijena - b.cijena);
      case "cijena-opadajuce":
        return kopija.sort((a, b) => b.cijena - a.cijena);
      case "godiste-najnovije":
        return kopija.sort((a, b) => b.godiste - a.godiste);
      case "godiste-najstarije":
        return kopija.sort((a, b) => a.godiste - b.godiste);
      default:
        return kopija;
    }
  }, [vehicles, sortiranje]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <p className="text-xs text-muted">
          {vehicles.length} {vehicles.length === 1 ? "vozilo" : "vozila"} u ponudi
        </p>
        <label className="flex items-center gap-2 text-xs">
          <span className="uppercase tracking-wider text-muted">Sortiraj:</span>
          <select
            value={sortiranje}
            onChange={(e) => setSortiranje(e.target.value as Sortiranje)}
            className="input-field w-auto py-2 text-xs"
          >
            {OPCIJE_SORTIRANJA.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sortirana.length === 0 ? (
        <p className="mt-10 text-sm text-foreground/70">
          Trenutno nema vozila u ponudi — pošaljite nam upit za uvoz i
          pronaći ćemo vozilo po vašoj želji.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortirana.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}
