type LogoProps = {
  className?: string;
  withWordmark?: boolean;
};

/**
 * PLACEHOLDER LOGO — zamijenite ovu komponentu vašim stvarnim logom.
 * Najlakše: sačuvajte logo kao /public/logo.svg (ili .png) i zamijenite
 * <LogoMark /> ispod sa <img src="/logo.svg" alt="Exclusive Auto" .../>.
 * Pulsirajuća animacija na loading ekranu (SplashScreen.tsx) radi sa bilo
 * kojom slikom, jer se primjenjuje kroz CSS klasu "splash-logo".
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="Exclusive Auto logo"
    >
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.5"
      />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="0.5"
        opacity="0.5"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontSize="34"
        fontFamily="Georgia, 'Times New Roman', serif"
        fill="var(--gold)"
        letterSpacing="1"
      >
        EA
      </text>
    </svg>
  );
}

export default function Logo({ className = "", withWordmark = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      {withWordmark && (
        <span className="font-display leading-none">
          <span className="block text-sm tracking-[0.3em] text-foreground">
            EXCLUSIVE
          </span>
          <span className="block text-[0.65rem] tracking-[0.45em] text-gold">
            AUTO
          </span>
        </span>
      )}
    </div>
  );
}
