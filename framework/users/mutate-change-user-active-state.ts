import { changeUserActiveStateDtoType } from "@/dto/users/change-user-active-state-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const changeUserActiveState = async (payload: changeUserActiveStateDtoType) => {
  let { data } = await http.post(`/users/change-user-active-state`, payload);

  return data;
};

const mutateChangeUserActiveState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["users", "list"],
    mutationFn: async (payload: changeUserActiveStateDtoType) =>
      changeUserActiveState(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
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

export { mutateChangeUserActiveState, changeUserActiveState };
