// /app/api/files/upload/route.ts
import { NextResponse } from "next/server";
import { minio } from "@/lib/minio";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { getUserFromAT } from "@/service/get-current-user";
import insertFileMeta from "@/service/insert-file-meta";

export async function POST(req: Request) {
  const userId = (await getUserFromAT())?.userID;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bucket = process.env.MINIO_BUCKET!;
  const fileName = req.headers.get("x-filename") || "file.bin";
  const fileSize = Number(req.headers.get("x-filesize")) || 0;
  const fileMemeType = req.headers.get("x-filememetype") || "file.bin";
  console.log("fileSize", { fileMemeType, fileSize });

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
    publicUrl
  );

  console.log("fileMeta", fileMeta);

  // Convert Web ReadableStream to Node.js Readable
  const body = req.body;
  if (!body) return NextResponse.json({ error: "No body" }, { status: 400 });

  // @ts-ignore
  const nodeStream = Readable.fromWeb(body);

  let res = await minio.putObject(bucket, objectName, nodeStream);
  console.log("res", res, nodeStream, publicUrl);
  return NextResponse.json({
    fileId,
    objectName,
    userId,
    filename: fileName,
    publicUrl,
  });
}
