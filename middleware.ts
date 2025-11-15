import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("access_token")?.value;
	if (!token) return NextResponse.redirect(new URL("/login", req.url));

	try {
		verify(token, process.env.ACCESS_TOKEN_SECRET!);
		return NextResponse.next();
	} catch {
		return NextResponse.redirect(new URL("/login", req.url));
	}
}

export const config = {
	matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
