/**
 * Smanjuje i kompresuje fotografiju u browseru PRIJE otpremanja.
 * Fotografije sa telefona znaju biti ogromne (i preko 100-200MB u punoj
 * rezoluciji), što je i suvišno za prikaz na sajtu i predugo se učitava
 * posjetiocima. Svodimo na max 1920px po dužoj strani i JPEG kvalitet ~0.85
 * (obično ispod 500KB po slici), uz poštovanje EXIF rotacije sa telefona.
 * Ako iz nekog razloga obrada ne uspije, vraća originalni fajl.
 *
 * Zajednička za admin panel (VehicleForm) i javnu formu "Prodaj vozilo".
 */
export async function pripremiSlikuZaUpload(
  file: File,
  maxDimenzija = 1920,
  kvalitet = 0.85
): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const razmjera = Math.min(1, maxDimenzija / Math.max(bitmap.width, bitmap.height));
    const sirina = Math.max(1, Math.round(bitmap.width * razmjera));
    const visina = Math.max(1, Math.round(bitmap.height * razmjera));

    const canvas = document.createElement("canvas");
    canvas.width = sirina;
    canvas.height = visina;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, sirina, visina);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", kvalitet)
    );
    if (!blob) return file;

    const novoIme = file.name.replace(/\.[^./\\]+$/, "") + ".jpg";
    return new File([blob], novoIme, { type: "image/jpeg" });
  } catch (err) {
    console.warn("Obrada slike nije uspjela, šaljem original:", err);
    return file;
  }
}
