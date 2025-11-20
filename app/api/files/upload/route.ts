// /app/api/files/upload/route.ts
import { NextResponse } from "next/server";
import { minio } from "@/lib/minio";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { getUserFromAT } from "@/service/get-current-user";
import insertFileMeta from "@/service/insert-file-meta";
import thmObjectName from "@/lib/thm-object-name";

export async function POST(req: Request) {
  const userId = (await getUserFromAT())?.userID;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bucket = process.env.MINIO_BUCKET!;
  const thmBucket = process.env.MINIO_BUCKET_THM!;
  const fileName = req.headers.get("x-filename") || "file.bin";
  const fileSize = Number(req.headers.get("x-filesize")) || 0;
  const fileMemeType = req.headers.get("x-filememetype") || "file.bin";
  const folderId = req.headers.get("x-folderid");

  const fileId = randomUUID();
  const objectName = `uploads/${userId}/${fileId}-${fileName}`;
  const publicUrl = `/${bucket}/${objectName}`;
  // const expirySeconds = 60 * 60; // 1 hour
  // const presignedUrl = await minio.presignedUrl(
  //   "GET",
  //   bucket,
  //   objectName,
  //   expirySeconds
  // );
  let fileMeta = await insertFileMeta(
    fileId,
    userId,
    fileName,
    fileSize,
    fileMemeType,
    objectName,
    folderId
  );

  // console.log("fileMeta", fileMeta);

  const arrayBuffer = await req.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  let thumbnailObject = null;

  if (fileMemeType.startsWith("image/")) {
    const sharp = (await import("sharp")).default;

    const thumbnailBuffer = await sharp(fileBuffer)
      .resize(1000, 1000, { fit: "inside" })
      .webp({ quality: 80 })
      .toBuffer();

    await minio.putObject(
      thmBucket,
      thmObjectName(userId, fileId),
      thumbnailBuffer
    );
  }

  let res = await minio.putObject(bucket, objectName, fileBuffer);
  console.log("res", res, publicUrl);
  return NextResponse.json({
    fileId,
    objectName,
    userId,
    filename: fileName,
    publicUrl,
  });
}
