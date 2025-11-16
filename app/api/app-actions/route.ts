import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validate-query";
import { getUserFromAT } from "@/service/get-current-user";
import { PrismaClientKnownRequestError } from "@/lib/prisma/generated/internal/prismaNamespace";
import { appActionQueryDto } from "@/dto/app-action/app-action-dto";

export async function GET(request: Request) {
  try {
    let query = validateQuery(request, appActionQueryDto);

    if (query.cur_users || query.user_id) {
      const curUser =
        (await getUserFromAT().then((user) => user?.userID)) || query.user_id;

      let actions = await prisma.user_roles.findMany({
        where: {
          user_id: curUser,
        },
        include: {
          roles: {
            include: {
              role_action_access: {
                include: {
                  access_actions: true,
                },
              },
            },
          },
        },
      });

      const finalActions = [
        ...new Map(
          actions
            .flatMap((p) =>
              p.roles.role_action_access.map((rpa) => rpa.access_actions)
            )
            .filter(
              (action): action is NonNullable<typeof action> => action !== null
            )
            .map((action) => [action.id, action])
        ).values(),
      ];
      if (query.only_ids) {
        const finalActionIds = finalActions.map((page) => page.id);
        return Response.json(finalActionIds);
      } else {
        return Response.json(finalActions);
      }
    } else {
      const data = await prisma.access_actions.findMany({});
      return Response.json(data);
    }
  } catch (err) {
    console.error(err);
    if (err instanceof z.ZodError) {
      return Response.json({ error: z.treeifyError(err) }, { status: 400 });
    }
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return Response.json({ error: "Record not found" }, { status: 404 });
      }
    }
    return Response.json({ error: "Internal Error Server!" }, { status: 500 });
  }
}
