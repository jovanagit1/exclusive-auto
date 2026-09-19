import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidSession } from "@/lib/admin-auth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login stranica i login API moraju ostati dostupni bez sesije.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await isValidSession(cookie);

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: "Niste prijavljeni." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
