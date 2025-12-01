import { aclFileQueryType } from "@/dto/acl/acl-dto";
import http from "@/lib/http";
import { file_acl, users } from "@/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

export function useAcl(params?: aclFileQueryType) {
  return useQuery({
    queryKey: ["file", "acl"],
    queryFn: async () => {
      const res = await http.get("/acl", { params });
      return res.data as file_acl[];
    },
    enabled: !!params?.file_id,
  });
}
