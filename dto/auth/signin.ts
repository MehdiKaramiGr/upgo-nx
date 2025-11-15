import z from "zod";

const signInDto = z.object({
	email: z.email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export default signInDto;

export type SignInDtoType = z.infer<typeof signInDto>;
