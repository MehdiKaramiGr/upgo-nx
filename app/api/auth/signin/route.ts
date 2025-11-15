import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export async function POST(req: Request) {
	const { email, password } = await req.json();
	const user = await prisma.users.findUnique({ where: { email } });

	if (!user)
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

	const valid = await compare(password, user.password_hash);
	if (!valid)
		return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

	const accessToken = sign(
		{ userID: user.id },
		process.env.ACCESS_TOKEN_SECRET!,
		{ expiresIn: "10m" }
	);
	const refreshToken = sign(
		{ userID: user.id },
		process.env.REFRESH_TOKEN_SECRET!,
		{ expiresIn: "7d" }
	);

	// Store refreshToken in DB for rotation / invalidation
	await prisma.refresh_tokens.create({
		data: {
			token: refreshToken,
			user_id: user.id,
			expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		},
	});

	const res = NextResponse.json({ success: true }, { status: 200 });

	res.cookies.set("access_token", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 10 * 60,
		path: "/",
	});

	res.cookies.set("refresh_token", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 7 * 24 * 60 * 60,
		path: "/",
	});

	return res;
}
