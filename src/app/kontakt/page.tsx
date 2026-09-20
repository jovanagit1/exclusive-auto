import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktirajte Exclusive Auto — pošaljite upit ili nas posjetite.",
};

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Kontakt</p>
      <h1 className="font-display mt-3 text-4xl">Javite nam se</h1>
      <p className="mt-4 max-w-xl text-sm text-foreground/70">
        Za pitanja o vozilima, uslugama ili termine za pripremu vozila,
        pošaljite upit ili nas kontaktirajte direktno.
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              Adresa
            </p>
            <p className="mt-1 text-foreground">
              Jaroslava Plecitija 17, Banja Luka, BiH
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              Telefon
            </p>
            <a href="tel:+38765063063" className="mt-1 block text-accent">
              065 063 063
            </a>
            <a href="tel:+38766888555" className="mt-1 block text-accent">
              066 888 555
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              Email
            </p>
            <a
              href="mailto:aleksandar.maric@exclusiveautobl.com"
              className="mt-1 block text-accent"
            >
              aleksandar.maric@exclusiveautobl.com
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              Radno vrijeme
            </p>
            <p className="mt-1 text-foreground">Pon – Pet: 09:00 – 17:00</p>
            <p className="text-foreground">Subota: 09:00 – 15:00</p>
          </div>
        </div>

        <InquiryForm
          formType="kontakt"
          submitLabel="Pošalji poruku"
          fields={[
            { name: "ime", label: "Ime i prezime", required: true },
            { name: "telefon", label: "Telefon", type: "tel", required: true },
            { name: "email", label: "Email", type: "email" },
            {
              name: "poruka",
              label: "Poruka",
              type: "textarea",
              required: true,
              colSpan2: true,
              placeholder: "Kako vam možemo pomoći?",
            },
          ]}
        />
      </div>

      <div className="mt-16">
        <p className="text-xs uppercase tracking-wider text-muted">
          Lokacija
        </p>
        <div className="mt-3 aspect-[16/7] w-full overflow-hidden rounded-sm border border-border">
          <iframe
            src="https://www.google.com/maps?q=Jaroslava+Plecitija+17%2C+Banja+Luka&output=embed"
            className="h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokacija — Exclusive Auto, Jaroslava Plecitija 17, Banja Luka"
          />
        </div>
      </div>
    </div>
  );
}
