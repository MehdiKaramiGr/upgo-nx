import http from "@/lib/http";
import { file, folder, users } from "@/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await http.get("/files/folders");
      return res.data as folder[];
    },
  });
}
