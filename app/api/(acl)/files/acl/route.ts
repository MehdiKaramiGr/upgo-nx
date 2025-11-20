import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/get-current-user";
import { file, file_acl } from "@/lib/prisma/generated/client";

export async function GET(req: NextRequest) {
  try {
    let userID = (await getUserFromAT(true))?.userID;
    const files = await prisma.users.findFirst({
      where: { id: userID },

      include: {
        file_acls: {
          include: {
            file: {
              include: {
                owner: {
                  select: {
                    email: true,
                    full_name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return Response.json(files?.file_acls);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
