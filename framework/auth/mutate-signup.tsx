import { SignUpDtoType } from "@/dto/auth/signup";
import http from "@/lib/http";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const signUp = async (payload: SignUpDtoType) => {
	let { data } = await http.post(`/auth/signup`, payload);

	return data;
};

const mutateSignUp = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["auth", "signup"],
		mutationFn: async (payload: SignUpDtoType) => signUp(payload),

		onSuccess: (res) => {
			addToast({
				title: "Sign Up Success",
				description: "You have successfully signed up.",
				color: "success",
			});

			return res;
		},
		onError: (err: AxiosError<{ error?: string }>) => {
			addToast({
				title: "Sign Up error",
				description: err?.response?.data?.error ?? "Something Happend !",
				color: "danger",
			});
		},
	});
};

export { mutateSignUp, signUp };
