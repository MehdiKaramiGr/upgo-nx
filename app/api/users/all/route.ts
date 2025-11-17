import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validate-query";

export async function GET(request: Request) {
  try {
    const query = validateQuery(
      request,
      z.object({
        id: z.uuid().optional(),
      })
    );

    const data = query?.id
      ? await prisma.users.findFirstOrThrow({
          where: {
            id: query.id,
          },
        })
      : await prisma.users.findMany();
    return Response.json(
      Array.isArray(data)
        ? data?.map(({ password_hash, storageUsed, ...user }) => ({
            ...user,
            storageUsed: storageUsed?.toString(),
          }))
        : data
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    throw err;
  }
}
