import { appActionQueryType } from "@/dto/app-action/app-action-dto";
import { appPageQueryType } from "@/dto/app-page/app-page-dto";
import http from "@/lib/http";
import { access_actions, app_pages, roles } from "@/prisma/generated/client";
import { useQuery } from "@tanstack/react-query";

// Overload: when only_ids = true, return number[]
export function useActions(
  params: { only_ids: true } & appPageQueryType
): ReturnType<typeof useQuery<number[], Error>>;

// Overload: default → return app_pages[]
export function useActions(
  params?: appPageQueryType
): ReturnType<typeof useQuery<app_pages[], Error>>;

// Implementation
export function useActions(params?: appActionQueryType) {
  let queryKey = ["app", "actions"];
  if (params?.cur_users) {
    queryKey.push("cur_users");
  }
  if (params?.user_id) {
    queryKey.push(params.user_id);
  }
  if (params?.only_ids) {
    queryKey.push("only_ids");
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await http.get("/app-actions", { params });

      if (params?.only_ids === true) {
        return data as number[];
      }

      return data as access_actions[];
    },
  });
}
