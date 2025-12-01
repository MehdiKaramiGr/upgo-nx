import { prisma } from "@/lib/prisma";
import { file } from "@/prisma/generated/client";
import thmObjectName from "@/lib/thm-object-name";

const softDeleteFiles = async (files: file[]) => {
  try {
    let transactions = [];
    transactions.push(
      prisma.file.updateMany({
        where: { id: { in: files.map(({ id }) => id) } },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
      })
    );
    const bucket = process.env.MINIO_BUCKET!;
    const thmBucket = process.env.MINIO_BUCKET_THM!;

    transactions.push(
      prisma.file_deletion_queue.createMany({
        data: files.map(({ id, ...f }) => ({
          file_id: id,
          bucket: bucket,
          object_key: f.storage_path,
          locked_at: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        })),
      })
    );
    if (files?.some(({ mime_type }) => mime_type?.includes("image/"))) {
      transactions.push(
        prisma.file_deletion_queue.createMany({
          data: files
            ?.filter((f) => f.mime_type?.includes("image/"))
            .map(({ id, ...f }) => ({
              file_id: id,
              bucket: thmBucket,
              object_key: thmObjectName(f.owner_id, id),
              locked_at: new Date(
                new Date().getTime() + 7 * 24 * 60 * 60 * 1000
              ),
            })),
        })
      );
    }
    await prisma.$transaction(transactions);
  } catch {
    throw new Error("Failed to soft delete files");
  }
};

export default softDeleteFiles;
