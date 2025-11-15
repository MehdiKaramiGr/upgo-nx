import { NextResponse } from "next/server";

import { getUserFromAT } from "@/service/get-current-user";
import getUserById from "@/service/get-user-by-id";

export async function GET(req: Request) {
  let userID = (await getUserFromAT())?.userID;
  if (userID == null) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let user = await getUserById(userID);
  if (!user?.is_active) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } else {
    let { password_hash, storageUsed, ...userWOP } = user;

    console.log("userWOP", userWOP);
    return NextResponse.json({
      ...userWOP,
      storageUsed: storageUsed.toString(),
    });
  }
}
