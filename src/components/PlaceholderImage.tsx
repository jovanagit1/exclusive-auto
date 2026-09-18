/**
 * Elegantan placeholder umjesto stvarne fotografije.
 * Kada dobijete prave fotografije vozila/showroom-a, ubacite ih u
 * /public/vozila/ (ili /public/galerija/) i zamijenite ovu komponentu
 * običnim <img src="/vozila/naziv.jpg" ... /> ili next/image komponentom.
 */
export default function PlaceholderImage({
  label,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={`relative flex ${ratio} items-center justify-center overflow-hidden border border-border bg-surface-2 ${className}`}
    >
      <div className="absolute inset-0 opacity-20 gold-gradient" />
      <svg
        viewBox="0 0 64 40"
        className="relative h-10 w-16 text-gold opacity-70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 26 L11 14 Q13 10 19 10 H45 Q51 10 53 14 L58 26" />
        <rect x="2" y="26" width="60" height="9" rx="3" />
        <circle cx="15" cy="35" r="4.5" />
        <circle cx="49" cy="35" r="4.5" />
      </svg>
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.65rem] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
    </div>
  );
}
