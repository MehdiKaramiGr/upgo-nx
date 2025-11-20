import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/get-current-user";
import { validateBody } from "@/lib/validate-body";
import { deleteFolderQueryDto, folderPayloadDto } from "@/dto/file/folder-dto";
import softDeleteFiles from "@/service/soft-delete-files";
import { validateQuery } from "@/lib/validate-query";

export async function GET(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;
    const files = await prisma.folder.findMany({
      where: { owner_id: userID },
    });

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
    const body = await validateBody(req, folderPayloadDto);
    let folder;

    if (body.id) {
      let pp: { name?: string; parent_id?: string | null } = {};

      if (body.name) pp["name"] = body.name;
      if (body.parent_id) pp["parent_id"] = body.parent_id;

      folder = await prisma.folder.update({
        where: { id: body.id },
        data: pp,
      });
    } else {
      if (!body.name) {
        return NextResponse.json(
          { error: "Folder name is required" },
          { status: 400 }
        );
      }

      folder = await prisma.folder.create({
        data: {
          name: body.name,
          parent_id: body.parent_id ?? null,
          owner_id: userID!,
        },
      });
    }

    return Response.json(folder);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let userID = (await getUserFromAT())?.userID;
    const query = validateQuery(req, deleteFolderQueryDto);

    console.log("query", query);

    if (query.recursive) {
      let delFiles = await prisma.file.findMany({
        where: { folder_id: query.id, is_deleted: false, owner_id: userID },
      });

      console.log("delFiles", delFiles);

      await softDeleteFiles(delFiles);
      await prisma.folder.delete({
        where: { id: query.id, owner_id: userID },
      });
    } else {
      await prisma.file.updateMany({
        where: { folder_id: query.id, owner_id: userID },
        data: { folder_id: null },
      });
      await prisma.folder.delete({
        where: { id: query.id, owner_id: userID },
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
