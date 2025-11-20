import { moveFilePayloadDtoType } from "@/dto/file/file-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const moveFile = async (payload: moveFilePayloadDtoType) => {
  let { data } = await http.post(`/files/move/file`, payload);

  return data;
};

const mutateMoveFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["files"],
    mutationFn: async (payload: moveFilePayloadDtoType) => moveFile(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
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

export { mutateMoveFile };
