import { minio } from "./minio";

export async function ensureBucket() {
  const bucket = process.env.MINIO_BUCKET!;
  const exists = await minio.bucketExists(bucket);
  if (!exists) {
    await minio.makeBucket(bucket, "us-east-1");
    console.log(`✔ Bucket "${bucket}" created`);
  }
}
