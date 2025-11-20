import { folderPayloadDtoType } from "@/dto/file/folder-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const upsertFolder = async (payload: folderPayloadDtoType) => {
  let { data } = await http.post(`/files/folders`, payload);

  return data;
};

const mutateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["folders"],
    mutationFn: async (payload: folderPayloadDtoType) => upsertFolder(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
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

export { mutateFolder, upsertFolder };
