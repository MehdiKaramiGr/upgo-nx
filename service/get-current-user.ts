import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@/lib/prisma/generated/internal/prismaNamespace";

export async function getUserFromAT(dontThrow = false) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  try {
    const payload = verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);

    await prisma.users.findUniqueOrThrow({
      where: { id: (payload as { userID: string }).userID, is_active: true },
    });

    return payload as { userID: string };
  } catch (err) {
    if (dontThrow) {
      return null;
    } else {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new Error("User not found or disabled");
      }
      throw new Error("Invalid access token");
    }
  }
}
