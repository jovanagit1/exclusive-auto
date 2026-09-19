"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Subscriber } from "@/lib/store";

export default function NewsletterManager({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [ime, setIme] = useState("");
  const [napomena, setNapomena] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ime, napomena }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Greška.");
      setEmail("");
      setIme("");
      setNapomena("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(emailZaBrisanje: string) {
    setRemoving(emailZaBrisanje);
    await fetch("/api/admin/newsletter", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailZaBrisanje }),
    });
    router.refresh();
    setRemoving(null);
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="grid gap-4 sm:grid-cols-3">
        <input
          required
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field sm:col-span-1"
        />
        <input
          placeholder="Ime i prezime"
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          className="input-field sm:col-span-1"
        />
        <input
          placeholder="Napomena (opciono)"
          value={napomena}
          onChange={(e) => setNapomena(e.target.value)}
          className="input-field sm:col-span-1"
        />
        <button
          type="submit"
          disabled={saving}
          className="btn-primary sm:col-span-3 sm:w-fit disabled:opacity-60"
        >
          {saving ? "Dodavanje..." : "+ Dodaj korisnika"}
        </button>
        {error && <p className="text-sm text-red-400 sm:col-span-3">{error}</p>}
      </form>

      <div className="mt-10 divide-y divide-border border-y border-border">
        {subscribers.length === 0 && (
          <p className="py-6 text-sm text-muted">
            Još nema premium korisnika na listi.
          </p>
        )}
        {subscribers.map((s) => (
          <div
            key={s.email}
            className="flex flex-wrap items-center justify-between gap-3 py-3"
          >
            <div>
              <p className="text-sm">{s.ime || s.email}</p>
              <p className="text-xs text-muted">
                {s.email} {s.napomena && `· ${s.napomena}`}
              </p>
            </div>
            <button
              onClick={() => handleRemove(s.email)}
              disabled={removing === s.email}
              className="text-xs uppercase tracking-wider text-muted hover:text-red-400 disabled:opacity-50"
            >
              {removing === s.email ? "..." : "Ukloni"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
