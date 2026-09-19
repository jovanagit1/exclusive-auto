import { list, put } from "@vercel/blob";
import { vehicles as seedVehicles, type Vehicle } from "./vehicles";

/**
 * Skladište podataka (vozila, premium pretplatnici) preko Vercel Blob-a.
 *
 * Zašto ovako: admin panel treba da može da doda/izmijeni/obriše vozilo bez
 * novog "deploy-a" sajta. Next.js na Vercelu nema trajni disk (fajlovi se ne
 * čuvaju između zahtjeva), pa se podaci čuvaju kao JSON fajlovi u Vercel
 * Blob skladištu.
 *
 * PODEŠAVANJE (obavezno za admin panel da radi na Vercelu):
 *   1. U Vercel projektu → Storage → Create Database → Blob → Create
 *   2. Vercel će AUTOMATSKI dodati BLOB_READ_WRITE_TOKEN u Environment
 *      Variables i ponuditi redeploy — prihvatite.
 *
 * Dok token nije podešen (npr. lokalno na svom računaru), sajt i dalje
 * radi — samo se prikazuju polazni (seed) podaci iz vehicles.ts, a admin
 * panel javlja jasnu grešku ako se pokuša sačuvati izmjena.
 */

const VEHICLES_PATH = "data/vehicles.json";
const SUBSCRIBERS_PATH = "data/subscribers.json";

export type Subscriber = {
  email: string;
  ime?: string;
  napomena?: string;
  dodano: string;
};

function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

async function readBlobJSON<T>(pathname: string, fallback: T): Promise<T> {
  const token = getToken();
  if (!token) return fallback;
  try {
    const { blobs } = await list({ prefix: pathname, token, limit: 20 });
    const match = blobs.find((b) => b.pathname === pathname);
    if (!match) return fallback;
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[store] Greška pri čitanju ${pathname}:`, err);
    return fallback;
  }
}

async function writeBlobJSON<T>(pathname: string, data: T): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN nije podešen. U Vercel projektu idite na Storage → Create Database → Blob, pa redeploy-ujte sajt."
    );
  }
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    token,
  });
}

export async function getVehicles(): Promise<Vehicle[]> {
  return readBlobJSON<Vehicle[]>(VEHICLES_PATH, seedVehicles);
}

export async function getVehicleBySlug(
  slug: string
): Promise<Vehicle | undefined> {
  const all = await getVehicles();
  return all.find((v) => v.slug === slug);
}

export async function saveVehicles(vehicles: Vehicle[]): Promise<void> {
  await writeBlobJSON(VEHICLES_PATH, vehicles);
}

export async function addOrUpdateVehicle(vehicle: Vehicle): Promise<void> {
  const all = await getVehicles();
  const idx = all.findIndex((v) => v.slug === vehicle.slug);
  if (idx === -1) {
    all.unshift(vehicle);
  } else {
    all[idx] = vehicle;
  }
  await saveVehicles(all);
}

export async function deleteVehicle(slug: string): Promise<void> {
  const all = await getVehicles();
  await saveVehicles(all.filter((v) => v.slug !== slug));
}

export async function getSubscribers(): Promise<Subscriber[]> {
  return readBlobJSON<Subscriber[]>(SUBSCRIBERS_PATH, []);
}

export async function saveSubscribers(
  subscribers: Subscriber[]
): Promise<void> {
  await writeBlobJSON(SUBSCRIBERS_PATH, subscribers);
}

export function isBlobConfigured(): boolean {
  return Boolean(getToken());
}
