import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validate-query";
import { appPageQueryDto } from "@/dto/app-page/app-page-dto";
import { getUserFromAT } from "@/service/get-current-user";
import { PrismaClientKnownRequestError } from "@/prisma/generated/internal/prismaNamespace";

export async function GET(request: Request) {
  try {
    let query = validateQuery(request, appPageQueryDto);

    if (query.cur_users || query.user_id) {
      const curUser =
        (await getUserFromAT().then((user) => user?.userID)) || query.user_id;

      let pages = await prisma.user_roles.findMany({
        where: {
          user_id: curUser,
        },
        include: {
          roles: {
            include: {
              role_page_access: {
                include: {
                  app_pages: true,
                },
              },
            },
          },
        },
      });

      const finalPages = [
        ...new Map(
          pages
            .flatMap((p) =>
              p.roles.role_page_access.map((rpa) => rpa.app_pages)
            )
            .filter((page): page is NonNullable<typeof page> => page !== null)
            .map((page) => [page.id, page])
        ).values(),
      ];
      if (query.only_ids) {
        const finalPageIds = finalPages.map((page) => page.id);
        return Response.json(finalPageIds);
      } else {
        return Response.json(finalPages);
      }
    } else if (query.role_id) {
      let pages = await prisma.roles.findMany({
        where: {
          id: query.role_id,
        },

        include: {
          role_page_access: {
            include: {
              app_pages: true,
            },
          },
        },
      });

      const finalPages = [
        ...new Map(
          pages
            .flatMap((p) => p.role_page_access.map((rpa) => rpa.app_pages))
            .filter((page): page is NonNullable<typeof page> => page !== null)
            .map((page) => [page.id, page])
        ).values(),
      ];
      if (query.only_ids) {
        const finalPageIds = finalPages.map((page) => page.id);
        return Response.json(finalPageIds);
      } else {
        return Response.json(finalPages);
      }
    } else {
      const data = await prisma.app_pages.findMany({});
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
