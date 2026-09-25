import { cookies } from "next/headers";
import { getSubscribers } from "./store";

/**
 * "Privatni salon" — posjetioci prijavljeni na Premium listu (newsletter)
 * dobijaju pristup odjeljku "Vozila u dolasku".
 *
 * Kako radi (bez naloga i šifri):
 *  - pri prijavi na listu browser dobija kolačić sa potpisanim mejlom,
 *  - u mejlu dobrodošlice stiže lični link (/salon/pristup?...) kojim se
 *    pristup otključava i na drugom uređaju (telefon, drugi računar),
 *  - pristup važi dok je mejl na listi: kad admin ukloni nekoga iz
 *    Admin panel → Newsletter, pristup mu se automatski gasi.
 */
export const SALON_COOKIE = "ea_salon";
export const SALON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // godinu dana

function tajna(): string {
  return process.env.SALON_SECRET ?? process.env.ADMIN_PASSWORD ?? "exclusive-auto-salon";
}

export async function tokenZaEmail(email: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(tajna()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`salon:${email.toLowerCase()}`));
  return Array.from(new Uint8Array(sig))
    .slice(0, 16)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function vrijednostKolacica(email: string): Promise<string> {
  return `${encodeURIComponent(email.toLowerCase())}.${await tokenZaEmail(email)}`;
}

export async function linkZaPristup(siteUrl: string, email: string, next?: string): Promise<string> {
  const params = new URLSearchParams({ e: email.toLowerCase(), t: await tokenZaEmail(email) });
  if (next) params.set("next", next);
  return `${siteUrl}/salon/pristup?${params.toString()}`;
}

export const opcijeKolacica = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: SALON_COOKIE_MAX_AGE,
  path: "/",
};

/** Da li trenutni posjetilac (po kolačiću) ima pristup privatnom salonu. */
export async function imaPristupSalonu(): Promise<boolean> {
  const vrijednost = (await cookies()).get(SALON_COOKIE)?.value;
  if (!vrijednost) return false;
  const tacka = vrijednost.lastIndexOf(".");
  if (tacka < 1) return false;
  const email = decodeURIComponent(vrijednost.slice(0, tacka));
  const token = vrijednost.slice(tacka + 1);
  if (token !== (await tokenZaEmail(email))) return false;
  const subscribers = await getSubscribers();
  return subscribers.some((s) => s.email === email);
}
