import http from "@/lib/http";
import { roles } from "@/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

export function useRoles() {
  return useQuery({
    queryKey: ["users", "roles"],
    queryFn: async () => {
      const res = await http.get("/users/roles");
      return res.data as roles[];
    },
  });
}
