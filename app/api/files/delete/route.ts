import { deleteFilesPayloadDto } from "@/dto/file/file-dto";
import { prisma } from "@/lib/prisma";
import { validateBody } from "@/lib/validate-body";
import { getUserFromAT } from "@/service/get-current-user";
import softDeleteFiles from "@/service/soft-delete-files";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;
    const body = await validateBody(req, deleteFilesPayloadDto);

    let files = await prisma.file.findMany({
      where: {
        id: { in: body.id },
        owner_id: userID,
        is_deleted: false,
      },
    });

    await softDeleteFiles(files);
    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
