import { rolePagePayloadType } from "@/dto/users/roles-page-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const upsertRolePage = async (payload: rolePagePayloadType) => {
  let { data } = await http.post(`/users/roles/page`, payload);

  return data;
};

const mutateRolePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["app", "pages"],
    mutationFn: async (payload: rolePagePayloadType) => upsertRolePage(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["app", "pages"] });
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

export { mutateRolePage, upsertRolePage };
