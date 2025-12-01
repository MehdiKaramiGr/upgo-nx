import http from "@/lib/http";
import { file, file_acl, users } from "@/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

// stats.UsersCount = result?.[0];
// stats.FilesCount = result?.[1];
// stats.FilesSize = (result?.[2] as any)?._sum?.size;
// stats.DiskSpace = process.env.DISK_SPACE;
// stats.DeletedFilesCount = result?.[3];
// stats.DeletedFilesSize = (result?.[4] as any)?._sum?.size;

interface stats {
  UsersCount: number;
  FilesCount: number;
  FilesSize: number;
  DiskSpace: number;
  DeletedFilesCount: number;
  DeletedFilesSize: number;
  DailyUploadedSizes: { day: string; totalSize: number | null }[];
  DailyDeletedSizes: { day: string; totalSize: number | null }[];
}

export function useStats() {
  // query params start and end
  const searchParams = useSearchParams();
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  return useQuery({
    queryKey: ["dash", "stats", start, end],
    queryFn: async () => {
      const res = await http.get(
        `dashboard?start=${start ?? ""}&end=${end ?? ""}`
      );
      return res.data as stats;
    },
  });
}
