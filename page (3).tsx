"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Prijava nije uspjela.");
        setStatus("error");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Greška u konekciji. Pokušajte ponovo.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <div className="card w-full max-w-sm p-8">
        <div className="flex justify-center">
          <Logo withWordmark={false} className="h-12 w-auto text-foreground" />
        </div>
        <h1 className="font-display mt-6 text-center text-xl">Admin panel</h1>
        <p className="mt-1 text-center text-xs text-muted">
          Exclusive Auto — samo za osoblje
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
              Lozinka
            </label>
            <input
              id="password"
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary w-full disabled:opacity-60"
          >
            {status === "loading" ? "Provjera..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}
