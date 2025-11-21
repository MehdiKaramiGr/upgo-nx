import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserFromAT } from "./service/get-current-user";
import { prisma } from "./lib/prisma";

export async function proxy(req: NextRequest) {
  let user = await getUserFromAT();

  // Define a mapping between page_id and actual paths
  let pagePathMap = {
    "3": "/users", // This assumes that page_id "3" maps to "/users" path
    // Add other mappings as needed
  };

  // Get the accessible pages from the database
  let pages = (
    await prisma.users.findMany({
      where: {
        id: user?.userID,
      },
      include: {
        user_roles: {
          include: {
            roles: {
              include: {
                role_page_access: true,
              },
            },
          },
        },
      },
    })
  )
    .map(({ user_roles }) => user_roles?.map((r) => r.roles.role_page_access))
    .flat(2)
    .map(({ page_id }) => page_id);

  // Get the current request URL path
  const requestedPath = req.nextUrl.pathname;

  // Check if the requested path is in the access list
  const hasAccess = pages.some(
    // @ts-ignore
    (pageId) => pagePathMap[pageId] === requestedPath
  );

  // If user doesn't have access or is not authenticated, redirect to login
  if (!user?.userID || !hasAccess) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/users/:path*", "/api/protected/:path*"],
};
