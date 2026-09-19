import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Fotografije i video sadržaj Exclusive Auto showroom-a i vozila.",
};

const items = [
  "Showroom — eksterijer",
  "Showroom — interijer",
  "Priprema vozila",
  "Detailing radionica",
  "Isporuka vozila klijentu",
  "Vozni park",
];

export default function GalerijaPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
      <p className="section-label">Galerija</p>
      <h1 className="font-display mt-3 max-w-2xl text-4xl">
        Pogledajte naš showroom i vozila iz ponude
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-foreground/70">
        Ovdje će biti prikazane stvarne fotografije i video snimci
        showroom-a, vozila i procesa pripreme. Trenutno su prikazani
        placeholderi — zamijenite ih dodavanjem slika u{" "}
        <code className="text-accent">/public/galerija/</code>.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((label) => (
          <PlaceholderImage key={label} label={label} ratio="aspect-square" />
        ))}
      </div>
    </div>
  );
}
