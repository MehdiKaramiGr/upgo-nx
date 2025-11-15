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
      select: { storage_path: true, name: true, mime_type: true },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const { storage_path, name, mime_type } = file;
    const bucket = process.env.MINIO_BUCKET!;

    // Get MinIO object stream
    const stream = await minio.getObject(bucket, storage_path);

    // Set headers for download
    const headers = new Headers();
    headers.set("Content-Disposition", `attachment; filename="${name}"`);
    headers.set("Content-Type", mime_type || "application/octet-stream");

    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err: Error) => controller.error(err));
      },
    });

    return new Response(webStream, { headers });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
