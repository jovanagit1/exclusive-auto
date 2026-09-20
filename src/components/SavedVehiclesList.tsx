"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import type { Vehicle } from "@/lib/vehicles";
import VehicleCard from "./VehicleCard";

/**
 * Klijentska komponenta — dobija SVA vozila sa sajta (server je već učitao),
 * a onda ih ovdje, u browseru, filtrira po listi slug-ova sačuvanoj u
 * localStorage-u (useFavorites). Ovo mora biti klijentska komponenta jer
 * localStorage postoji samo u browseru posjetioca, ne na serveru.
 */
export default function SavedVehiclesList({ sva }: { sva: Vehicle[] }) {
  const { sacuvana, spremno } = useFavorites();

  if (!spremno) {
    return null;
  }

  const sacuvanaVozila = sva.filter((v) => sacuvana.includes(v.slug));

  if (sacuvanaVozila.length === 0) {
    return (
      <div className="card mt-10 p-10 text-center">
        <p className="text-sm text-foreground/70">
          Još uvijek niste sačuvali nijedno vozilo. Kliknite na ikonicu srca
          na kartici vozila da ga dodate ovdje.
        </p>
        <Link href="/vozila" className="btn-primary mt-6 inline-flex">
          Pregledaj ponudu
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sacuvanaVozila.map((v) => (
        <VehicleCard key={v.slug} vehicle={v} />
      ))}
    </div>
  );
}
