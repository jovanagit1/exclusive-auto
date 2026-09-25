import type { Metadata } from "next";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import { imaPristupSalonu } from "@/lib/salon";
import VozilaGrid from "@/components/VozilaGrid";
import VozilaTabs from "@/components/VozilaTabs";
import PremiumSignupForm from "@/components/PremiumSignupForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vozila u dolasku — privatni salon",
  description:
    "Vozila koja uskoro stižu u Exclusive Auto — dostupno samo članovima privatnog salona.",
  robots: { index: false, follow: false },
};

export default async function VozilaUDolaskuPage() {
  const [vehicles, otkljucano] = await Promise.all([getVehicles(), imaPristupSalonu()]);
  const lista = vehicles.filter((v) => kategorijaVozila(v) === "dolazak");

  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Privatni salon</p>
      <h1 className="font-display mt-3 text-4xl">Vozila u dolasku</h1>
      <p className="mt-4 max-w-2xl text-sm text-foreground/70">
        Vozila koja su na putu do nas — prije nego što se pojave u javnoj
        ponudi. Ovaj odjeljak vide samo članovi privatnog salona.
      </p>

      <VozilaTabs aktivna="dolazak" vozila={vehicles} otkljucano={otkljucano} />

      {otkljucano ? (
        <div className="mt-8">
          {lista.length === 0 ? (
            <p className="text-sm text-foreground/70">
              Trenutno nema najavljenih vozila — čim nešto krene ka nama,
              javljamo vam mejlom.
            </p>
          ) : (
            <VozilaGrid vehicles={lista} />
          )}
        </div>
      ) : (
        <div className="card mt-10 grid gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:p-10">
          <div>
            <div className="flex items-center gap-3 text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-6 w-6">
                <rect x="5" y="11" width="14" height="10" rx="1.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-[0.25em]">Samo za članove</p>
            </div>
            <h2 className="font-display mt-4 text-2xl">
              {lista.length > 0
                ? `${lista.length} ${lista.length === 1 ? "vozilo stiže" : lista.length < 5 ? "vozila stižu" : "vozila stiže"} uskoro`
                : "Budite prvi koji saznaju"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/70">
              Prijavite se besplatno u privatni salon Exclusive Auto: odmah
              dobijate pristup vozilima u dolasku, a o svakom novom vozilu
              obavještavamo vas mejlom prije svih ostalih.
            </p>
            <p className="mt-4 text-xs text-muted">
              Već ste član? Otvorite lični link iz mejla dobrodošlice, ili
              upišite svoju adresu ponovo — pristup će se otključati.
            </p>
          </div>
          <div className="self-center">
            <PremiumSignupForm />
          </div>
        </div>
      )}
    </div>
  );
}
