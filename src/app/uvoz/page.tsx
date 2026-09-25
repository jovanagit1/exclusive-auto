import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Uvoz vozila",
  description:
    "Pošaljite upit za uvoz vozila po vašoj želji — marka, model, zemlja porijekla i budžet.",
};

export default function UvozPage() {
  return (
    <div className="mx-auto max-w-7xl *:max-w-3xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Uvoz vozila</p>
      <h1 className="font-display mt-3 text-4xl">
        Pronaći ćemo vozilo po vašoj želji
      </h1>
      <p className="mt-4 text-sm text-foreground/70">
        Recite nam šta tražite, a mi pretražujemo tržišta Njemačke,
        Austrije, Švicarske i drugih zemalja kako bismo pronašli vozilo
        koje odgovara vašim potrebama i budžetu.
      </p>

      <div className="mt-14 card p-6 md:p-8">
        <p className="section-label">Za osobe sa invaliditetom</p>
        <h2 className="font-display mt-2 text-2xl">
          Olakšice pri uvozu vozila
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          Zakon o carinskoj politici BiH, uz prateće propise, predviđa da
          osobe sa priznatim invaliditetom (na osnovu rješenja nadležnog
          organa — npr. ratni vojni invalidi sa najmanje 70% i osobe sa
          tjelesnim oštećenjem od najmanje 80%) mogu ostvariti oslobađanje
          od plaćanja carine i PDV-a pri uvozu jednog putničkog vozila, do
          određenog iznosa vrijednosti (za posebno prilagođena vozila to
          ograničenje po pravilu ne važi). Pravo se obično može koristiti
          jednom u nekoliko godina, uz obavezu da se vozilo ne prodaje
          određeni period nakon uvoza.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground/75">
          Iznosi, procenti i uslovi se povremeno mijenjaju (trenutno je u
          toku usklađivanje praga vrijednosti), pa je prije kupovine
          neophodno provjeriti aktuelne uslove kod Uprave za indirektno
          oporezivanje BiH (UIO).
        </p>
        <p className="mt-4 text-sm text-foreground/80">
          UIO BiH — PDV info centar:{" "}
          <a href="tel:+38751335256" className="text-accent">
            +387 51 335-256
          </a>{" "}
          · Email:{" "}
          <a href="mailto:info@uino.gov.ba" className="text-accent">
            info@uino.gov.ba
          </a>{" "}
          ·{" "}
          <a
            href="https://www.uino.gov.ba"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent"
          >
            uino.gov.ba
          </a>
        </p>
        <p className="disclaimer mt-4">
          Napomena: ovo je opšti informativni pregled, a ne pravni savjet.
          Rado ćemo vam pomoći da provjerite vaše konkretno pravo i
          sprovedemo cijeli proces uvoza — samo nam pošaljite upit ispod.
        </p>
      </div>

      <div className="mt-10">
        <InquiryForm
          formType="uvoz"
          submitLabel="Pošalji upit za uvoz"
          fields={[
            { name: "ime", label: "Ime i prezime", required: true },
            { name: "telefon", label: "Telefon", type: "tel", required: true },
            { name: "email", label: "Email", type: "email" },
            {
              name: "markaModel",
              label: "Marka i model (željeni)",
              required: true,
              placeholder: "npr. BMW X5, Audi A6...",
            },
            {
              name: "odakle",
              label: "Odakle preferirate uvoz",
              type: "select",
              options: [
                "Njemačka",
                "Austrija",
                "Švicarska",
                "Italija",
                "Nisam siguran/na",
              ],
              placeholder: "Odaberite zemlju (opciono)",
            },
            {
              name: "budzet",
              label: "Okvirni budžet (KM)",
              placeholder: "npr. do 30.000 KM",
            },
            {
              name: "godiste",
              label: "Godište (od - do)",
              placeholder: "npr. 2018 - 2021",
            },
            {
              name: "napomena",
              label: "Dodatne željene karakteristike",
              type: "textarea",
              colSpan2: true,
              placeholder: "Gorivo, mjenjač, boja, oprema...",
            },
          ]}
        />
      </div>
    </div>
  );
}
