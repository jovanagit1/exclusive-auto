/**
 * Znak "EXCLUSIVE AUTO VIP" — ista slova kao u logou (verzal, široki
 * razmak), a "VIP" u tankom okviru. Boja prati tekst oko njega.
 */
export default function VipZnak({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-semibold uppercase tracking-[0.25em] ${className}`}
    >
      <span>Exclusive Auto</span>
      <span className="border border-current px-1.5 py-0.5 leading-none tracking-[0.2em]">
        VIP
      </span>
    </span>
  );
}
