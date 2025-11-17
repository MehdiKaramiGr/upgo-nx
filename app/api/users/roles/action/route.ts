import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateBody } from "@/lib/validate-body";

import { roleActionPayloadDto } from "@/dto/users/roles-action-dto";

export async function POST(request: Request) {
  try {
    // todo: add audit
    const body = await validateBody(request, roleActionPayloadDto);

    if (body.active_state) {
      await prisma.role_action_access.create({
        data: {
          role_id: body.role_id,
          action_id: body.action_id,
        },
      });
    } else {
      await prisma.role_action_access.deleteMany({
        where: {
          role_id: body.role_id,
          action_id: body.action_id,
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
