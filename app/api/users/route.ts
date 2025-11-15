import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validateQuery";

export async function GET(request: Request) {
  try {
    const query = validateQuery(
      request,
      z.object({
        id: z.uuid().optional(),
      }),
    );

    const data = query?.id
      ? await prisma.users.findFirstOrThrow({
          where: {
            id: query.id,
          },
        })
      : await prisma.users.findMany();
    return Response.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    throw err;
  }
}
