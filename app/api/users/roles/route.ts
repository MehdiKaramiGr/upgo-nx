import { prisma } from "@/lib/prisma";
import { z } from "zod";
// import { validateQuery } from "@/lib/validate-query";

export async function GET(request: Request) {
  try {
    const data = await prisma.roles.findMany({});

    return Response.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    throw err;
  }
}
