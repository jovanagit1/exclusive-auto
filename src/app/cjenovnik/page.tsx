import type { Metadata } from "next";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import PrintButton from "@/components/PrintButton";
import CjenovnikTabela from "@/components/CjenovnikTabela";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cjenovnik",
  description:
    "Cjenovnik polovnih vozila Exclusive Auto Banja Luka — sva vozila i cijene na jednom mjestu.",
};

export default async function CjenovnikPage() {
  const vehicles = (await getVehicles()).filter((v) => kategorijaVozila(v) !== "dolazak");

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="section-label">Sveska ponude</p>
          <h1 className="font-display mt-2 text-4xl">Cjenovnik</h1>
          <p className="mt-3 max-w-xl text-sm text-foreground/70">
            Kompletan pregled svih vozila u ponudi — pogodno za štampu ili
            čuvanje kao PDF.
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="mb-10 hidden print:block">
        <h1 className="font-display text-2xl">Exclusive Auto — Cjenovnik</h1>
        <p className="text-xs text-muted">
          {new Date().toLocaleDateString("bs-BA")}
        </p>
      </div>

      <CjenovnikTabela vehicles={vehicles} />
    </div>
  );
}
