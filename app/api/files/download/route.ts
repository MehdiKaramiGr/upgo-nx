import { NextRequest, NextResponse } from "next/server";
import { minio } from "@/lib/minio";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  try {
    // Fetch file info from DB
    const file = await prisma.file.findUnique({
      where: { id },
      select: { storagePath: true, name: true, mimeType: true },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { storagePath, name, mimeType } = file;
    const bucket = process.env.MINIO_BUCKET!;

    // Get MinIO object stream
    const stream = await minio.getObject(bucket, storagePath);

    // Set headers for download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${name}"`);
    headers.set("Content-Type", mimeType || "application/octet-stream");

    return new Response(stream, { headers });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
