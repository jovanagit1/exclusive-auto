/**
 * JSON-LD strukturirani podaci (schema.org) tipa "AutoDealer" — pomažu
 * Google-u (i AI pretraživačima) da tačno prepoznaju da je Exclusive Auto
 * prodavac vozila u Banja Luci, sa tačnom adresom, telefonom i radnim
 * vremenom. Ovo NE garantuje prvo mjesto na Google-u (na to utiče mnogo
 * faktora — Google Business Profile, recenzije, broj posjeta, konkurencija),
 * ali je osnovni, neophodan korak da se sajt uopšte ispravno "razumije".
 */
export const SITE_URL = "https://www.exclusiveautobl.com";

/**
 * "WebSite" — Google iz ovoga uzima NAZIV sajta koji prikazuje iznad
 * linka u rezultatima (umjesto golog "exclusiveautobl.com").
 */
export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Exclusive Auto",
  alternateName: ["EXCLUSIVE AUTO", "Exclusive Auto Banja Luka"],
  url: `${SITE_URL}/`,
};

export const autoDealerJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "Exclusive Auto",
  description:
    "Prodaja novih i polovnih automobila u Banjoj Luci. Uvoz vozila iz Evrope, priprema i prodaja uz garanciju na porijeklo i kilometražu.",
  url: SITE_URL,
  logo: `${SITE_URL}/logo/logo-google.png`,
  image: `${SITE_URL}/logo/logo-google.png`,
  telephone: "+38765063063",
  email: "aleksandar.maric@exclusiveautobl.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jaroslava Plecitija 17",
    addressLocality: "Banja Luka",
    addressRegion: "Republika Srpska",
    postalCode: "78000",
    addressCountry: "BA",
  },
  areaServed: [
    { "@type": "City", name: "Banja Luka" },
    { "@type": "AdministrativeArea", name: "Republika Srpska" },
    { "@type": "Country", name: "Bosna i Hercegovina" },
  ],
  knowsLanguage: ["bs", "sr", "hr", "de", "en"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "15:00",
    },
  ],
};

/**
 * Podaci o jednom vozilu za Google (schema.org "Car" sa ponudom/cijenom).
 * Google tako zna da je stranica auto na prodaju, sa cijenom, godištem i
 * kilometražom — i može ga prikazati u rezultatima pretrage.
 */
export function voziloJsonLd(v: {
  marka: string;
  model: string;
  godiste: number;
  km: number;
  gorivo: string;
  mjenjac: string;
  boja?: string;
  cijena: number;
  valuta: string;
  slug: string;
  opis?: string;
  slike?: string[];
}) {
  const url = `${SITE_URL}/vozila/${v.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${v.marka} ${v.model}`,
    brand: { "@type": "Brand", name: v.marka },
    model: v.model,
    vehicleModelDate: String(v.godiste),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.km, unitCode: "KMT" },
    fuelType: v.gorivo,
    vehicleTransmission: v.mjenjac,
    ...(v.boja ? { color: v.boja } : {}),
    ...(v.opis ? { description: v.opis } : {}),
    ...(v.slike?.length ? { image: v.slike } : {}),
    url,
    offers: {
      "@type": "Offer",
      price: v.cijena,
      priceCurrency: v.valuta === "EUR" ? "EUR" : "BAM",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      url,
      seller: { "@type": "AutoDealer", name: "Exclusive Auto", url: SITE_URL },
    },
  };
}
