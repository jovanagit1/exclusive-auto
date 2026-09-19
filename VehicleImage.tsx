import PlaceholderImage from "./PlaceholderImage";

/**
 * Prikazuje prvu pravu fotografiju vozila (iz admin panela) ako postoji,
 * inače elegantni placeholder.
 */
export default function VehicleImage({
  slike,
  label,
  ratio = "aspect-[4/3]",
  className = "",
}: {
  slike?: string[];
  label: string;
  ratio?: string;
  className?: string;
}) {
  const src = slike?.[0];

  if (!src) {
    return <PlaceholderImage label={label} ratio={ratio} className={className} />;
  }

  return (
    <div
      className={`relative overflow-hidden border border-border bg-surface-2 ${ratio} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}
