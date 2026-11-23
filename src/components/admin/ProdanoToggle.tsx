"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Dugme na listi vozila u adminu: označi vozilo kao prodano ili ga vrati u ponudu. */
export default function ProdanoToggle({ slug, prodano }: { slug: string; prodano: boolean }) {
  const router = useRouter();
  const [radi, setRadi] = useState(false);

  async function promijeni() {
    setRadi(true);
    try {
      const res = await fetch("/api/admin/vozila", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, prodano: !prodano }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Greška.");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Greška pri čuvanju.");
    } finally {
      setRadi(false);
    }
  }

  return (
    <button
      type="button"
      onClick={promijeni}
      disabled={radi}
      title={prodano ? "Vrati vozilo u ponudu" : "Označi vozilo kao prodano"}
      className={`rounded-sm border px-2.5 py-1 text-xs uppercase tracking-wider transition-colors disabled:opacity-50 ${
        prodano
          ? "border-foreground bg-foreground text-background hover:bg-foreground/80"
          : "border-border text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {radi ? "…" : prodano ? "Prodano ✓" : "Označi prodano"}
    </button>
  );
}
