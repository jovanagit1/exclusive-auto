import Link from "next/link";
import { kategorijaVozila, type Vehicle } from "@/lib/vehicles";
import VehicleImage from "./VehicleImage";
import FavoriteButton from "./FavoriteButton";
import PriceTag from "./PriceTag";

/** Kartica vozila — čist, svijetao stil: slika, marka, model, podaci, cijena. */
export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const naAkciji = Boolean(vehicle.akcija && vehicle.regularnaCijena);

  return (
    <Link href={`/vozila/${vehicle.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <VehicleImage
          slike={vehicle.slike}
          label={`${vehicle.marka} ${vehicle.model}`}
          className="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {kategorijaVozila(vehicle) !== "ponuda" && (
          <span className="absolute bottom-3 left-3 bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-foreground">
            {kategorijaVozila(vehicle) === "dolazak" ? "U dolasku" : "Posredovanje"}
          </span>
        )}
        {naAkciji && (
          <span className="absolute left-3 top-3 bg-red-600 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white">
            Akcija
          </span>
        )}
        <FavoriteButton slug={vehicle.slug} size="sm" className="absolute right-3 top-3" />
      </div>
      <div className="pt-5">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">{vehicle.marka}</p>
        <h3 className="mt-1.5 text-lg font-medium text-foreground">{vehicle.model}</h3>
        <p className="mt-2 text-[0.8rem] text-muted">
          {vehicle.godiste} · {vehicle.km.toLocaleString("de-DE")} km · {vehicle.gorivo} · {vehicle.mjenjac}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
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
                className="text-lg font-semibold text-red-600"
              />
            </span>
          ) : (
            <PriceTag cijena={vehicle.cijena} valuta={vehicle.valuta} className="text-lg font-semibold text-foreground" />
          )}
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/80 transition-colors group-hover:text-foreground">
            Detalji →
          </span>
        </div>
      </div>
    </Link>
  );
}
