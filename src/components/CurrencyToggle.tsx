"use client";

import { useDisplayCurrency } from "@/lib/currency";

/**
 * Mali prekidač "KM · EUR" — posjetilac bira u kojoj valuti želi da VIDI
 * cijene na sajtu (samo prikaz, informativno prema fiksnom kursu). Pamti se
 * po browseru (localStorage), ne mijenja stvarne cijene unesene u admin
 * panelu.
 */
export default function CurrencyToggle({ className = "" }: { className?: string }) {
  const { prikaz, postaviPrikaz } = useDisplayCurrency();

  return (
    <div
      className={`flex items-center overflow-hidden rounded-full border border-border text-[0.65rem] font-semibold uppercase tracking-wider ${className}`}
      title="Prikaz cijena — informativno, prema fiksnom kursu KM/EUR"
    >
      <button
        type="button"
        onClick={() => postaviPrikaz("KM")}
        className={`px-2.5 py-1 transition-colors ${
          prikaz === "KM" ? "bg-accent text-background" : "text-foreground/70 hover:text-accent"
        }`}
      >
        KM
      </button>
      <button
        type="button"
        onClick={() => postaviPrikaz("EUR")}
        className={`px-2.5 py-1 transition-colors ${
          prikaz === "EUR" ? "bg-accent text-background" : "text-foreground/70 hover:text-accent"
        }`}
      >
        EUR
      </button>
    </div>
  );
}
