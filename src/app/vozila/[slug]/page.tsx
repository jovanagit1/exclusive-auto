import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { vehicles, getVehicle, formatPrice } from "@/lib/vehicles";
import PlaceholderImage from "@/components/PlaceholderImage";

export function generateStaticParams() {
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return {};
  return {
    title: `${vehicle.marka} ${vehicle.model}`,
    description: vehicle.opis,
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const specs: [string, string][] = [
    ["Godište", String(vehicle.godiste)],
    ["Kilometraža", `${vehicle.km.toLocaleString("de-DE")} km`],
    ["Gorivo", vehicle.gorivo],
    ["Mjenjač", vehicle.mjenjac],
    ["Snaga", vehicle.snaga],
    ["Boja", vehicle.boja],
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <Link
        href="/vozila"
        className="text-xs uppercase tracking-wider text-muted hover:text-gold"
      >
        ← Sva vozila
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <PlaceholderImage
          label={`${vehicle.marka} ${vehicle.model}`}
          ratio="aspect-[4/3]"
        />

        <div>
          <p className="section-label">{vehicle.marka}</p>
          <h1 className="font-display mt-2 text-3xl">{vehicle.model}</h1>
          <p className="mt-4 text-2xl font-semibold text-gold">
            {formatPrice(vehicle.cijena, vehicle.valuta)}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-6">
            {specs.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs uppercase tracking-wider text-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-foreground/75">
            {vehicle.opis}
          </p>

          <ul className="mt-6 space-y-2">
            {vehicle.oprema.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-foreground/80"
              >
                <span className="h-1 w-1 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/probna-voznja" className="btn-primary">
              Zakaži probnu vožnju
            </Link>
            <Link href="/kontakt" className="btn-outline">
              Pošalji upit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
