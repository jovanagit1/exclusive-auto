import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "O nama",
  description:
    "Upoznajte Exclusive Auto — ko smo, kako radimo i zašto nam klijenti vjeruju.",
};

const values = [
  {
    title: "Transparentnost",
    desc: "Svako vozilo dolazi sa punom historijom i realnim stanjem — bez skrivenih mana.",
  },
  {
    title: "Pažljiv odabir",
    desc: "Vozila biramo lično, provjeravamo tehničko stanje prije nego uđu u ponudu.",
  },
  {
    title: "Podrška poslije kupovine",
    desc: "Tu smo i nakon prodaje — za registraciju, servis i sva pitanja.",
  },
];

export default function ONamaPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <div>
            <p className="section-label">O nama</p>
            <h1 className="font-display mt-3 text-4xl">
              Više od desetljeća iskustva u svijetu automobila
            </h1>
            <p className="mt-6 text-foreground/75">
              Exclusive Auto je porodična firma iz Banje Luke posvećena
              prodaji i uvozu kvalitetnih polovnih vozila iz Evrope. Naš cilj
              je jednostavan — svakom klijentu omogućiti da kupi vozilo u
              koje može imati povjerenja, bez iznenađenja i skrivenih
              troškova.
            </p>
            <p className="mt-4 text-foreground/75">
              Pored prodaje, bavimo se i uvozom vozila po narudžbi,
              registracijom, te profesionalnom pripremom vozila —
              detailingom, poliranjem i zatamnjenjem stakala u skladu sa
              zakonom.
            </p>
          </div>
          <PlaceholderImage label="Naš tim / showroom" ratio="aspect-[4/3]" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="section-label">Zašto Exclusive Auto</p>
        <h2 className="font-display mt-2 text-3xl">Naše vrijednosti</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="card p-6">
              <h3 className="font-display text-lg text-accent">{v.title}</h3>
              <p className="mt-3 text-sm text-foreground/70">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
