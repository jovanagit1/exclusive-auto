import type { Metadata } from "next";
import { getVehicles } from "@/lib/store";
import SavedVehiclesList from "@/components/SavedVehiclesList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sačuvana vozila",
  description: "Vozila koja ste sačuvali za kasnije razgledanje.",
};

export default async function SacuvanaVozilaPage() {
  const vehicles = await getVehicles();

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Vaš izbor</p>
      <h1 className="font-display mt-3 text-4xl">Sačuvana vozila</h1>
      <p className="mt-4 max-w-2xl text-sm text-foreground/70">
        Vozila koja ste označili srcem dok ste razgledali ponudu — sačuvana su
        samo na ovom uređaju i u ovom browseru.
      </p>

      <SavedVehiclesList sva={vehicles} />
    </div>
  );
}
