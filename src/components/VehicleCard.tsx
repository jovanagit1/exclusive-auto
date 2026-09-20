import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles";
import VehicleImage from "./VehicleImage";
import FavoriteButton from "./FavoriteButton";
import PriceTag from "./PriceTag";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const naAkciji = Boolean(vehicle.akcija && vehicle.regularnaCijena);

  return (
    <Link
      href={`/vozila/${vehicle.slug}`}
      className="card group block overflow-hidden transition-colors hover:border-accent"
    >
      <div className="relative">
        <VehicleImage slike={vehicle.slike} label={`${vehicle.marka} ${vehicle.model}`} />
        {naAkciji && (
          <span className="absolute left-2 top-2 rounded-sm bg-red-500 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
            Akcija
          </span>
        )}
        <FavoriteButton
          slug={vehicle.slug}
          size="sm"
          className="absolute right-2 top-2"
        />
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-muted">
          {vehicle.godiste} · {vehicle.km.toLocaleString("de-DE")} km · {vehicle.gorivo}
        </p>
        <h3 className="mt-2 font-display text-lg text-foreground">
          {vehicle.marka} {vehicle.model}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          {naAkciji ? (
            <span className="flex flex-wrap items-baseline gap-2">
              <PriceTag
                cijena={vehicle.regularnaCijena!}
                valuta={vehicle.valuta}
                className="text-xs text-muted line-through"
              />
              <PriceTag
                cijena={vehicle.cijena}
                valuta={vehicle.valuta}
                className="text-lg font-semibold text-red-400"
              />
            </span>
          ) : (
            <PriceTag
              cijena={vehicle.cijena}
              valuta={vehicle.valuta}
              className="text-lg font-semibold text-accent"
            />
          )}
          <span className="text-xs uppercase tracking-wider text-foreground/70 group-hover:text-accent">
            Detalji →
          </span>
        </div>
      </div>
    </Link>
  );
}
