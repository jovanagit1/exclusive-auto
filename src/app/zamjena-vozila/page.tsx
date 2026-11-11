import type { Metadata } from "next";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import ProdajVoziloForm from "@/components/ProdajVoziloForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Zamjena vozila — staro za novo uz doplatu, Banja Luka",
  description:
    "Zamijenite svoje vozilo za auto iz ponude Exclusive Auto-a i doplatite samo razliku. Pošaljite podatke i fotografije, a mi vam se javljamo sa procjenom.",
  alternates: { canonical: "/zamjena-vozila" },
};

const koraci = [
  {
    broj: "01",
    naslov: "Izaberite auto iz ponude",
    opis: "Pronađite vozilo koje vam se sviđa. Ako još birate, preporučićemo vam nešto u vašem budžetu.",
  },
  {
    broj: "02",
    naslov: "Pošaljite podatke o svom vozilu",
    opis: "Osnovni podaci i par fotografija su dovoljni. Javljamo se sa realnom procjenom, bez skrivenih uslova.",
  },
  {
    broj: "03",
    naslov: "Doplatite samo razliku",
    opis: "Vaše vozilo ulazi u cijenu novog, a vi doplaćujete razliku. Papirologiju završavamo mi.",
  },
];

export default async function ZamjenaVozilaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { vozilo } = await searchParams;
  const vehicles = await getVehicles();
  const vozilaZaZamjenu = vehicles
    .filter((v) => kategorijaVozila(v) === "ponuda")
    .map((v) => ({ slug: v.slug, naziv: `${v.marka} ${v.model} (${v.godiste})` }));
  const pocetno =
    typeof vozilo === "string" && vozilaZaZamjenu.some((v) => v.slug === vozilo) ? vozilo : "";

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl *:max-w-4xl px-5 py-20 md:px-8 md:py-24">
          <p className="section-label">Zamjena vozila</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
            Zamijenite svoje auto za novo — uz doplatu razlike
          </h1>
          <p className="mt-6 max-w-2xl text-foreground/75">
            Vaše sadašnje vozilo može biti dio cijene novog. Izaberite auto iz
            naše ponude, pošaljite podatke o svom vozilu, a mi vam se javljamo
            sa procjenom i iznosom doplate. Sve se može dogovoriti i na
            daljinu, gdje god se nalazili.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl *:max-w-4xl px-5 py-16 md:px-8">
        <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-3">
          {koraci.map((k) => (
            <div key={k.broj} className="bg-background p-6 md:p-8">
              <p className="font-display text-3xl text-foreground/25">{k.broj}</p>
              <h3 className="mt-4 text-base font-semibold text-foreground">{k.naslov}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{k.opis}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl *:max-w-4xl px-5 pb-24 md:px-8">
        <div className="card p-6 md:p-10">
          <ProdajVoziloForm vozilaZaZamjenu={vozilaZaZamjenu} pocetnoVozilo={pocetno} />
        </div>
      </section>
    </div>
  );
}
