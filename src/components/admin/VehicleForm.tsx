"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { STANDARDNI_OPIS, razdvojiBrojSasije, type Vehicle, type KategorijaVozila } from "@/lib/vehicles";
import { slugify } from "@/lib/slug";
import { pripremiSlikuZaUpload } from "@/lib/image-prep";
import { OPREMA_KATEGORIJE, OPREMA_PO_MARKI, kljucMarkeOpreme } from "@/lib/oprema";

const GORIVO_OPCIJE = ["Dizel", "Benzin", "Hibrid", "Električni", "Plin (LPG/CNG)"];
const VALUTA_OPCIJE = ["KM", "EUR"];
const MJENJAC_OPCIJE = ["Automatik", "Manuelni"];

const MARKE_LISTA = [
  "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "BYD",
  "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Cupra", "Dacia", "Daewoo",
  "Daihatsu", "Dodge", "DS", "Ferrari", "Fiat", "Ford", "Honda", "Hyundai",
  "Infiniti", "Isuzu", "Iveco", "Jaguar", "Jeep", "Kia", "Lada", "Lamborghini",
  "Lancia", "Land Rover", "Lexus", "Maserati", "Mazda", "Mercedes-Benz", "MG",
  "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Polestar", "Porsche",
  "Renault", "Rover", "Saab", "Seat", "Škoda", "Smart", "SsangYong", "Subaru",
  "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
];

const TIP_KAROSERIJE_OPCIJE = [
  "Limuzina", "Karavan (Combi)", "Hečbek", "SUV/Terensko", "Kupe",
  "Kabriolet/Roadster", "Monovolumen (Van)", "Pickup",
];
const POGON_OPCIJE = ["Prednji", "Zadnji", "4x4 (AWD)"];
const BROJ_VRATA_OPCIJE = ["2", "3", "4", "5"];
const KUBIKAZA_OPCIJE = [
  "900", "999", "1000", "1100", "1150", "1200", "1242", "1248", "1298",
  "1332", "1360", "1398", "1461", "1499", "1560", "1598", "1600", "1700",
  "1795", "1798", "1900", "1968", "1995", "1997", "1998", "1999", "2000",
  "2143", "2179", "2198", "2200", "2295", "2300", "2400", "2497", "2500",
  "2700", "2800", "2925", "2967", "2993", "2996", "2998", "3000", "3200",
  "3498", "3500", "3600", "3982", "3996", "4000", "4200", "4400", "4600",
  "5000", "5461", "5935", "6000",
];
const TIP_OVJESA_OPCIJE = [
  "Standardno (opružno)", "Sportsko", "Pneumatsko (Air suspension)",
  "Podesivo/adaptivno",
];
const GARANCIJA_OPCIJE = [
  "Bez garancije", "Garancija do 6 mjeseci", "Garancija do 12 mjeseci",
  "Garancija do 24 mjeseca", "Fabrička garancija (u toku)",
];
const SVJETLA_OPCIJE = ["Halogena", "Ksenon (Xenon)", "LED", "Full LED", "Matrix LED", "Laser"];
const BROJ_SJEDISTA_OPCIJE = ["2", "4", "5", "6", "7", "8", "9"];
const ZASTITA_BLOKADA_OPCIJE = [
  "Alarm", "Imobilajzer", "Blokada mjenjača", "Blokada volana", "GPS lokator", "Nema",
];
const BROJ_STEPENI_OPCIJE = ["4", "5", "6", "7", "8", "9", "10", "CVT (bestepeni)"];
const POSJEDUJE_GUME_OPCIJE = [
  "Ljetne", "Zimske", "Cjelogodišnje (4 sezone)", "Ljetne i zimske (dva seta)",
];
const EMISIONI_STANDARD_OPCIJE = ["Euro 3", "Euro 4", "Euro 5", "Euro 6", "Euro 6d"];
const BROJ_VLASNIKA_OPCIJE = ["1", "2", "3", "4", "5 i više"];
const VELICINA_FELGI_OPCIJE = ['14"', '15"', '16"', '17"', '18"', '19"', '20"', '21"', '22"'];
const KLIMATIZACIJA_OPCIJE = [
  "Nema", "Manuelna", "Automatska (1 zona)", "Automatska (2 zone)",
  "Automatska (3 zone)", "Automatska (4 zone)",
];
const MUZIKA_OPCIJE = [
  "Standardno ozvučenje", "Premium ozvučenje (npr. Bose, Harman Kardon, B&O)", "Bez radija",
];
const PARKING_SENZORI_OPCIJE = ["Nema", "Prednji", "Zadnji", "Prednji i zadnji"];
const PARKING_KAMERA_OPCIJE = ["Nema", "Zadnja", "Prednja i zadnja", "360°"];
const VRSTA_ENTERIJERA_OPCIJE = ["Tkanina", "Koža", "Kombinovano (koža/tkanina)", "Alcantara"];
const ROLO_ZAVJESE_OPCIJE = ["Nema", "Zadnja bočna stakla", "Zadnje staklo", "Sva zadnja stakla"];
const DA_NE_OPCIJE = ["Da", "Ne"];

const TEKUCA_GODINA = new Date().getFullYear();
const GODINA_REGISTRACIJE_OPCIJE = Array.from({ length: 40 }, (_, i) =>
  String(TEKUCA_GODINA - i)
);
const REGISTROVAN_DO_OPCIJE = [
  "Nije registrovan",
  ...Array.from({ length: 3 }, (_, i) => String(TEKUCA_GODINA + i)),
];

const OSTALO = "__ostalo__";

/**
 * Padajući meni sa unaprijed pripremljenim opcijama, uz mogućnost da admin
 * odabere "Ostalo" i sam upiše vrijednost koje nema na listi. Ako vozilo već
 * ima neku vrijednost koja nije na listi (npr. stari upisani podatak), polje
 * se automatski otvara u režimu ručnog unosa da se taj podatak ne izgubi.
 */
function IzborSaListe({
  label,
  value,
  onChange,
  opcije,
  required,
  placeholderRucno,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  opcije: string[];
  required?: boolean;
  placeholderRucno?: string;
}) {
  const [rucniUnos, setRucniUnos] = useState(value !== "" && !opcije.includes(value));

  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
        {label}
      </label>
      {rucniUnos ? (
        <div className="flex gap-2">
          <input
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholderRucno ?? "Upišite vrijednost"}
            className="input-field"
          />
          <button
            type="button"
            onClick={() => {
              setRucniUnos(false);
              onChange("");
            }}
            className="btn-outline whitespace-nowrap px-3 text-xs"
          >
            Lista
          </button>
        </div>
      ) : (
        <select
          required={required}
          value={value}
          onChange={(e) => {
            if (e.target.value === OSTALO) {
              setRucniUnos(true);
              onChange("");
            } else {
              onChange(e.target.value);
            }
          }}
          className="input-field"
        >
          <option value="">— izaberite —</option>
          {opcije.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value={OSTALO}>Ostalo (upiši ručno)...</option>
        </select>
      )}
    </div>
  );
}

export default function VehicleForm({ initial }: { initial?: Vehicle }) {
  const router = useRouter();
  const isNew = !initial;

  const [marka, setMarka] = useState(initial?.marka ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugRucno, setSlugRucno] = useState(false);
  // Godište/Cijena/Km/Regularna cijena se čuvaju kao TEKST (ne broj) dok se
  // unose — da bi polje moglo biti prazno dok admin kuca (broj kao početna
  // vrijednost bi se prikazivao kao npr. "0" koje se ne može obrisati). U
  // broj se pretvaraju tek pri čuvanju (handleSubmit ispod).
  const [godiste, setGodiste] = useState(
    initial?.godiste !== undefined ? String(initial.godiste) : ""
  );
  const [cijena, setCijena] = useState(
    initial?.cijena !== undefined ? String(initial.cijena) : ""
  );
  const [valuta, setValuta] = useState(initial?.valuta ?? "KM");
  const [akcija, setAkcija] = useState(Boolean(initial?.akcija));
  const [regularnaCijena, setRegularnaCijena] = useState(
    initial?.regularnaCijena !== undefined ? String(initial.regularnaCijena) : ""
  );
  const [km, setKm] = useState(initial?.km !== undefined ? String(initial.km) : "");
  const [gorivo, setGorivo] = useState(initial?.gorivo ?? GORIVO_OPCIJE[0]);
  const [mjenjac, setMjenjac] = useState(initial?.mjenjac ?? "Automatik");
  const [kubikaza, setKubikaza] = useState(initial?.kubikaza ?? "");
  const [snaga, setSnaga] = useState(initial?.snaga ?? "");
  const [snagaKw, setSnagaKw] = useState(initial?.snagaKw ?? "");
  const [tipKaroserije, setTipKaroserije] = useState(initial?.tipKaroserije ?? "");
  const [pogon, setPogon] = useState(initial?.pogon ?? "");
  const [brojVrata, setBrojVrata] = useState(initial?.brojVrata ?? "");
  const [boja, setBoja] = useState(initial?.boja ?? "");
  // Novo vozilo dobija automatski standardni opis (može se mijenjati).
  // Kod postojećih vozila broj šasije se izvlači iz starog opisa, ako je
  // tamo bio upisan, i prebacuje u posebno polje.
  const razdvojeno = initial ? razdvojiBrojSasije(initial) : null;
  const [opis, setOpis] = useState(razdvojeno ? razdvojeno.opis : STANDARDNI_OPIS);
  const [brojSasije, setBrojSasije] = useState(razdvojeno?.brojSasije ?? "");
  const [oprema, setOprema] = useState((initial?.oprema ?? []).join("\n"));
  const [istaknuto, setIstaknuto] = useState(Boolean(initial?.istaknuto));
  const [kategorija, setKategorija] = useState<KategorijaVozila>(initial?.kategorija ?? "ponuda");
  const [slike, setSlike] = useState<string[]>(initial?.slike ?? []);
  const [posaljiNewsletter, setPosaljiNewsletter] = useState(false);

  // Dodatne informacije (padajući meniji)
  const [tipOvjesa, setTipOvjesa] = useState(initial?.tipOvjesa ?? "");
  const [masa, setMasa] = useState(initial?.masa ?? "");
  const [garancija, setGarancija] = useState(initial?.garancija ?? "");
  const [svjetla, setSvjetla] = useState(initial?.svjetla ?? "");
  const [brojSjedista, setBrojSjedista] = useState(initial?.brojSjedista ?? "");
  const [zastitaBlokada, setZastitaBlokada] = useState(initial?.zastitaBlokada ?? "");
  const [brojStepeniPrijenosa, setBrojStepeniPrijenosa] = useState(
    initial?.brojStepeniPrijenosa ?? ""
  );
  const [posjedujeGume, setPosjedujeGume] = useState(initial?.posjedujeGume ?? "");
  const [emisioniStandard, setEmisioniStandard] = useState(initial?.emisioniStandard ?? "");
  const [brojPrethodnihVlasnika, setBrojPrethodnihVlasnika] = useState(
    initial?.brojPrethodnihVlasnika ?? ""
  );
  const [velicinaFelgi, setVelicinaFelgi] = useState(initial?.velicinaFelgi ?? "");
  const [klimatizacija, setKlimatizacija] = useState(initial?.klimatizacija ?? "");
  const [muzikaOzvucenje, setMuzikaOzvucenje] = useState(initial?.muzikaOzvucenje ?? "");
  const [parkingSenzori, setParkingSenzori] = useState(initial?.parkingSenzori ?? "");
  const [parkingKamera, setParkingKamera] = useState(initial?.parkingKamera ?? "");
  const [vrstaEnterijera, setVrstaEnterijera] = useState(initial?.vrstaEnterijera ?? "");
  const [roloZavjese, setRoloZavjese] = useState(initial?.roloZavjese ?? "");
  const [kupiNaLeasing, setKupiNaLeasing] = useState(initial?.kupiNaLeasing ?? "");
  const [godinaPrveRegistracije, setGodinaPrveRegistracije] = useState(
    initial?.godinaPrveRegistracije ?? ""
  );
  const [registrovanDo, setRegistrovanDo] = useState(initial?.registrovanDo ?? "");

  // Dodatna oprema (kvačice)
  const [dodatnaOprema, setDodatnaOprema] = useState<string[]>(initial?.dodatnaOprema ?? []);

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

  const kljucOpremeMarke = kljucMarkeOpreme(marka);
  const sveNaListi = new Set([
    ...OPREMA_KATEGORIJE.flatMap((k) => k.stavke),
    ...(kljucOpremeMarke ? OPREMA_PO_MARKI[kljucOpremeMarke].stavke : []),
  ]);
  const ostaleOznacene = dodatnaOprema.filter((s) => !sveNaListi.has(s));

  function prekidaciDodatnaOprema(stavka: string, cekirano: boolean) {
    setDodatnaOprema((prev) =>
      cekirano ? [...prev, stavka] : prev.filter((s) => s !== stavka)
    );
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
      try {
        setUploadProgres(`Obrađujem sliku ${i + 1} od ${files.length}...`);
        const spremnaSlika = await pripremiSlikuZaUpload(file);
        setUploadProgres(`Otpremam sliku ${i + 1} od ${files.length}...`);
        const blob = await upload(
          `vozila/${slug}/${Date.now()}-${i}-${spremnaSlika.name}`,
          spremnaSlika,
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

    if (!godiste.trim() || !cijena.trim() || !km.trim()) {
      setError("Godište, cijena i kilometraža su obavezni.");
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
      akcija,
      regularnaCijena: akcija && regularnaCijena ? Number(regularnaCijena) : undefined,
      km: Number(km),
      gorivo,
      mjenjac,
      kubikaza: kubikaza || undefined,
      snaga,
      snagaKw: snagaKw || undefined,
      tipKaroserije: tipKaroserije || undefined,
      pogon: pogon || undefined,
      brojVrata: brojVrata || undefined,
      boja,
      opis,
      brojSasije: brojSasije.trim().toUpperCase() || undefined,
      oprema: oprema
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      istaknuto,
      kategorija,
      slike,

      tipOvjesa: tipOvjesa || undefined,
      masa: masa || undefined,
      garancija: garancija || undefined,
      svjetla: svjetla || undefined,
      brojSjedista: brojSjedista || undefined,
      zastitaBlokada: zastitaBlokada || undefined,
      brojStepeniPrijenosa: brojStepeniPrijenosa || undefined,
      posjedujeGume: posjedujeGume || undefined,
      emisioniStandard: emisioniStandard || undefined,
      brojPrethodnihVlasnika: brojPrethodnihVlasnika || undefined,
      velicinaFelgi: velicinaFelgi || undefined,
      klimatizacija: klimatizacija || undefined,
      muzikaOzvucenje: muzikaOzvucenje || undefined,
      parkingSenzori: parkingSenzori || undefined,
      parkingKamera: parkingKamera || undefined,
      vrstaEnterijera: vrstaEnterijera || undefined,
      roloZavjese: roloZavjese || undefined,
      kupiNaLeasing: kupiNaLeasing || undefined,
      godinaPrveRegistracije: godinaPrveRegistracije || undefined,
      registrovanDo: registrovanDo || undefined,

      dodatnaOprema,
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
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Marka *
          </label>
          <input
            required
            list="lista-marki"
            value={marka}
            onChange={(e) => handleMarkaModelChange(e.target.value, model)}
            className="input-field"
            placeholder="Počnite kucati ili izaberite sa liste"
          />
          <datalist id="lista-marki">
            {MARKE_LISTA.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
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
            onChange={(e) => setGodiste(e.target.value)}
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
              onChange={(e) => setCijena(e.target.value)}
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

        <div className="sm:col-span-2">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
              akcija
                ? "border-red-500 bg-red-500/15 text-red-400"
                : "border-border text-muted hover:border-red-500/50"
            }`}
          >
            <input
              type="checkbox"
              checked={akcija}
              onChange={(e) => setAkcija(e.target.checked)}
              className="accent-red-500"
            />
            Akcija
          </label>

          {akcija && (
            <div className="mt-3 max-w-xs">
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
                Regularna cijena (prije akcije)
              </label>
              <input
                type="number"
                value={regularnaCijena}
                onChange={(e) => setRegularnaCijena(e.target.value)}
                placeholder="npr. 45000"
                className="input-field"
              />
              <p className="mt-1 text-xs text-muted">
                Na sajtu će ova cijena biti precrtana, a iznos iz polja
                &quot;Cijena&quot; gore prikazan kao akcijska cijena.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Kilometraža (km) *
          </label>
          <input
            required
            type="number"
            value={km}
            onChange={(e) => setKm(e.target.value)}
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

        <IzborSaListe
          label="Mjenjač"
          value={mjenjac}
          onChange={setMjenjac}
          opcije={MJENJAC_OPCIJE}
        />

        <IzborSaListe
          label="Kubikaža (cm³)"
          value={kubikaza}
          onChange={setKubikaza}
          opcije={KUBIKAZA_OPCIJE}
          placeholderRucno="npr. 1998"
        />

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Snaga (KS)
          </label>
          <input
            value={snaga}
            onChange={(e) => setSnaga(e.target.value)}
            placeholder="npr. 200 (samo broj)"
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Snaga (kW)
          </label>
          <input
            value={snagaKw}
            onChange={(e) => setSnagaKw(e.target.value)}
            placeholder="npr. 143"
            className="input-field"
          />
        </div>

        <IzborSaListe
          label="Tip (karoserija)"
          value={tipKaroserije}
          onChange={setTipKaroserije}
          opcije={TIP_KAROSERIJE_OPCIJE}
        />

        <IzborSaListe
          label="Pogon"
          value={pogon}
          onChange={setPogon}
          opcije={POGON_OPCIJE}
        />

        <IzborSaListe
          label="Broj vrata"
          value={brojVrata}
          onChange={setBrojVrata}
          opcije={BROJ_VRATA_OPCIJE}
        />

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
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label className="block text-xs uppercase tracking-wider text-muted">
              Opis
            </label>
            {opis !== STANDARDNI_OPIS && (
              <button
                type="button"
                onClick={() => setOpis(STANDARDNI_OPIS)}
                className="text-xs uppercase tracking-wider text-muted hover:text-accent"
              >
                Vrati standardni opis
              </button>
            )}
          </div>
          <textarea
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            rows={5}
            className="input-field resize-y"
          />
          <p className="mt-1 text-xs text-muted">
            Standardni opis se upisuje automatski — izmijenite ga po potrebi
            (npr. zemlju uvoza). Broj šasije NE upisujte ovdje, nego u polje ispod.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Broj šasije (VIN)
          </label>
          <input
            value={brojSasije}
            onChange={(e) => setBrojSasije(e.target.value.toUpperCase().replace(/\s/g, ""))}
            maxLength={17}
            placeholder="npr. TMAJD81AGMJ017934"
            className="input-field font-mono tracking-[0.12em]"
          />
          <p className="mt-1 text-xs text-muted">
            Na sajtu se prikazuje na posebnom, istaknutom mjestu ispod opisa.
            {brojSasije && brojSasije.length !== 17 && (
              <span className="text-red-400"> Standardni VIN ima 17 znakova (sada: {brojSasije.length}).</span>
            )}
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Gdje se vozilo prikazuje
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ponuda", "Salonska ponuda"],
                ["dolazak", "U dolasku (samo privatni salon)"],
                ["posredovanje", "Posredovanje (nije salonsko)"],
              ] as [KategorijaVozila, string][]
            ).map(([k, naziv]) => (
              <button
                key={k}
                type="button"
                onClick={() => setKategorija(k)}
                className={`rounded-sm border px-3 py-2 text-xs uppercase tracking-wider transition-colors ${
                  kategorija === k
                    ? "border-accent bg-accent text-background"
                    : "border-border text-foreground/80 hover:border-accent"
                }`}
              >
                {naziv}
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-muted">
            {kategorija === "dolazak"
              ? "Vide ga samo članovi privatnog salona (prijavljeni na newsletter). Kad vozilo stigne, samo prebacite na „Salonska ponuda“."
              : kategorija === "posredovanje"
                ? "Prikazuje se na posebnoj stranici „Vozila u posredovanju“, odvojeno od salonske ponude."
                : "Standardno — vozilo je u javnoj ponudi na stranici Vozila."}
          </p>
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
        <h2 className="font-display text-lg text-foreground">Dodatne informacije</h2>
        <p className="mt-1 text-xs text-muted">
          Popunite samo ono što je poznato za ovo vozilo — ostalo ostavite prazno.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <IzborSaListe label="Tip ovjesa" value={tipOvjesa} onChange={setTipOvjesa} opcije={TIP_OVJESA_OPCIJE} />

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
              Masa/Težina (kg)
            </label>
            <input
              type="number"
              value={masa}
              onChange={(e) => setMasa(e.target.value)}
              className="input-field"
            />
          </div>

          <IzborSaListe label="Garancija" value={garancija} onChange={setGarancija} opcije={GARANCIJA_OPCIJE} />
          <IzborSaListe label="Svjetla" value={svjetla} onChange={setSvjetla} opcije={SVJETLA_OPCIJE} />
          <IzborSaListe label="Sjedećih mjesta" value={brojSjedista} onChange={setBrojSjedista} opcije={BROJ_SJEDISTA_OPCIJE} />
          <IzborSaListe label="Zaštita/Blokada" value={zastitaBlokada} onChange={setZastitaBlokada} opcije={ZASTITA_BLOKADA_OPCIJE} />
          <IzborSaListe label="Broj stepeni prijenosa" value={brojStepeniPrijenosa} onChange={setBrojStepeniPrijenosa} opcije={BROJ_STEPENI_OPCIJE} />
          <IzborSaListe label="Posjeduje gume" value={posjedujeGume} onChange={setPosjedujeGume} opcije={POSJEDUJE_GUME_OPCIJE} />
          <IzborSaListe label="Emisioni standard" value={emisioniStandard} onChange={setEmisioniStandard} opcije={EMISIONI_STANDARD_OPCIJE} />
          <IzborSaListe label="Broj prethodnih vlasnika" value={brojPrethodnihVlasnika} onChange={setBrojPrethodnihVlasnika} opcije={BROJ_VLASNIKA_OPCIJE} />
          <IzborSaListe label="Veličina felgi" value={velicinaFelgi} onChange={setVelicinaFelgi} opcije={VELICINA_FELGI_OPCIJE} />
          <IzborSaListe label="Klimatizacija" value={klimatizacija} onChange={setKlimatizacija} opcije={KLIMATIZACIJA_OPCIJE} />
          <IzborSaListe label="Muzika/ozvučenje" value={muzikaOzvucenje} onChange={setMuzikaOzvucenje} opcije={MUZIKA_OPCIJE} />
          <IzborSaListe label="Parking senzori" value={parkingSenzori} onChange={setParkingSenzori} opcije={PARKING_SENZORI_OPCIJE} />
          <IzborSaListe label="Parking kamera" value={parkingKamera} onChange={setParkingKamera} opcije={PARKING_KAMERA_OPCIJE} />
          <IzborSaListe label="Vrsta enterijera" value={vrstaEnterijera} onChange={setVrstaEnterijera} opcije={VRSTA_ENTERIJERA_OPCIJE} />
          <IzborSaListe label="Rolo zavjese" value={roloZavjese} onChange={setRoloZavjese} opcije={ROLO_ZAVJESE_OPCIJE} />
          <IzborSaListe label="Kupi na leasing" value={kupiNaLeasing} onChange={setKupiNaLeasing} opcije={DA_NE_OPCIJE} />
          <IzborSaListe label="Godina prve registracije" value={godinaPrveRegistracije} onChange={setGodinaPrveRegistracije} opcije={GODINA_REGISTRACIJE_OPCIJE} />
          <IzborSaListe label="Registrovan do" value={registrovanDo} onChange={setRegistrovanDo} opcije={REGISTROVAN_DO_OPCIJE} />
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-lg text-foreground">Oprema</h2>
          <p className="text-xs text-muted">Označeno stavki: {dodatnaOprema.length}</p>
        </div>
        <p className="mt-1 text-xs text-muted">
          Označite kvačicom sve što vozilo posjeduje. Kad izaberete marku
          (npr. BMW, Audi, Škoda...), ispod se pojavljuje i oprema specifična za tu marku.
        </p>

        {kljucOpremeMarke && (
          <fieldset className="mt-6 border border-border p-4">
            <legend className="px-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Paketi i oprema — {OPREMA_PO_MARKI[kljucOpremeMarke].naziv}
            </legend>
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {OPREMA_PO_MARKI[kljucOpremeMarke].stavke.map((stavka) => (
                <label key={stavka} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={dodatnaOprema.includes(stavka)}
                    onChange={(e) => prekidaciDodatnaOprema(stavka, e.target.checked)}
                  />
                  {stavka}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {OPREMA_KATEGORIJE.map((kat) => (
          <div key={kat.naziv} className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {kat.naziv}
            </p>
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {kat.stavke.map((stavka) => (
                <label key={stavka} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={dodatnaOprema.includes(stavka)}
                    onChange={(e) => prekidaciDodatnaOprema(stavka, e.target.checked)}
                  />
                  {stavka}
                </label>
              ))}
            </div>
          </div>
        ))}

        {ostaleOznacene.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Označeno ranije (nije na trenutnoj listi)
            </p>
            <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {ostaleOznacene.map((stavka) => (
                <label key={stavka} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked
                    onChange={() => prekidaciDodatnaOprema(stavka, false)}
                  />
                  {stavka}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted">
            Ostala oprema — ručni unos (opciono, jedna stavka po redu)
          </label>
          <textarea
            value={oprema}
            onChange={(e) => setOprema(e.target.value)}
            rows={3}
            placeholder="Samo ono čega nema na listi iznad"
            className="input-field resize-y"
          />
        </div>
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
          Pošalji obavještenje članovima privatnog salona (newsletter) o ovom vozilu
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
