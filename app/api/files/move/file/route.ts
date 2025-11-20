import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/get-current-user";
import { validateBody } from "@/lib/validate-body";
import { moveFilePayloadDto } from "@/dto/file/file-dto";

export async function POST(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;
    const body = await validateBody(req, moveFilePayloadDto);
    let result = await prisma.file.update({
      where: { id: body.file_id, owner_id: userID },
      data: {
        folder_id: body.folder_id == null ? null : body.folder_id,
      },
    });

    return Response.json(result);
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === "Record to update not found.") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
