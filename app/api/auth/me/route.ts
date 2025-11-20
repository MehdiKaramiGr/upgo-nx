import { NextResponse } from "next/server";

import { getUserFromAT } from "@/service/get-current-user";
import getUserById from "@/service/get-user-by-id";
import { serializeBigInt } from "@/lib/serialize-big-int";

export async function GET(req: Request) {
  try {
    let userID = (await getUserFromAT())?.userID;
    if (userID == null) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let user = await getUserById(userID);
    if (!user?.is_active) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      let { password_hash, ...userWOP } = user;

      return NextResponse.json(serializeBigInt(userWOP));
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error in GET /api/auth/me:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
