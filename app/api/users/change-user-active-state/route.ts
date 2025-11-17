import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validate-query";
import { validateBody } from "@/lib/validate-body";
import {
  getUsersRolesQueryDto,
  mutateUsersRolesDto,
} from "@/dto/users/user-roles-dto";
import { changeUserActiveStateDto } from "@/dto/users/change-user-active-state-dto";

export async function POST(request: Request) {
  try {
    // todo: add audit
    const body = await validateBody(request, changeUserActiveStateDto);

    await prisma.users.update({
      data: {
        is_active: body.active_state,
      },
      where: {
        id: body.id,
      },
    });

    return Response.json("done");
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    throw err;
  }
}
