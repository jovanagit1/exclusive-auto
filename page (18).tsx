import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Uvoz vozila",
  description:
    "Pošaljite upit za uvoz vozila po vašoj želji — marka, model, zemlja porijekla i budžet.",
};

export default function UvozPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Uvoz vozila</p>
      <h1 className="font-display mt-3 text-4xl">
        Pronaći ćemo vozilo po vašoj želji
      </h1>
      <p className="mt-4 text-sm text-foreground/70">
        Recite nam šta tražite, a mi pretražujemo tržišta Njemačke,
        Austrije, Švicarske i drugih zemalja kako bismo pronašli vozilo
        koje odgovara vašim potrebama i budžetu.
      </p>

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
