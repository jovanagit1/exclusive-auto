"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";
import { pripremiSlikuZaUpload } from "@/lib/image-prep";

const GORIVO_OPCIJE = ["Dizel", "Benzin", "Hibrid", "Električni", "Plin (LPG/CNG)"];
const MJENJAC_OPCIJE = ["Automatik", "Manuelni"];

export default function ProdajVoziloForm({
  vozilaZaZamjenu,
}: {
  vozilaZaZamjenu: { slug: string; naziv: string }[];
}) {
  const [tip, setTip] = useState<"prodaja" | "zamjena">("prodaja");
  const [zamjenaZaSlug, setZamjenaZaSlug] = useState("");

  const [ime, setIme] = useState("");
  const [telefon, setTelefon] = useState("");
  const [email, setEmail] = useState("");

  const [marka, setMarka] = useState("");
  const [model, setModel] = useState("");
  const [godiste, setGodiste] = useState("");
  const [kilometraza, setKilometraza] = useState("");
  const [gorivo, setGorivo] = useState(GORIVO_OPCIJE[0]);
  const [mjenjac, setMjenjac] = useState(MJENJAC_OPCIJE[0]);
  const [boja, setBoja] = useState("");
  const [opis, setOpis] = useState("");
  const [procijenjenaCijena, setProcijenjenaCijena] = useState("");

  const [slike, setSlike] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgres, setUploadProgres] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 10 - slike.length);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    const nove: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadProgres(`Obrađujem sliku ${i + 1} od ${files.length}...`);
        const spremnaSlika = await pripremiSlikuZaUpload(file);
        setUploadProgres(`Otpremam sliku ${i + 1} od ${files.length}...`);
        const blob = await upload(
          `otkup/${Date.now()}-${i}-${spremnaSlika.name}`,
          spremnaSlika,
          {
            access: "public",
            handleUploadUrl: "/api/public-upload",
          }
        );
        nove.push(blob.url);
      } catch (err) {
        console.error(err);
        setError(`Greška pri otpremanju "${file.name}". Pokušajte ponovo.`);
        break;
      }
    }
    setSlike((prev) => [...prev, ...nove]);
    setUploading(false);
    setUploadProgres("");
    e.target.value = "";
  }

  function ukloniSliku(url: string) {
    setSlike((prev) => prev.filter((s) => s !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    if (tip === "zamjena" && !zamjenaZaSlug) {
      setError("Izaberite vozilo iz naše ponude za koje želite zamjenu.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/prodaj-vozilo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tip,
          zamjenaZaSlug: tip === "zamjena" ? zamjenaZaSlug : undefined,
          ime,
          telefon,
          email: email || undefined,
          marka,
          model,
          godiste,
          kilometraza,
          gorivo,
          mjenjac,
          boja: boja || undefined,
          opis: opis || undefined,
          procijenjenaCijena: procijenjenaCijena || undefined,
          slike,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Greška pri slanju.");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri slanju.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-xl text-accent">Hvala vam!</p>
        <p className="mt-3 text-sm text-foreground/75">
          Primili smo vaš zahtjev i javićemo vam se u najkraćem roku na
          navedeni broj telefona ili email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-muted">
          Šta vas zanima?
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setTip("prodaja")}
            className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
              tip === "prodaja"
                ? "border-accent bg-accent text-background"
                : "border-border text-foreground/80 hover:border-accent"
            }`}
          >
            Prodajem svoje vozilo
          </button>
          <button
            type="button"
            onClick={() => setTip("zamjena")}
            className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
              tip === "zamjena"
                ? "border-accent bg-accent text-background"
                : "border-border text-foreground/80 hover:border-accent"
            }`}
          >
            Mijenjam za vozilo iz vaše ponude
          </button>
        </div>

        {tip === "zamjena" && (
          <div className="mt-4 max-w-md">
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
              Vozilo iz naše ponude koje vas zanima *
            </label>
            <select
              required
              value={zamjenaZaSlug}
              onChange={(e) => setZamjenaZaSlug(e.target.value)}
              className="input-field"
            >
              <option value="">— izaberite vozilo —</option>
              {vozilaZaZamjenu.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.naziv}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
        <p className="section-label sm:col-span-2">Vaši podaci</p>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Ime i prezime *
          </label>
          <input
            required
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Telefon *
          </label>
          <input
            required
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Email (opciono)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
        <p className="section-label sm:col-span-2">Podaci o vašem vozilu</p>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Marka *
          </label>
          <input
            required
            value={marka}
            onChange={(e) => setMarka(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Model *
          </label>
          <input
            required
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Godište *
          </label>
          <input
            required
            type="number"
            value={godiste}
            onChange={(e) => setGodiste(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Kilometraža (km) *
          </label>
          <input
            required
            type="number"
            value={kilometraza}
            onChange={(e) => setKilometraza(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Gorivo
          </label>
          <select
            value={gorivo}
            onChange={(e) => setGorivo(e.target.value)}
            className="input-field"
          >
            {GORIVO_OPCIJE.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Mjenjač
          </label>
          <select
            value={mjenjac}
            onChange={(e) => setMjenjac(e.target.value)}
            className="input-field"
          >
            {MJENJAC_OPCIJE.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Boja
          </label>
          <input
            value={boja}
            onChange={(e) => setBoja(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Vaša procijenjena cijena (opciono)
          </label>
          <input
            value={procijenjenaCijena}
            onChange={(e) => setProcijenjenaCijena(e.target.value)}
            placeholder="npr. 15.000 KM"
            className="input-field"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Stanje vozila / napomena
          </label>
          <textarea
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            rows={4}
            placeholder="Servisna historija, eventualne štete, oprema..."
            className="input-field resize-none"
          />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
          Fotografije vozila (opciono, do 10 slika)
        </label>

        {slike.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {slike.map((src) => (
              <div
                key={src}
                className="group relative aspect-square overflow-hidden rounded-sm border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => ukloniSliku(src)}
                  className="absolute right-1 top-1 bg-black/70 px-1.5 py-0.5 text-xs text-red-400 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading || slike.length >= 10}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-sm file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:text-foreground"
        />
        {uploading && <p className="mt-2 text-sm text-accent">{uploadProgres}</p>}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending" || uploading}
        className="btn-primary disabled:opacity-60"
      >
        {status === "sending" ? "Slanje..." : "Pošalji zahtjev"}
      </button>
    </form>
  );
}
