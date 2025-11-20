import { deleteFilesPayloadDtoType } from "@/dto/file/file-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const deleteFiles = async (payload: deleteFilesPayloadDtoType) => {
  let { data } = await http.post(`/files/delete`, payload);

  return data;
};

const mutateDeleteFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["files"],
    mutationFn: async (payload: deleteFilesPayloadDtoType) =>
      deleteFiles(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
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

export { mutateDeleteFiles, deleteFiles };
