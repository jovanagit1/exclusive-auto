import type { Metadata } from "next";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import ProdajVoziloForm from "@/components/ProdajVoziloForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prodaj ili zamijeni vozilo",
  description:
    "Prodajte svoje vozilo Exclusive Auto-u ili ga zamijenite za jedno iz naše ponude — bez obzira gdje živite, sve možete dogovoriti online.",
};

const prednosti = [
  {
    naslov: "Bez obzira gdje živite",
    opis: "Sve možete dogovoriti na daljinu — pošaljite podatke i fotografije, mi vas kontaktiramo sa procjenom i narednim koracima.",
  },
  {
    naslov: "Brza i poštena procjena",
    opis: "Pregledamo podatke o vašem vozilu i javljamo se sa realnom ponudom, bez skrivenih uslova.",
  },
  {
    naslov: "Prodaja ili zamjena — vi birate",
    opis: "Možete jednostavno prodati vozilo, ili ga zamijeniti za neko iz naše trenutne ponude uz doplatu ili povrat razlike.",
  },
];

export default async function ProdajVoziloPage() {
  const vehicles = await getVehicles();
  const vozilaZaZamjenu = vehicles.filter((v) => kategorijaVozila(v) === "ponuda").map((v) => ({
    slug: v.slug,
    naziv: `${v.marka} ${v.model} (${v.godiste})`,
  }));

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl *:max-w-4xl px-5 py-20 md:px-8 md:py-24">
          <p className="section-label">Otkup i zamjena vozila</p>
          <h1 className="font-display mt-3 text-4xl leading-tight">
            Prodaj ili zamijeni svoje vozilo — gdje god se nalazili
          </h1>
          <p className="mt-6 max-w-2xl text-foreground/75">
            Ne morate biti u Banjoj Luci da biste poslovali sa Exclusive
            Auto-om. Pošaljite nam osnovne podatke i par fotografija vašeg
            vozila — javljamo se sa procjenom, i zajedno dogovaramo da li
            vam više odgovara prodaja ili zamjena za neko od vozila iz naše
            ponude.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl *:max-w-4xl px-5 py-16 md:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {prednosti.map((p) => (
            <div key={p.naslov} className="card p-5">
              <h3 className="font-display text-base text-accent">{p.naslov}</h3>
              <p className="mt-2 text-sm text-foreground/70">{p.opis}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl *:max-w-4xl px-5 pb-24 md:px-8">
        <div className="card p-6 md:p-10">
          <ProdajVoziloForm vozilaZaZamjenu={vozilaZaZamjenu} />
        </div>
      </section>
    </div>
  );
}
