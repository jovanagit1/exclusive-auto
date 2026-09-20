"use client";

import { useState } from "react";

/**
 * Javna forma (u Footer-u, vidljiva na svakoj stranici) preko koje se
 * posjetioci sami prijavljuju da postanu premium korisnici — kada admin u
 * Admin panelu doda novo vozilo i označi "Pošalji obavještenje premium
 * korisnicima", ovi ljudi dobijaju mejl o novom vozilu.
 */
export default function PremiumSignupForm() {
  const [email, setEmail] = useState("");
  const [ime, setIme] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ime }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Greška pri prijavi.");
      setStatus("sent");
      setEmail("");
      setIme("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri prijavi.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-accent">
        Hvala! Prijavljeni ste — javit ćemo vam se mejlom čim stigne novo vozilo.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
      <input
        type="text"
        value={ime}
        onChange={(e) => setIme(e.target.value)}
        placeholder="Ime (opciono)"
        className="input-field w-full sm:w-40"
      />
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Vaš email *"
        className="input-field w-full sm:w-64"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary disabled:opacity-60"
      >
        {status === "sending" ? "Prijava..." : "Prijavi se"}
      </button>
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </form>
  );
}
