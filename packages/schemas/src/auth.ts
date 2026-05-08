import z from "zod";

export const signInSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(8),
    })
    .strict();

export const signUpSchema = z
    .object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(8),
    })
    .strict();

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;