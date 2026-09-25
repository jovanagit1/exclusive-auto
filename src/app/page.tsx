import Link from "next/link";
import { getVehicles } from "@/lib/store";
import { kategorijaVozila } from "@/lib/vehicles";
import VehicleCard from "@/components/VehicleCard";
import PlaceholderImage from "@/components/PlaceholderImage";
import VipZnak from "@/components/VipZnak";

export const dynamic = "force-dynamic";

const services = [
  {
    title: "Uvoz vozila",
    desc: "Pronalazimo i uvozimo vozilo po vašoj želji iz Njemačke, Austrije, Švicarske i drugih tržišta.",
    href: "/uvoz",
  },
  {
    title: "Registracija vozila",
    desc: "Kompletna registracija i carinjenje vozila, bez čekanja u redovima.",
    href: "/registracija",
  },
  {
    title: "Detailing i poliranje",
    desc: "Profesionalna hemijska priprema, poliranje i zaštita laka do visokog sjaja.",
    href: "/usluge",
  },
  {
    title: "Zatamnjenje stakala",
    desc: "Ugradnja folije u skladu sa zakonski dozvoljenom svjetlopropusnosti.",
    href: "/usluge",
  },
];

export default async function HomePage() {
  const vehicles = (await getVehicles()).filter((v) => kategorijaVozila(v) === "ponuda");
  const featured = vehicles.filter((v) => v.istaknuto);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 accent-gradient opacity-[0.06]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 py-20 md:flex-row md:items-center md:px-8 md:py-28">
          <div className="max-w-xl">
            <p className="section-label">Exclusive Auto · Banja Luka</p>
            <h1 className="font-display mt-4 text-4xl leading-tight text-foreground md:text-5xl">
              Vozila birana sa pažnjom.
              <br />
              Iskustvo dostojno vašeg ukusa.
            </h1>
            <p className="mt-6 text-foreground/75">
              Uvoz, prodaja i priprema polovnih vozila iz Evrope. Svako
              vozilo prolazi kroz detaljnu kontrolu i pripremu prije nego
              stigne do vas.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/vozila" className="btn-primary">
                Pogledaj ponudu
              </Link>
              <Link href="/probna-voznja" className="btn-outline">
                Zakaži probnu vožnju
              </Link>
            </div>
          </div>

          <div className="flex-1">
            <PlaceholderImage
              label="Showroom Exclusive Auto"
              ratio="aspect-[16/10]"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label">Trenutna ponuda</p>
            <h2 className="font-display mt-2 text-3xl">Izdvojena vozila</h2>
          </div>
          <Link href="/vozila" className="btn-outline">
            Sva vozila
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(featured.length ? featured : vehicles).map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8">
          <p className="section-label">Naše usluge</p>
          <h2 className="font-display mt-2 max-w-lg text-3xl">
            Sve na jednom mjestu — od uvoza do registracije
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="card group p-6 transition-colors hover:border-accent"
              >
                <h3 className="font-display text-lg text-foreground group-hover:text-accent">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/70">{s.desc}</p>
              </Link>
            ))}
          </div>

          <p className="disclaimer mt-8 max-w-2xl">
            Napomena: usluge poliranja, detailinga i zatamnjenja stakala su
            usluge pripreme i dorade vozila i izvode se u skladu sa važećim
            zakonskim propisima o dozvoljenoj svjetlopropusnosti stakala.
          </p>
        </div>
      </section>

      {/* EXCLUSIVE AUTO VIP — vozila u dolasku */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-xl">
            <p className="text-xs text-accent"><VipZnak /></p>
            <h2 className="font-display mt-2 text-3xl">Vozila u dolasku — samo za VIP članove</h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              Postanite besplatno član EXCLUSIVE AUTO VIP i vidite vozila koja
              su na putu do nas, prije nego što se pojave u javnoj ponudi. O
              svakom novom vozilu javljamo vam mejlom — prvima.
            </p>
          </div>
          <Link href="/vozila-u-dolasku" className="btn-outline shrink-0">
            Postani VIP član
          </Link>
        </div>
      </section>

      {/* PRODAJ/ZAMIJENI VOZILO */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-xl">
            <p className="section-label">Za vlasnike vozila</p>
            <h2 className="font-display mt-2 text-3xl">
              Prodaj ili zamijeni svoje vozilo
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-foreground/70">
              Ne živite u Banjoj Luci? Nije problem — pošaljite nam podatke i
              fotografije vašeg vozila, mi vam se javljamo sa procjenom, a vi
              birate da li vam više odgovara prodaja ili zamjena za neko od
              vozila iz naše ponude.
            </p>
          </div>
          <Link href="/prodaj-vozilo" className="btn-primary shrink-0">
            Prodaj ili zamijeni vozilo
          </Link>
        </div>
      </section>

      {/* SEO — prirodan tekst o ponudi, pomaže Google-u da poveže sajt sa
          pretragama poput "polovna auta banja luka", "prodaja auta banja
          luka" i sličnim, bez neprirodnog nabijanja ključnih riječi. */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl *:max-w-3xl px-5 py-16 md:px-8">
          <p className="section-label">Prodaja polovnih vozila u Banjoj Luci</p>
          <h2 className="font-display mt-2 text-2xl">
            Vaš izbor za polovna auta u Banjoj Luci
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-foreground/70">
            Exclusive Auto je adresa za prodaju polovnih automobila u Banjoj
            Luci — od reprezentativnih limuzina do porodičnih i poslovnih
            vozila. Svako vozilo iz naše ponude prolazi provjeru tehničkog
            stanja i porijekla prije nego što uđe u prodaju, tako da kupovinu
            polovnog auta u Banjoj Luci možete obaviti sigurno i bez brige.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/70">
            Osim prodaje automobila iz vlastite ponude, bavimo se i uvozom
            vozila po narudžbi iz Njemačke, Austrije i Švicarske, kompletnom
            registracijom i pripremom vozila. Posjetite nas u Banjoj Luci ili
            pregledajte ponudu polovnih auta online, u svakom trenutku.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8">
        <p className="section-label">Test vožnja</p>
        <h2 className="font-display mx-auto mt-2 max-w-2xl text-3xl">
          Uvjerite se lično — zakažite probnu vožnju vozila koje vas
          interesuje
        </h2>
        <div className="mt-8">
          <Link href="/probna-voznja" className="btn-primary">
            Rezerviši termin
          </Link>
        </div>
      </section>
    </div>
  );
}
