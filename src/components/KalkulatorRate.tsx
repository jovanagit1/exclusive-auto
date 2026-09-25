"use client";

import { useMemo, useState } from "react";
import { KREDIT, mjesecnaRata } from "@/lib/finansiranje";
import { EUR_U_KM } from "@/lib/currency";

function km(x: number) {
  return `${x.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KM`;
}
function kmOkruglo(x: number) {
  return `${Math.round(x).toLocaleString("de-DE")} KM`;
}

/**
 * Kalkulator rate na stranici vozila — računa po uslovima Addiko Bank
 * namjenskog kredita (vidi src/lib/finansiranje.ts), ali u izgledu sajta.
 * Kartica "Lizing" za sada šalje upit (uslovi po dogovoru).
 */
export default function KalkulatorRate({
  cijena,
  valuta,
  vozilo,
}: {
  cijena: number;
  valuta: string;
  vozilo: string;
}) {
  const cijenaKM = valuta === "EUR" ? cijena * EUR_U_KM : cijena;
  const minUcesce = Math.max(0, Math.ceil(cijenaKM - KREDIT.maxIznos));
  const maxUcesce = Math.max(minUcesce, Math.floor(cijenaKM - KREDIT.minIznos));

  const [tip, setTip] = useState<"kredit" | "lizing">("kredit");
  const [ucesce, setUcesce] = useState(minUcesce);
  const [rok, setRok] = useState(84);
  const [formaOtvorena, setFormaOtvorena] = useState(false);
  const [ime, setIme] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const iznosKredita = Math.max(0, cijenaKM - ucesce);
  const rata = useMemo(
    () => mjesecnaRata(iznosKredita, KREDIT.godisnjaKamata, rok),
    [iznosKredita, rok]
  );

  async function posalji(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const data: Record<string, string> =
      tip === "kredit"
        ? {
            ime,
            telefon,
            email,
            vozilo,
            cijena: kmOkruglo(cijenaKM),
            ucesce: kmOkruglo(ucesce),
            iznosKredita: kmOkruglo(iznosKredita),
            rok: `${rok} mjeseci`,
            rata: `${km(rata)} (informativno)`,
          }
        : { ime, telefon, email, vozilo, cijena: kmOkruglo(cijenaKM) };
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: tip, data }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Finansiranje</p>
          <h2 className="font-display mt-2 text-2xl">Izračunajte ratu</h2>
        </div>
        <div className="flex overflow-hidden rounded-full border border-border text-xs font-semibold uppercase tracking-wider">
          {(["kredit", "lizing"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTip(t);
                setStatus("idle");
              }}
              className={`px-5 py-2 transition-colors ${
                tip === t ? "bg-accent text-background" : "text-foreground/70 hover:text-accent"
              }`}
            >
              {t === "kredit" ? "Kredit" : "Lizing"}
            </button>
          ))}
        </div>
      </div>

      {tip === "kredit" ? (
        <div className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div className="space-y-7">
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">Učešće</span>
                <span className="font-semibold">{kmOkruglo(ucesce)}</span>
              </div>
              <input
                type="range"
                min={minUcesce}
                max={maxUcesce}
                step={100}
                value={ucesce}
                onChange={(e) => setUcesce(Number(e.target.value))}
                className="mt-3 w-full accent-white"
              />
              {minUcesce > 0 && (
                <p className="mt-1 text-xs text-muted">
                  Kredit je do {kmOkruglo(KREDIT.maxIznos)}, pa je potrebno učešće najmanje{" "}
                  {kmOkruglo(minUcesce)}.
                </p>
              )}
            </div>
            <div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-xs uppercase tracking-wider text-muted">Rok otplate</span>
                <span className="font-semibold">{rok} mjeseci</span>
              </div>
              <input
                type="range"
                min={KREDIT.minRok}
                max={KREDIT.maxRok}
                step={6}
                value={rok}
                onChange={(e) => setRok(Number(e.target.value))}
                className="mt-3 w-full accent-white"
              />
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground/70">
              <span>
                Cijena vozila: <b className="text-foreground">{kmOkruglo(cijenaKM)}</b>
              </span>
              <span>
                Iznos kredita: <b className="text-foreground">{kmOkruglo(iznosKredita)}</b>
              </span>
            </div>
          </div>

          <div className="border border-border bg-background/40 p-6 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-muted">Mjesečna rata</p>
            <p className="font-display mt-2 text-4xl text-foreground">≈ {km(rata)}</p>
            <p className="mt-2 text-xs text-muted">
              {rok} rata · kamata {KREDIT.godisnjaKamata.toLocaleString("de-DE")}%
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-foreground/75">
          Ovo vozilo možete kupiti i na lizing. Uslove (učešće, rok i ratu)
          pravimo po vašoj mjeri — ostavite kontakt i javljamo vam se sa
          ponudom.
        </p>
      )}

      <div className="mt-8 border-t border-border pt-6">
        {status === "sent" ? (
          <p className="text-sm text-accent">
            Hvala! Primili smo vaš upit za {tip === "kredit" ? "kredit" : "lizing"} i javljamo vam
            se uskoro.
          </p>
        ) : formaOtvorena ? (
          <form onSubmit={posalji} className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input required placeholder="Ime i prezime *" value={ime} onChange={(e) => setIme(e.target.value)} className="input-field" />
            <input required type="tel" placeholder="Telefon *" value={telefon} onChange={(e) => setTelefon(e.target.value)} className="input-field" />
            <input type="email" placeholder="Email (opciono)" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
            <button type="submit" disabled={status === "sending"} className="btn-primary disabled:opacity-60">
              {status === "sending" ? "Slanje..." : "Pošalji"}
            </button>
            {status === "error" && (
              <p className="text-sm text-red-400 sm:col-span-4">
                Slanje nije uspjelo — pozovite nas na 065 063 063.
              </p>
            )}
          </form>
        ) : (
          <button type="button" onClick={() => setFormaOtvorena(true)} className="btn-primary">
            {tip === "kredit" ? "Želim ponudu za kredit" : "Želim ponudu za lizing"}
          </button>
        )}
        {tip === "kredit" && (
          <p className="disclaimer mt-4">
            Informativni izračun po uslovima {KREDIT.banka} namjenskog kredita za vozila
            (iznos do {kmOkruglo(KREDIT.maxIznos)}, rok do {KREDIT.maxRok} mjeseci). Konačne
            uslove i ratu određuje banka nakon obrade zahtjeva.
          </p>
        )}
      </div>
    </div>
  );
}
