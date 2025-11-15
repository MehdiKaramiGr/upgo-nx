import { SignInDtoType } from "@/dto/auth/signin";
import { mutateUsersRolesDtoType } from "@/dto/users/user-roles";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const upsertUsersRole = async (payload: mutateUsersRolesDtoType) => {
  let { data } = await http.post(`/users/users-roles`, payload);

  return data;
};

const mutateUsersRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["users", "roles"],
    mutationFn: async (payload: mutateUsersRolesDtoType) =>
      upsertUsersRole(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users", "roles"] });
      addToast({
        title: "Action done.",
        description: "Your action has been done.",
        color: "success",
      });

      return res;
    },
    onError: (err: AxiosError<{ error?: any }>) => {
      const raw = err?.response?.data?.error;

      // Extract readable message
      const message =
        typeof raw === "string"
          ? raw
          : raw?.properties
          ? Object.values(raw.properties)
              .map((p: any) => p?.errors?.[0])
              .filter(Boolean)
              .join(" | ")
          : "Something happened!";

      addToast({
        title: "Action error",
        description: message,
        color: "danger",
      });
    },
  });
};

export { mutateUsersRole, upsertUsersRole };
