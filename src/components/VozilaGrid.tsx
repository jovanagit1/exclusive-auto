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
const kljucMarke = (m: string) => m.trim().toLowerCase();

/** Tanka strelica za padajuće menije (umjesto sistemske). */
function Strelica() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
    </svg>
  );
}

export default function VozilaGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [sortiranje, setSortiranje] = useState<Sortiranje>("podrazumijevano");
  const [marka, setMarka] = useState<string>(""); // "" = sve marke

  // Filter marki se pravi AUTOMATSKI samo od marki koje trenutno imamo u
  // ponudi (sa brojem vozila) — kad se doda/obriše vozilo, filter se sam
  // ažurira, isto kao i cjenovnik.
  const marke = useMemo(() => {
    const mapa = new Map<string, { naziv: string; broj: number }>();
    for (const v of vehicles) {
      const k = kljucMarke(v.marka);
      if (!k) continue;
      const postojeca = mapa.get(k);
      if (postojeca) postojeca.broj++;
      else mapa.set(k, { naziv: v.marka.trim(), broj: 1 });
    }
    return [...mapa.entries()]
      .map(([kljuc, x]) => ({ kljuc, ...x }))
      .sort((a, b) => a.naziv.localeCompare(b.naziv, "bs"));
  }, [vehicles]);

  const sortirana = useMemo(() => {
    const kopija =
      marka === ""
        ? [...vehicles]
        : vehicles.filter((v) => kljucMarke(v.marka) === marka);
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
  }, [vehicles, sortiranje, marka]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <p className="text-xs text-muted">
          {sortirana.length === vehicles.length
            ? `${vehicles.length} ${vehicles.length === 1 ? "vozilo" : "vozila"} u ponudi`
            : `Prikazano ${sortirana.length} od ${vehicles.length} vozila`}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {marke.length > 1 && (
            <label className="flex items-center gap-2 text-xs">
              <span className="uppercase tracking-wider text-muted">Marka:</span>
              <span className="relative">
                <select
                  value={marka}
                  onChange={(e) => setMarka(e.target.value)}
                  className="input-field w-auto cursor-pointer appearance-none py-2 pr-9 text-xs"
                >
                  <option value="">Sve marke ({vehicles.length})</option>
                  {marke.map((m) => (
                    <option key={m.kljuc} value={m.kljuc}>
                      {m.naziv} ({m.broj})
                    </option>
                  ))}
                </select>
                <Strelica />
              </span>
            </label>
          )}
          <label className="flex items-center gap-2 text-xs">
            <span className="uppercase tracking-wider text-muted">Sortiraj:</span>
            <span className="relative">
              <select
                value={sortiranje}
                onChange={(e) => setSortiranje(e.target.value as Sortiranje)}
                className="input-field w-auto cursor-pointer appearance-none py-2 pr-9 text-xs"
              >
                {OPCIJE_SORTIRANJA.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <Strelica />
            </span>
          </label>
        </div>
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
