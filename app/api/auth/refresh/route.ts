import { NextResponse } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { parse, serialize } from "cookie";

export async function POST(req: Request) {
  const cookies = parse(req.headers.get("cookie") || "");
  const refreshToken = cookies.refresh_token;
  if (!refreshToken)
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  try {
    const payload: any = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    );

    // check if refresh token exists in DB
    const tokenInDb = await prisma.refresh_tokens.findFirstOrThrow({
      where: { token: refreshToken },
    });
    if (!tokenInDb)
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );

    const accessToken = sign(
      { userID: payload.userID },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "10m" }
    );

    const newRefreshToken = sign(
      { userID: payload.userID },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );
    await prisma.refresh_tokens.updateMany({
      where: { token: refreshToken },
      data: { token: newRefreshToken },
    });

    const res = NextResponse.json({ success: true }, { status: 200 });

    res.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60,
      path: "/",
    });

    res.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
