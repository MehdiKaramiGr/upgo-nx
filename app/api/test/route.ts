import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validate-query";
import { getUserFromAT } from "@/service/get-current-user";

export async function GET(request: Request) {
  try {
    const userId = (await getUserFromAT())?.userID;
    if (!userId) {
      return;
    }
    let data = await prisma.file.findFirst({
      where: {
        ownerId: userId,
      },

      include: {
        owner: true,
      },
    });

    // @ts-ignore
    data.owner.storageUsed = data?.owner.storageUsed.toString();

    console.log("data", data);
    return Response.json(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    throw err;
  }
}
