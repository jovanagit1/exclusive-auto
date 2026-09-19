import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * Generiše siguran, kratkotrajan token da bi browser mogao da upload-uje
 * slike DIREKTNO na Vercel Blob (bez prolaska kroz server) — potrebno je
 * jer server funkcije na Vercelu imaju ograničenje veličine zahtjeva, a
 * slika vozila (30+ po vozilu) lako to pređe.
 *
 * Ova ruta je zaštićena middleware-om (mora postojati važeća admin sesija).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 15 * 1024 * 1024, // 15MB po slici
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[blob-upload] uspješno:", blob.url);
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
