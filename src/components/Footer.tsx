import Link from "next/link";
import Logo from "./Logo";
import PremiumSignupForm from "./PremiumSignupForm";
import VipZnak from "./VipZnak";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
        <div>
          <Logo className="h-14 w-auto text-white" />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Uvoz, prodaja i priprema vozila iz Evrope. Povjerenje izgrađeno na
            transparentnosti i kvalitetu.
          </p>
        </div>

        <div>
          <h3 className="section-label mb-4">Navigacija</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link href="/vozila" className="hover:text-accent">Vozila</Link></li>
            <li><Link href="/vozila-u-dolasku" className="hover:text-accent">Vozila u dolasku</Link></li>
            <li><Link href="/posredovanje" className="hover:text-accent">Posredovanje</Link></li>
            <li><Link href="/usluge" className="hover:text-accent">Usluge</Link></li>
            <li><Link href="/galerija" className="hover:text-accent">Galerija</Link></li>
            <li><Link href="/prodaj-vozilo" className="hover:text-accent">Prodaj vozilo</Link></li>
            <li><Link href="/o-nama" className="hover:text-accent">O nama</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="section-label mb-4">Usluge</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li><Link href="/uvoz" className="hover:text-accent">Uvoz vozila</Link></li>
            <li><Link href="/registracija" className="hover:text-accent">Registracija vozila</Link></li>
            <li><Link href="/probna-voznja" className="hover:text-accent">Probna vožnja</Link></li>
            <li><Link href="/usluge" className="hover:text-accent">Detailing i priprema</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="section-label mb-4">Kontakt</h3>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>Jaroslava Plecitija 17, Banja Luka</li>
            <li>
              <a href="tel:+38765063063" className="block hover:text-accent">
                065 063 063
              </a>
              <a href="tel:+38766888555" className="block hover:text-accent">
                066 888 555
              </a>
            </li>
            <li>
              <a
                href="mailto:aleksandar.maric@exclusiveautobl.com"
                className="hover:text-accent"
              >
                aleksandar.maric@exclusiveautobl.com
              </a>
            </li>
            <li className="pt-1 text-xs text-muted">
              Pon – Pet: 09:00 – 17:00 · Sub: 09:00 – 15:00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <h3 className="mb-1 text-xs text-accent"><VipZnak /></h3>
          <p className="mb-4 text-sm text-muted">
            Besplatna prijava: pristup odjeljku{" "}
            <Link href="/vozila-u-dolasku" className="text-foreground/80 underline underline-offset-4 hover:text-accent">
              Vozila u dolasku
            </Link>{" "}
            i obavještenje mejlom o svakom novom vozilu, prije svih ostalih.
          </p>
          <PremiumSignupForm />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <p className="disclaimer">
          Usluge zatamnjenja stakala (tzv. „folija“) izvodimo isključivo u
          skladu sa važećim propisima o dozvoljenoj svjetlopropusnosti za
          vozila u saobraćaju. Poliranje i detailing vozila su kozmetičke
          usluge pripreme vozila i ne utiču na tehničke karakteristike
          vozila. Za detalje o zakonskim ograničenjima kontaktirajte nas
          prije zakazivanja termina.
        </p>
        <p className="mt-4 text-xs text-muted">
          © {new Date().getFullYear()} Exclusive Auto. Sva prava zadržana.
        </p>
        </div>
      </div>
    </footer>
  );
}
