import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * Generiše siguran, kratkotrajan token da bi posjetioci sajta (BEZ prijave)
 * mogli da otpreme fotografije svog vozila preko javne forme "Prodaj/
 * zamijeni vozilo" ("/prodaj-vozilo"). Namjerno odvojeno od
 * /api/admin/blob-upload (koji je zaštićen i traži admin sesiju) — ova ruta
 * je javno dostupna, ali sa strožim ograničenjima (manje slika, manja
 * veličina) nego admin upload.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Sve javne otpreme idu u poseban "otkup/" folder u Blob skladištu,
        // odvojeno od zvaničnih fotografija vozila iz admin panela.
        if (!pathname.startsWith("otkup/")) {
          throw new Error("Nevažeća putanja za otpremanje.");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 12 * 1024 * 1024, // 12MB — slike su već smanjene u browseru prije ovoga
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[public-upload] uspješno:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Greška pri upload-u." },
      { status: 400 }
    );
  }
}
