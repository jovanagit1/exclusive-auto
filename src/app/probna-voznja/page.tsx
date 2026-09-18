import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import { vehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Probna vožnja",
  description: "Zakažite probnu vožnju vozila iz ponude Exclusive Auto.",
};

export default function ProbnaVoznjaPage() {
  const vehicleOptions = vehicles.map((v) => `${v.marka} ${v.model} (${v.godiste})`);

  return (
    <div className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Probna vožnja</p>
      <h1 className="font-display mt-3 text-4xl">Rezervišite termin</h1>
      <p className="mt-4 text-sm text-foreground/70">
        Odaberite vozilo koje vas interesuje i predložite termin — potvrdit
        ćemo tačno vrijeme telefonom ili emailom.
      </p>

      <div className="mt-10">
        <InquiryForm
          formType="probna-voznja"
          submitLabel="Zakaži probnu vožnju"
          fields={[
            { name: "ime", label: "Ime i prezime", required: true },
            { name: "telefon", label: "Telefon", type: "tel", required: true },
            { name: "email", label: "Email", type: "email" },
            {
              name: "vozilo",
              label: "Vozilo",
              type: "select",
              required: true,
              options: [...vehicleOptions, "Nisam siguran/na — predložite vi"],
            },
            {
              name: "datum",
              label: "Željeni datum",
              type: "date",
              required: true,
            },
            {
              name: "napomena",
              label: "Napomena",
              type: "textarea",
              colSpan2: true,
              placeholder: "Željeno vrijeme, dodatna pitanja...",
            },
          ]}
        />
      </div>
    </div>
  );
}
