import { roleActionPayloadType } from "@/dto/users/roles-action-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const upsertRoleAction = async (payload: roleActionPayloadType) => {
  let { data } = await http.post(`/users/roles/action`, payload);

  return data;
};

const mutateRoleAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["app", "actions"],
    mutationFn: async (payload: roleActionPayloadType) =>
      upsertRoleAction(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["app", "actions"] });
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

export { mutateRoleAction, upsertRoleAction };
