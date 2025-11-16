import z from "zod";

const signUpDto = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username is too long"),

    email: z.email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default signUpDto;

export type SignUpDtoType = z.infer<typeof signUpDto>;
