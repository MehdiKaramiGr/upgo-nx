import { aclFileTogglePayloadType } from "@/dto/acl/acl-dto";
import { roleActionPayloadType } from "@/dto/users/roles-action-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const toggleAcl = async (payload: aclFileTogglePayloadType) => {
  let { data } = await http.post(`/acl`, payload);

  return data;
};

const mutateToggleAcl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["file", "acl"],
    mutationFn: async (payload: aclFileTogglePayloadType) => toggleAcl(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["file", "acl"] });
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

export { mutateToggleAcl, toggleAcl };
