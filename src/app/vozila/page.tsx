import type { Metadata } from "next";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import { imaPristupSalonu } from "@/lib/salon";
import VozilaGrid from "@/components/VozilaGrid";
import VozilaTabs from "@/components/VozilaTabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Polovna auta u ponudi",
  description:
    "Pregledajte trenutnu ponudu polovnih auta i automobila Exclusive Auto u Banjoj Luci — sortiranje po cijeni i godištu.",
};

export default async function VozilaPage() {
  const [vehicles, otkljucano] = await Promise.all([getVehicles(), imaPristupSalonu()]);
  const ponuda = vehicles.filter((v) => kategorijaVozila(v) === "ponuda");

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Ponuda</p>
      <h1 className="font-display mt-3 text-4xl">Vozila u ponudi</h1>
      <p className="mt-4 max-w-2xl text-sm text-foreground/70">
        Ne vidite vozilo koje tražite? Pošaljite nam upit za uvoz i
        pronaći ćemo ga po vašoj želji.
      </p>

      <VozilaTabs aktivna="ponuda" vozila={vehicles} otkljucano={otkljucano} />

      <div className="mt-8">
        <VozilaGrid vehicles={ponuda} />
      </div>
    </div>
  );
}
