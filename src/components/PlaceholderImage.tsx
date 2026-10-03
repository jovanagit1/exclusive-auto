import { LogoMark } from "./Logo";

/**
 * Zamjena za fotografiju dok je vozilo nema: svijetla pozadina sa autićem
 * iz logoa (u stilu sajta). Čim se u admin panelu doda slika, prikazuje se ona.
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
      className={`relative flex ${ratio} items-center justify-center overflow-hidden bg-gradient-to-br from-[#f4f4f6] to-[#dedfe3] ${className}`}
      role="img"
      aria-label={label}
    >
      <LogoMark className="w-[68%] text-[#b6b8bf]" />
    </div>
  );
}
