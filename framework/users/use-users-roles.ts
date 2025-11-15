import { getUsersRolesQueryDtoType } from "@/dto/users/user-roles";
import http from "@/lib/http";
import { users } from "@/lib/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

export function useUsersRoles(props?: getUsersRolesQueryDtoType) {
  return useQuery({
    queryKey: ["users", "roles", props?.id],
    queryFn: async () => {
      const res = await http.get("/users/users-roles", {
        params: props,
      });
      return res.data as number[];
    },
    enabled: !!props?.id,
  });
}
