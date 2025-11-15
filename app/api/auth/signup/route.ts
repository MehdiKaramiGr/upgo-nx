import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password, full_name, username } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Check if email is already taken
    const existingUser = await prisma.users.findUnique({
      where: { email, username },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email or username already registered" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        email,
        password_hash: hashedPassword,
        full_name: full_name || null,
        username,
      },
    });

    // Create tokens
    const accessToken = sign(
      { userID: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "10m" },
    );

    const refreshToken = sign(
      { userID: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" },
    );

    // Save refresh token in DB
    await prisma.refresh_tokens.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Return & set cookies
    const res = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 },
    );

    res.headers.append(
      "Set-Cookie",
      serialize("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 10 * 60,
        path: "/",
      }),
    );

    res.headers.append(
      "Set-Cookie",
      serialize("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      }),
    );

    return res;
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
