import type { Metadata } from "next";
import Link from "next/link";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import VehicleCard from "@/components/VehicleCard";
import HeroSlideshow, { type HeroSlajd } from "@/components/HeroSlideshow";
import VipZnak from "@/components/VipZnak";
import { U_DOLASKU_AKTIVNO } from "@/lib/u-dolasku";

export const dynamic = "force-dynamic";

// Naslov i opis početne dolaze iz layout.tsx; ovdje samo kanonski link.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const usluge = [
  {
    naslov: "Uvoz vozila",
    opis: "Nađemo i dovezemo auto po vašoj želji iz Evrope.",
    link: "Pošalji upit",
    href: "/uvoz",
  },
  {
    naslov: "Lizing i kredit",
    opis: "Izračunajte mjesečnu ratu za svako vozilo iz ponude.",
    link: "Pogledaj vozila",
    href: "/vozila",
  },
  {
    naslov: "Registracija",
    opis: "Registraciju i prepis vozila završavamo umjesto vas.",
    link: "Saznaj više",
    href: "/registracija",
  },
  {
    naslov: "Priprema vozila",
    opis: "Svako auto prolazi detailing i poliranje prije prodaje.",
    link: "Saznaj više",
    href: "/usluge",
  },
];

const brojke = [
  { vrijednost: "A+", opis: "Bonitetna ocjena" },
  { vrijednost: "10+", opis: "Godina iskustva" },
  { vrijednost: "5000+", opis: "Zadovoljnih kupaca" },
];

export default async function HomePage() {
  const vehicles = (await getVehicles()).filter((v) => kategorijaVozila(v) === "ponuda");
  const featured = vehicles.filter((v) => v.istaknuto);
  // Na početnoj samo nekoliko vozila (izdvojena, a ako ih nema — najnovija).
  const izdvojena = (featured.length ? featured : vehicles).slice(0, 3);
  // Sva vozila iz ponude koja imaju bar jednu fotografiju — najnovija prva.
  const slajdovi: HeroSlajd[] = vehicles
    .filter((v) => v.slike?.[0])
    .map((v) => ({
      slika: v.slike![0],
      naziv: `${v.marka} ${v.model}`,
      godiste: v.godiste,
      cijena: v.cijena,
      valuta: v.valuta,
      slug: v.slug,
    }));

  return (
    <div>
      {/* VIDEO / SLAJD ŠOU — tamni dio na vrhu */}
      <HeroSlideshow slajdovi={slajdovi} />

      {/* IZDVOJENA VOZILA */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <p className="section-label">Izdvojeno</p>
        <h2 className="font-display mt-3 text-3xl md:text-[2.6rem]">Trenutno u ponudi</h2>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {izdvojena.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/vozila" className="btn-outline">
            Sva vozila
          </Link>
        </div>
      </section>

      {/* BROJKE */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 border-y border-border sm:grid-cols-3">
          {brojke.map((b, i) => (
            <div
              key={b.opis}
              className={`px-6 py-12 text-center md:py-14 ${i > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""}`}
            >
              <p className="font-display text-5xl text-foreground md:text-6xl">{b.vrijednost}</p>
              <p className="mt-3 text-[0.7rem] uppercase tracking-[0.3em] text-muted">{b.opis}</p>
            </div>
          ))}
        </div>
      </section>

      {/* USLUGE */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
        <p className="section-label">Usluge</p>
        <h2 className="font-display mt-3 text-3xl md:text-[2.6rem]">Sve za vaše auto na jednom mjestu</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {usluge.map((u) => (
            <Link
              key={u.naslov}
              href={u.href}
              className="usluga-prozor tamno group relative flex min-h-[19rem] flex-col justify-end overflow-hidden p-7 md:min-h-[24rem]"
            >
              <h3 className="text-2xl font-normal text-white">{u.naslov}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{u.opis}</p>
              <span className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white">
                {u.link} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* EXCLUSIVE AUTO VIP — vozila u dolasku (prikazuje se samo dok je odjeljak uključen) */}
      {U_DOLASKU_AKTIVNO && (
        <section className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
            <div className="max-w-xl">
              <p className="text-xs text-accent"><VipZnak /></p>
              <h2 className="font-display mt-2 text-3xl">Vozila u dolasku — samo za VIP članove</h2>
            </div>
            <Link href="/vozila-u-dolasku" className="btn-outline shrink-0">
              Postani VIP član
            </Link>
          </div>
        </section>
      )}

      {/* PRODAJ/ZAMIJENI VOZILO */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-xl">
            <p className="section-label">Za vlasnike vozila</p>
            <h2 className="font-display mt-3 text-2xl md:text-3xl">Prodaj ili zamijeni svoje vozilo</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Pošaljite podatke i fotografije vašeg vozila — javljamo se sa procjenom, a vi
              birate prodaju ili zamjenu za vozilo iz naše ponude.
            </p>
          </div>
          <Link href="/prodaj-vozilo" className="btn-primary shrink-0">
            Prodaj ili zamijeni
          </Link>
        </div>
      </section>

      {/* SEO — prirodan tekst koji Google čita i povezuje sa pretragama
          poput "auta banja luka", "prodaja automobila banja luka", "auto
          salon banja luka", "prodaja polovnih auta", "uvoz auta iz
          austrije"… Pisano za ljude, bez nabijanja ključnih riječi. */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl *:max-w-3xl px-5 py-16 md:px-8">
          <p className="section-label">Auto salon Banja Luka</p>
          <h2 className="font-display mt-2 text-2xl">
            Prodaja novih i polovnih automobila u Banjoj Luci
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-foreground/70">
            Exclusive Auto je auto salon u Banjoj Luci za prodaju novih i
            polovnih automobila iz Evrope. U ponudi su provjerena auta — od
            porodičnih modela kao što su Kia, Peugeot i Citroën, do premium
            vozila marki Mercedes-Benz, BMW, Audi i Volvo. Uz svako auto
            dobijate pismenu garanciju na porijeklo i tačnost pređenih
            kilometara.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/70">
            Kupcima iz Banje Luke i cijele Bosne i Hercegovine nudimo lizing i
            kredit, kompletnu registraciju i prepis vozila, kao i dostavu auta
            na kućnu adresu. Ako živite u Austriji, Njemačkoj ili drugoj zemlji
            EU, ponudu automobila možete pregledati online i sve dogovoriti
            telefonom ili mejlom.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/70">
            Tražite konkretan model? Uvozimo automobile po narudžbi iz
            Njemačke, Austrije, Francuske, Italije i Švajcarske — ključ u
            ruke, od pretrage i provjere do carine i registracije.
          </p>
        </div>
      </section>

    </div>
  );
}
