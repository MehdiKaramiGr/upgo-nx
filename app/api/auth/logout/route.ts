import { prisma } from "@/lib/prisma";
import { getUserFromAT } from "@/service/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out" });

  let user = await getUserFromAT();

  if (user?.userID) {
    prisma.refresh_tokens.deleteMany({
      where: { user_id: user.userID },
    });
  }

  response.cookies.set({
    name: "refresh_token",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set({
    name: "access_token",
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(0),
  });

  return response;
}
