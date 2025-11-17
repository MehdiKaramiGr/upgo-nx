import { SignInDtoType } from "@/dto/auth/signin-dto";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const logout = async () => {
  let { data } = await http.get(`/auth/logout`);

  return data;
};

const mutateLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => logout(),

    onSuccess: (res) => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      addToast({
        title: "logout Success",
        description: "You have successfully Logged Out.",
        color: "success",
      });

      return res;
    },
    onError: (err: AxiosError<{ error?: string }>) => {
      addToast({
        title: "logout error",
        description: err?.response?.data?.error ?? "Something Happend !",
        color: "danger",
      });
    },
  });
};

export { mutateLogout, logout };
