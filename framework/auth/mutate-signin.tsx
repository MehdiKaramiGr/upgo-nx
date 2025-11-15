import { SignInDtoType } from "@/dto/auth/signin";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const signIn = async (payload: SignInDtoType) => {
  let { data } = await http.post(`/auth/signin`, payload);

  return data;
};

const mutateSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["auth", "signIn"],
    mutationFn: async (payload: SignInDtoType) => signIn(payload),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      addToast({
        title: "Sign In Success",
        description: "You have successfully signed In.",
        color: "success",
      });

      return res;
    },
    onError: (err: AxiosError<{ error?: string }>) => {
      addToast({
        title: "Sign In error",
        description: err?.response?.data?.error ?? "Something Happend !",
        color: "danger",
      });
    },
  });
};

export { mutateSignIn, signIn };
