import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "Usluge",
  description:
    "Uvoz vozila, registracija, detailing, poliranje i zatamnjenje stakala — sve usluge Exclusive Auto na jednom mjestu.",
};

const services = [
  {
    title: "Prodaja vozila",
    desc: "Pažljivo odabrana polovna vozila iz Evrope, provjerenog porijekla i tehničkog stanja.",
    href: "/vozila",
    cta: "Pogledaj ponudu",
  },
  {
    title: "Uvoz vozila po narudžbi",
    desc: "Recite nam šta tražite — marku, model, budžet — a mi pronalazimo i uvozimo vozilo iz Njemačke, Austrije, Švicarske i drugih tržišta.",
    href: "/uvoz",
    cta: "Pošalji upit za uvoz",
  },
  {
    title: "Registracija vozila",
    desc: "Kompletna registracija, carinjenje i priprema dokumentacije — preuzimate gotovo, registrovano vozilo.",
    href: "/registracija",
    cta: "Zatraži registraciju",
  },
  {
    title: "Probna vožnja",
    desc: "Prije kupovine, isprobajte vozilo uživo uz dogovoreni termin.",
    href: "/probna-voznja",
    cta: "Zakaži termin",
  },
  {
    title: "Detailing i priprema vozila",
    desc: "Unutrašnje i vanjsko čišćenje, korekcija laka i detaljna hemijska priprema vozila do izložbenog izgleda.",
    href: "/kontakt",
    cta: "Zatraži termin",
  },
  {
    title: "Poliranje karoserije",
    desc: "Uklanjanje sitnih ogrebotina i matiranja laka, vraćanje dubine sjaja originalnoj boji vozila.",
    href: "/kontakt",
    cta: "Zatraži termin",
  },
  {
    title: "Zatamnjenje stakala",
    desc: "Ugradnja kvalitetne folije uz poštovanje zakonom dozvoljenog nivoa zatamnjenja.",
    href: "/kontakt",
    cta: "Zatraži termin",
  },
];

export default function UslugePage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
          <p className="section-label">Usluge</p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl">
            Kompletna podrška — od pronalaska do registracije vozila
          </h1>
          <p className="mt-6 max-w-2xl text-foreground/75">
            Bilo da tražite gotovo vozilo iz naše ponude ili želite da vam
            uvezemo vozilo po mjeri, tu smo od prvog upita do preuzimanja
            registrovanih ključeva.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="card flex flex-col p-6">
              <h3 className="font-display text-xl text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-sm text-foreground/70">
                {s.desc}
              </p>
              <Link
                href={s.href}
                className="mt-5 text-sm uppercase tracking-wider text-gold hover:text-gold-light"
              >
                {s.cta} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 border-t border-border pt-14 md:grid-cols-2 md:items-center">
          <PlaceholderImage label="Detailing i priprema vozila" ratio="aspect-[4/3]" />
          <div>
            <h2 className="font-display text-2xl">
              Priprema vozila do izložbenog sjaja
            </h2>
            <p className="mt-4 text-sm text-foreground/70">
              Detailing i poliranje su kozmetičke usluge kojima vozilo
              vraćamo u stanje bliže tvorničkom, uklanjajući sitne tragove
              korištenja i vraćajući sjaj boji i unutrašnjosti.
            </p>
            <p className="disclaimer mt-6">
              Napomena: Usluga zatamnjenja stakala izvodi se isključivo u
              skladu sa važećim propisima o dozvoljenoj svjetlopropusnosti
              stakala na vozilima u saobraćaju. Poliranje i detailing su
              kozmetičke usluge pripreme vozila i ne predstavljaju tehničku
              intervenciju na vozilu. Za sva pitanja o zakonskim
              ograničenjima rado ćemo vas informisati prije zakazivanja.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
