import { prisma } from "@/lib/prisma";

const insertFileMeta = async (
  id: string,
  ownerId: string,
  fileName: string,
  size: number,
  mimeType: string,
  storagePath: string,
  folderId?: string | null
) => {
  let res = await prisma.file.create({
    data: {
      id,
      owner_id: ownerId,
      name: fileName,
      size,
      mime_type: mimeType,
      storage_path: storagePath,
      folder_id: folderId,
    },
  });
  return res;
};
export default insertFileMeta;
