import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { getUserFromAT } from "@/service/getCurrentUser";
import getUserById from "@/service/getUserById";

export async function GET(req: Request) {
  let userID = (await getUserFromAT())?.userID;
  if (userID == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let user = await getUserById(userID);
  if (!user?.is_active) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } else {
    let { password_hash, ...userWOP } = user;

    return NextResponse.json({ ...userWOP });
  }
}
