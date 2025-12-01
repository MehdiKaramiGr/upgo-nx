import http from "@/lib/http";
import { file, file_acl, users } from "@/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

interface aclFile extends file {
  owner: {
    email: string;
    full_name: string;
  };
}

interface aclFiles extends file_acl {
  file: aclFile;
}

export function useAclFiles() {
  return useQuery({
    queryKey: ["files", "acl"],
    queryFn: async () => {
      const res = await http.get("/files/acl");
      return res.data as aclFiles[];
    },
  });
}
