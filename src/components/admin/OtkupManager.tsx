"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OtkupZahtjev } from "@/lib/store";

const STATUS_LABELI: Record<OtkupZahtjev["status"], string> = {
  novo: "Novo",
  pregledano: "Pregledano",
  zavrseno: "Završeno",
};

export default function OtkupManager({ zahtjevi }: { zahtjevi: OtkupZahtjev[] }) {
  const router = useRouter();
  const [radi, setRadi] = useState<string | null>(null);

  async function promijeniStatus(id: string, status: OtkupZahtjev["status"]) {
    setRadi(id);
    await fetch("/api/admin/otkup", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
    setRadi(null);
  }

  async function obrisi(id: string) {
    setRadi(id);
    await fetch("/api/admin/otkup", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
    setRadi(null);
  }

  if (zahtjevi.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted">
        Nema još zahtjeva za otkup ili zamjenu vozila.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {zahtjevi.map((z) => (
        <div key={z.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-accent">
                  {z.tip === "zamjena" ? "Zamjena" : "Prodaja"}
                </span>
                <span className="text-xs text-muted">
                  {new Date(z.poslato).toLocaleString("bs-BA")}
                </span>
              </div>
              <h3 className="font-display mt-1.5 text-lg">
                {z.marka} {z.model} · {z.godiste}
              </h3>
              <p className="text-xs text-muted">
                {z.kilometraza} km
                {z.gorivo ? ` · ${z.gorivo}` : ""}
                {z.mjenjac ? ` · ${z.mjenjac}` : ""}
                {z.boja ? ` · ${z.boja}` : ""}
              </p>
              {z.zamjenaZaSlug && (
                <p className="mt-1 text-xs text-foreground/70">
                  Zamjena za vozilo:{" "}
                  <a
                    href={`/vozila/${z.zamjenaZaSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {z.zamjenaZaSlug}
                  </a>
                </p>
              )}
              {z.procijenjenaCijena && (
                <p className="mt-1 text-xs text-foreground/70">
                  Procijenjena cijena: {z.procijenjenaCijena}
                </p>
              )}
            </div>

            <select
              value={z.status}
              disabled={radi === z.id}
              onChange={(e) =>
                promijeniStatus(z.id, e.target.value as OtkupZahtjev["status"])
              }
              className="input-field w-auto py-1.5 text-xs"
            >
              {(Object.keys(STATUS_LABELI) as OtkupZahtjev["status"][]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELI[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-1 border-t border-border pt-4 text-sm sm:grid-cols-2">
            <p>
              <span className="text-muted">Ime:</span> {z.ime}
            </p>
            <p>
              <span className="text-muted">Telefon:</span>{" "}
              <a href={`tel:${z.telefon}`} className="text-accent">
                {z.telefon}
              </a>
            </p>
            {z.email && (
              <p className="sm:col-span-2">
                <span className="text-muted">Email:</span>{" "}
                <a href={`mailto:${z.email}`} className="text-accent">
                  {z.email}
                </a>
              </p>
            )}
          </div>

          {z.opis && (
            <p className="mt-3 border-t border-border pt-3 text-sm text-foreground/75">
              {z.opis}
            </p>
          )}

          {z.slike.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {z.slike.map((src) => (
                <a
                  key={src}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block aspect-square overflow-hidden rounded-sm border border-border"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-end border-t border-border pt-3">
            <button
              onClick={() => obrisi(z.id)}
              disabled={radi === z.id}
              className="text-xs uppercase tracking-wider text-muted hover:text-red-400 disabled:opacity-50"
            >
              Obriši
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
