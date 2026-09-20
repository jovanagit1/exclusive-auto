"use client";

import { useDisplayCurrency, konvertujCijenu, EUR_U_KM } from "@/lib/currency";

function formatIznos(iznos: number, valuta: string) {
  return `${Math.round(iznos).toLocaleString("de-DE")} ${valuta}`;
}

/**
 * Prikazuje cijenu vozila u trenutno izabranoj prikaznoj valuti (KM ili
 * EUR — vidi CurrencyToggle u Header-u). Ako se prikazna valuta razlikuje od
 * valute u kojoj je cijena unesena u admin panelu, iznos se preračunava po
 * fiksnom kursu KM/EUR i jasno označava sa "≈" i napomenom da je
 * informativno — originalna (obavezujuća) cijena je uvijek ona iz admin
 * panela, ova komponenta je samo prikaz za posjetioca.
 */
export default function PriceTag({
  cijena,
  valuta,
  className = "",
}: {
  cijena: number;
  valuta: string;
  className?: string;
}) {
  const { prikaz } = useDisplayCurrency();
  const jePreracunato = (valuta === "EUR" ? "EUR" : "KM") !== prikaz;
  const prikazniIznos = konvertujCijenu(cijena, valuta, prikaz);

  if (!jePreracunato) {
    return <span className={className}>{formatIznos(cijena, valuta)}</span>;
  }

  return (
    <span
      className={className}
      title={`Informativno, prema fiksnom kursu 1 EUR = ${EUR_U_KM.toString().replace(".", ",")} KM. Obavezujuća cijena je ${formatIznos(cijena, valuta)}.`}
    >
      ≈ {formatIznos(prikazniIznos, prikaz)}
    </span>
  );
}
