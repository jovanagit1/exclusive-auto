import { NextResponse } from "next/server";
import { SALON_COOKIE, opcijeKolacica, tokenZaEmail, vrijednostKolacica } from "@/lib/salon";

/**
 * Lični link iz mejla dobrodošlice — otključava "Vozila u dolasku" na
 * uređaju sa kojeg je link otvoren, pa preusmjerava na taj odjeljak.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("e") ?? "").toLowerCase();
  const token = url.searchParams.get("t") ?? "";
  const next = url.searchParams.get("next") ?? "";
  const cilj = next.startsWith("/") && !next.startsWith("//") ? next : "/vozila-u-dolasku";

  const res = NextResponse.redirect(new URL(cilj, url.origin));
  if (email && token && token === (await tokenZaEmail(email))) {
    res.cookies.set(SALON_COOKIE, await vrijednostKolacica(email), opcijeKolacica);
  }
  return res;
}
