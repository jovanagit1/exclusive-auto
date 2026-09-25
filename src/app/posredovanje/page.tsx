import type { Metadata } from "next";
import Link from "next/link";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import { imaPristupSalonu } from "@/lib/salon";
import VozilaGrid from "@/components/VozilaGrid";
import VozilaTabs from "@/components/VozilaTabs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vozila u posredovanju",
  description:
    "Vozila privatnih vlasnika koja Exclusive Auto prodaje posredstvom — provjerena i prezentovana na jednom mjestu.",
};

export default async function PosredovanjePage() {
  const [vehicles, otkljucano] = await Promise.all([getVehicles(), imaPristupSalonu()]);
  const lista = vehicles.filter((v) => kategorijaVozila(v) === "posredovanje");

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Posredovanje</p>
      <h1 className="font-display mt-3 text-4xl">Vozila u posredovanju</h1>
      <p className="mt-4 max-w-2xl text-sm text-foreground/70">
        Vozila privatnih vlasnika koja prodajemo u njihovo ime. Nisu dio
        naše salonske ponude, ali ih pregledamo i predstavljamo jednako
        pažljivo. Želite i vi da prodate svoje vozilo preko nas?{" "}
        <Link href="/prodaj-vozilo" className="text-accent underline underline-offset-4">
          Pošaljite ga na procjenu
        </Link>
        .
      </p>

      <VozilaTabs aktivna="posredovanje" vozila={vehicles} otkljucano={otkljucano} />

      <div className="mt-8">
        {lista.length === 0 ? (
          <p className="text-sm text-foreground/70">Trenutno nema vozila u posredovanju.</p>
        ) : (
          <VozilaGrid vehicles={lista} />
        )}
      </div>
    </div>
  );
}
