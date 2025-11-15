import http from "@/lib/http";
import { users } from "@/lib/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
	return useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const res = await http.get("/auth/me");
			return res.data as users;
		},
		retry: false,
	});
}
