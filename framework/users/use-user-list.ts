import http from "@/lib/http";
import { users } from "@/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

export function useUserList() {
  return useQuery({
    queryKey: ["users", "list"],
    queryFn: async () => {
      const res = await http.get("/users/all");
      return res.data as users[];
    },
  });
}
