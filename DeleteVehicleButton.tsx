"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteVehicleButton({
  slug,
  naziv,
}: {
  slug: string;
  naziv: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-xs uppercase tracking-wider text-muted hover:text-red-400"
      >
        Obriši
      </button>
    );
  }

  async function potvrdi() {
    setLoading(true);
    await fetch("/api/admin/vozila", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    router.refresh();
  }

  return (
    <span className="flex items-center gap-2 text-xs">
      <span className="text-muted">Obrisati {naziv}?</span>
      <button
        onClick={potvrdi}
        disabled={loading}
        className="uppercase tracking-wider text-red-400 hover:text-red-300"
      >
        {loading ? "..." : "Da"}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="uppercase tracking-wider text-muted hover:text-foreground"
      >
        Ne
      </button>
    </span>
  );
}
