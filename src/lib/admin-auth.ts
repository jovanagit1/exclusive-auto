/**
 * Jednostavna zaštita admin panela jednom lozinkom (ADMIN_PASSWORD env
 * varijabla). Nema baze korisnika/naloga — namjerno, jer korisnica je
 * tražila najjednostavnije moguće rješenje za nju i Acu.
 *
 * Kako radi: kad neko unese tačnu lozinku na /admin/login, server postavi
 * "session" kolačić čija je vrijednost potpis (HMAC) lozinke — tako se
 * kolačić ne može pogoditi/falsifikovati bez poznavanja prave lozinke, a
 * sama lozinka se ne čuva u kolačiću.
 */

export const ADMIN_SESSION_COOKIE = "ea_admin_session";

async function hmac(secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode("exclusive-auto-admin-session-v1")
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isAdminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function checkPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && password === expected;
}

export async function createSessionValue(): Promise<string> {
  return hmac(process.env.ADMIN_PASSWORD ?? "");
}

export async function isValidSession(
  value: string | undefined | null
): Promise<boolean> {
  if (!value || !process.env.ADMIN_PASSWORD) return false;
  const expected = await createSessionValue();
  return value === expected;
}
