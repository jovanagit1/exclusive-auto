import Link from "next/link";
import { Vehicle, formatPrice } from "@/lib/vehicles";
import PlaceholderImage from "./PlaceholderImage";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/vozila/${vehicle.slug}`}
      className="card group block overflow-hidden transition-colors hover:border-gold"
    >
      <PlaceholderImage label={`${vehicle.marka} ${vehicle.model}`} />
      <div className="p-5">
        <p className="text-xs uppercase tracking-widest text-muted">
          {vehicle.godiste} · {vehicle.km.toLocaleString("de-DE")} km · {vehicle.gorivo}
        </p>
        <h3 className="mt-2 font-display text-lg text-foreground">
          {vehicle.marka} {vehicle.model}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-gold">
            {formatPrice(vehicle.cijena, vehicle.valuta)}
          </span>
          <span className="text-xs uppercase tracking-wider text-foreground/70 group-hover:text-gold">
            Detalji →
          </span>
        </div>
      </div>
    </Link>
  );
}
