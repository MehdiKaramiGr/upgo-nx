import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validate-query";
import { validateBody } from "@/lib/validate-body";
import {
  getUsersRolesQueryDto,
  mutateUsersRolesDto,
} from "@/dto/users/user-roles-dto";

export async function GET(request: Request) {
  try {
    const query = validateQuery(request, getUsersRolesQueryDto);

    const data = await prisma.user_roles.findMany({
      where: {
        user_id: query.id,
      },
      select: {
        role_id: true,
      },
    });

    return Response.json(data?.map(({ role_id }) => role_id));
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    throw err;
  }
}

export async function POST(request: Request) {
  try {
    // todo: add audit
    const body = await validateBody(request, mutateUsersRolesDto);

    if (body.active_state) {
      await prisma.user_roles.create({
        data: {
          user_id: body.user_id,
          role_id: body.role_id,
        },
      });
    } else {
      await prisma.user_roles.deleteMany({
        where: {
          user_id: body.user_id,
          role_id: body.role_id,
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
