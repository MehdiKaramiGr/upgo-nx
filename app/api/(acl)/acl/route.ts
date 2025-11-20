import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/get-current-user";
import { validateQuery } from "@/lib/validate-query";
import { aclFileQueryDto, aclFileTogglePayloadDto } from "@/dto/acl/acl-dto";
import { validateBody } from "@/lib/validate-body";

export async function GET(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;

    let query = validateQuery(req, aclFileQueryDto);

    const files = await prisma.file_acl.findMany({
      where: {
        file_id: query.file_id,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    console.log("files", files);
    return Response.json(files);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;

    // todo: check ownership or if they can share

    let body = await validateBody(req, aclFileTogglePayloadDto);
    let result = "";

    if (body.active_state) {
      await prisma.file_acl.create({
        data: {
          file_id: body.file_id,
          user_id: body.user_id,
        },
      });

      result = "ACL Upldated";
    } else {
      await prisma.file_acl.deleteMany({
        where: {
          file_id: body.file_id,
          user_id: body.user_id,
        },
      });

      result = "ACL Removed";
    }

    return Response.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
