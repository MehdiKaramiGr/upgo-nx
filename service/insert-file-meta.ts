import { prisma } from "@/lib/prisma";

const insertFileMeta = async (
  id: string,
  ownerId: string,
  fileName: string,
  size: number,
  mimeType: string,
  storagePath: string,
  folderId?: string
) => {
  let res = await prisma.file.create({
    data: {
      id,
      ownerId,
      name: fileName,
      size,
      mimeType,
      storagePath,
      folderId,
    },
  });
  return res;
};
export default insertFileMeta;
