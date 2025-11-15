import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

export async function getUserFromAT() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("access_token")?.value;
	if (!accessToken) return null;

	try {
		const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
		return payload as { userID: string };
	} catch {
		return null;
	}
}
