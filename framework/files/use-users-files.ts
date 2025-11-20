import http from "@/lib/http";
import { file, users } from "@/lib/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

export function useUsersFiles() {
  return useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      const res = await http.get("/files/user-files");
      return res.data as file[];
    },
  });
}
