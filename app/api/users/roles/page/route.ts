import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateBody } from "@/lib/validate-body";

import { rolePagePayloadDto } from "@/dto/users/roles-page-dto";

export async function POST(request: Request) {
  try {
    // todo: add audit
    const body = await validateBody(request, rolePagePayloadDto);

    if (body.active_state) {
      await prisma.role_page_access.create({
        data: {
          role_id: body.role_id,
          page_id: body.page_id,
        },
      });
    } else {
      await prisma.role_page_access.deleteMany({
        where: {
          role_id: body.role_id,
          page_id: body.page_id,
        },
      });
    }

    return Response.json("done");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    throw err;
  }
}
