import { minio } from "./minio";

export async function ensureBucket() {
  const bucket = process.env.MINIO_BUCKET!;
  const thmBucket = process.env.MINIO_BUCKET_THM!;
  const exists = await minio.bucketExists(bucket);
  if (!exists) {
    await minio.makeBucket(bucket, "us-east-1");
    console.log(`✔ Bucket "${bucket}" created`);
  }
  const thmExists = await minio.bucketExists(thmBucket);
  if (!thmExists) {
    await minio.makeBucket(thmBucket, "us-east-1");
    console.log(`✔ Bucket "${thmBucket}" created`);
  }
}
