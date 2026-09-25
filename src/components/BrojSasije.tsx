"use client";

import { useState } from "react";

/** Broj šasije (VIN) na stranici vozila — na posebnom mjestu, sa dugmetom za kopiranje. */
export default function BrojSasije({ vin }: { vin: string }) {
  const [kopirano, setKopirano] = useState(false);

  async function kopiraj() {
    try {
      await navigator.clipboard.writeText(vin);
      setKopirano(true);
      setTimeout(() => setKopirano(false), 2000);
    } catch {
      // kopiranje nije podržano — broj je ionako vidljiv i može se označiti
    }
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-border bg-surface px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Broj šasije (VIN)</p>
        <p className="mt-1 font-mono text-base tracking-[0.12em] text-foreground">{vin}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden text-xs text-muted sm:inline">Dozvoljene sve provjere</span>
        <button
          type="button"
          onClick={kopiraj}
          className="text-xs uppercase tracking-wider text-muted hover:text-accent"
        >
          {kopirano ? "Kopirano ✓" : "Kopiraj"}
        </button>
      </div>
    </div>
  );
}
