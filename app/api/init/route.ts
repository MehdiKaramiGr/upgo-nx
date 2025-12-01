import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/get-current-user";
import { ensureBucket } from "@/lib/init-bucket";

export async function GET(req: NextRequest) {
  try {
    await ensureBucket();
    return Response.json("done");
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
