import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/get-current-user";

export async function GET(req: NextRequest) {
  try {
    let userID = (await getUserFromAT(true))?.userID;
    console.log("userID", userID);
    const files = await prisma.file.findMany({
      where: { owner_id: userID, is_deleted: false },
      include: {
        folder: true,
      },
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
