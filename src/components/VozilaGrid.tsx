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

export default function VozilaGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const [sortiranje, setSortiranje] = useState<Sortiranje>("podrazumijevano");
  const [odabraneMarke, setOdabraneMarke] = useState<string[]>([]);

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

  function preklopiMarku(k: string) {
    setOdabraneMarke((prev) =>
      prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]
    );
  }

  const sortirana = useMemo(() => {
    const kopija =
      odabraneMarke.length === 0
        ? [...vehicles]
        : vehicles.filter((v) => odabraneMarke.includes(kljucMarke(v.marka)));
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
  }, [vehicles, sortiranje, odabraneMarke]);

  return (
    <div>
      {marke.length > 1 && (
        <div className="mb-6">
          <p className="mb-3 text-xs uppercase tracking-wider text-muted">Marka</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOdabraneMarke([])}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                odabraneMarke.length === 0
                  ? "border-accent bg-accent text-background"
                  : "border-border text-foreground/80 hover:border-accent"
              }`}
            >
              Sve marke <span className="opacity-60">({vehicles.length})</span>
            </button>
            {marke.map((m) => {
              const aktivna = odabraneMarke.includes(m.kljuc);
              return (
                <button
                  key={m.kljuc}
                  type="button"
                  aria-pressed={aktivna}
                  onClick={() => preklopiMarku(m.kljuc)}
                  className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                    aktivna
                      ? "border-accent bg-accent text-background"
                      : "border-border text-foreground/80 hover:border-accent"
                  }`}
                >
                  {m.naziv} <span className="opacity-60">({m.broj})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
        <p className="text-xs text-muted">
          {sortirana.length === vehicles.length
            ? `${vehicles.length} ${vehicles.length === 1 ? "vozilo" : "vozila"} u ponudi`
            : `Prikazano ${sortirana.length} od ${vehicles.length} vozila`}
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
