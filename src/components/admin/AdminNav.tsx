"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Vozila" },
  { href: "/admin/vozila/novo", label: "+ Dodaj vozilo" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <nav className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
              pathname === l.href
                ? "bg-accent text-background"
                : "border border-border text-foreground/80 hover:border-accent"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="text-xs uppercase tracking-wider text-muted hover:text-accent"
      >
        Odjava
      </button>
    </div>
  );
}
