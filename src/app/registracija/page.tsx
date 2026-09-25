import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Registracija vozila",
  description:
    "Zatražite kompletnu registraciju i carinjenje vozila preko Exclusive Auto.",
};

export default function RegistracijaPage() {
  return (
    <div className="mx-auto max-w-7xl *:max-w-3xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Registracija vozila</p>
      <h1 className="font-display mt-3 text-4xl">
        Registracija bez čekanja u redovima
      </h1>
      <p className="mt-4 text-sm text-foreground/70">
        Preuzimamo kompletan proces registracije i, po potrebi, carinjenja
        vašeg vozila. Pošaljite osnovne podatke o vozilu i javit ćemo vam
        se sa daljim koracima i potrebnom dokumentacijom.
      </p>

      <div className="mt-10">
        <InquiryForm
          formType="registracija"
          submitLabel="Pošalji upit za registraciju"
          fields={[
            { name: "ime", label: "Ime i prezime", required: true },
            { name: "telefon", label: "Telefon", type: "tel", required: true },
            { name: "email", label: "Email", type: "email" },
            {
              name: "markaModel",
              label: "Marka i model vozila",
              required: true,
            },
            { name: "godiste", label: "Godište vozila", required: true },
            {
              name: "status",
              label: "Trenutni status vozila",
              type: "select",
              options: [
                "Vozilo je već u BiH, neregistrovano",
                "Vozilo se uvozi / u tranzitu",
                "Kupujem vozilo preko Exclusive Auto",
              ],
              placeholder: "Odaberite",
            },
            {
              name: "napomena",
              label: "Napomena",
              type: "textarea",
              colSpan2: true,
              placeholder: "Dodatne informacije o vozilu ili roku...",
            },
          ]}
        />
      </div>
    </div>
  );
}
