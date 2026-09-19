"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import type { Vehicle } from "@/lib/vehicles";
import { slugify } from "@/lib/slug";

const GORIVO_OPCIJE = ["Dizel", "Benzin", "Hibrid", "Električni", "Plin (LPG/CNG)"];
const VALUTA_OPCIJE = ["KM", "EUR"];

export default function VehicleForm({ initial }: { initial?: Vehicle }) {
  const router = useRouter();
  const isNew = !initial;

  const [marka, setMarka] = useState(initial?.marka ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugRucno, setSlugRucno] = useState(false);
  const [godiste, setGodiste] = useState(initial?.godiste ?? new Date().getFullYear());
  const [cijena, setCijena] = useState(initial?.cijena ?? 0);
  const [valuta, setValuta] = useState(initial?.valuta ?? "KM");
  const [km, setKm] = useState(initial?.km ?? 0);
  const [gorivo, setGorivo] = useState(initial?.gorivo ?? GORIVO_OPCIJE[0]);
  const [mjenjac, setMjenjac] = useState(initial?.mjenjac ?? "Automatik");
  const [snaga, setSnaga] = useState(initial?.snaga ?? "");
  const [boja, setBoja] = useState(initial?.boja ?? "");
  const [opis, setOpis] = useState(initial?.opis ?? "");
  const [oprema, setOprema] = useState((initial?.oprema ?? []).join("\n"));
  const [istaknuto, setIstaknuto] = useState(Boolean(initial?.istaknuto));
  const [slike, setSlike] = useState<string[]>(initial?.slike ?? []);
  const [posaljiNewsletter, setPosaljiNewsletter] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgres, setUploadProgres] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [poruka, setPoruka] = useState("");

  function handleMarkaModelChange(novaMarka: string, noviModel: string) {
    setMarka(novaMarka);
    setModel(noviModel);
    if (!slugRucno && isNew) {
      setSlug(slugify(`${novaMarka}-${noviModel}-${godiste}`));
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (!slug) {
      setError("Prvo unesite marku i model (potrebno za organizaciju slika).");
      return;
    }
    setUploading(true);
    setError("");
    const nove: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgres(`Otpremam sliku ${i + 1} od ${files.length}...`);
      try {
        const blob = await upload(
          `vozila/${slug}/${Date.now()}-${i}-${file.name}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/admin/blob-upload",
          }
        );
        nove.push(blob.url);
      } catch (err) {
        console.error(err);
        setError(
          `Greška pri otpremanju "${file.name}". Provjerite da li je Vercel Blob uključen (Storage → Blob) i pokušajte ponovo.`
        );
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

  function pomjeriSliku(index: number, smjer: -1 | 1) {
    setSlike((prev) => {
      const kopija = [...prev];
      const cilj = index + smjer;
      if (cilj < 0 || cilj >= kopija.length) return kopija;
      [kopija[index], kopija[cilj]] = [kopija[cilj], kopija[index]];
      return kopija;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setPoruka("");

    if (!slug) {
      setError("Slug (dio adrese) je obavezan.");
      setSaving(false);
      return;
    }

    const vehicle: Vehicle = {
      slug,
      marka,
      model,
      godiste: Number(godiste),
      cijena: Number(cijena),
      valuta,
      km: Number(km),
      gorivo,
      mjenjac,
      snaga,
      boja,
      opis,
      oprema: oprema
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      istaknuto,
      slike,
    };

    try {
      const res = await fetch("/api/admin/vozila", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicle, posaljiNewsletter: isNew && posaljiNewsletter }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Greška pri čuvanju.");
      }
      if (json.newsletter) {
        setPoruka(
          `Sačuvano. Newsletter poslat: ${json.newsletter.poslato}/${json.newsletter.ukupno}.`
        );
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Greška pri čuvanju.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Marka *
          </label>
          <input
            required
            value={marka}
            onChange={(e) => handleMarkaModelChange(e.target.value, model)}
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
            onChange={(e) => handleMarkaModelChange(marka, e.target.value)}
            className="input-field"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Adresa vozila na sajtu (slug) *
          </label>
          <input
            required
            value={slug}
            disabled={!isNew}
            onChange={(e) => {
              setSlugRucno(true);
              setSlug(slugify(e.target.value));
            }}
            className="input-field disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-muted">
            /vozila/{slug || "..."} {!isNew && "— ne može se mijenjati nakon kreiranja"}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Godište *
          </label>
          <input
            required
            type="number"
            value={godiste}
            onChange={(e) => setGodiste(Number(e.target.value))}
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
              Cijena *
            </label>
            <input
              required
              type="number"
              value={cijena}
              onChange={(e) => setCijena(Number(e.target.value))}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
              Valuta
            </label>
            <select
              value={valuta}
              onChange={(e) => setValuta(e.target.value)}
              className="input-field"
            >
              {VALUTA_OPCIJE.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Kilometraža (km) *
          </label>
          <input
            required
            type="number"
            value={km}
            onChange={(e) => setKm(Number(e.target.value))}
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
          <input
            value={mjenjac}
            onChange={(e) => setMjenjac(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Snaga
          </label>
          <input
            value={snaga}
            onChange={(e) => setSnaga(e.target.value)}
            placeholder="npr. 194 KS"
            className="input-field"
          />
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

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Opis
          </label>
          <textarea
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Oprema (jedna stavka po redu)
          </label>
          <textarea
            value={oprema}
            onChange={(e) => setOprema(e.target.value)}
            rows={5}
            className="input-field resize-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={istaknuto}
            onChange={(e) => setIstaknuto(e.target.checked)}
          />
          Prikaži kao izdvojeno vozilo na naslovnoj
        </label>
      </div>

      <div className="border-t border-border pt-6">
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted">
          Slike vozila
        </label>

        {slike.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {slike.map((src, i) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-sm border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 bg-accent px-1.5 py-0.5 text-[0.6rem] uppercase text-background">
                    Naslovna
                  </span>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/70 px-1 py-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => pomjeriSliku(i, -1)}
                    className="px-1 text-xs text-white"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => ukloniSliku(src)}
                    className="px-1 text-xs text-red-400"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => pomjeriSliku(i, 1)}
                    className="px-1 text-xs text-white"
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-sm file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:text-foreground"
        />
        <p className="mt-2 text-xs text-muted">
          Možete odabrati više slika odjednom (cijeli folder jednog vozila).
          Prva slika postaje naslovna fotografija.
        </p>
        {uploading && (
          <p className="mt-2 text-sm text-accent">{uploadProgres}</p>
        )}
      </div>

      {isNew && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={posaljiNewsletter}
            onChange={(e) => setPosaljiNewsletter(e.target.checked)}
          />
          Pošalji obavještenje premium korisnicima o ovom vozilu
        </label>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {poruka && <p className="text-sm text-accent">{poruka}</p>}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? "Čuvanje..." : "Sačuvaj vozilo"}
        </button>
      </div>
    </form>
  );
}
