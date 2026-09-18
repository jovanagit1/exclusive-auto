import type { Metadata } from "next";
import { vehicles } from "@/lib/vehicles";
import VehicleCard from "@/components/VehicleCard";

export const metadata: Metadata = {
  title: "Vozila u ponudi",
  description: "Pregledajte trenutnu ponudu vozila Exclusive Auto.",
};

export default function VozilaPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Ponuda</p>
      <h1 className="font-display mt-3 text-4xl">Vozila u ponudi</h1>
      <p className="mt-4 max-w-2xl text-sm text-foreground/70">
        Ne vidite vozilo koje tražite? Pošaljite nam upit za uvoz i
        pronaći ćemo ga po vašoj želji.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v) => (
          <VehicleCard key={v.slug} vehicle={v} />
        ))}
      </div>
    </div>
  );
}
