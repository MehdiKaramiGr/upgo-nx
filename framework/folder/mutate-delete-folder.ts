import { deleteFolderQueryDtoType } from "@/dto/file/folder-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const deleteFolder = async (params: deleteFolderQueryDtoType) => {
  let { data } = await http.delete(`/files/folders`, {
    params: params,
  });

  return data;
};

const mutateDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["folders"],
    mutationFn: async (params: deleteFolderQueryDtoType) =>
      deleteFolder(params),

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

export { mutateDeleteFolder, deleteFolder };
