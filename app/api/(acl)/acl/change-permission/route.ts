import {
  aclFileTogglePayloadDto,
  changeAclPermissionPayloadDto,
} from "@/dto/acl/acl-dto";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/lib/validate-body";
import { getUserFromAT } from "@/service/get-current-user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;

    // todo: check ownership or if they can share

    let body = await validateBody(req, changeAclPermissionPayloadDto);
    let result = "";

    if (body.acl_id && body.permission) {
      await prisma.file_acl.update({
        where: {
          id: body.acl_id,
        },
        data: {
          ["can_" + body.permission]: body.active_state,
        },
      });
    } else {
      throw new Error("Invalid ACL ID or permission");
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
